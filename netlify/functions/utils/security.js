/**
 * Security Layer for Tommy Coconut Backend
 * Provides rate limiting, request validation, and authentication
 */

const envConfig = require('./env-config');
const errorHandler = require('./error-handler');
const crypto = require('crypto');

class SecurityManager {
  constructor() {
    // In-memory rate limit store (replace with Redis in production)
    this.rateLimitStore = new Map();

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanupRateLimitStore(), 5 * 60 * 1000);

    // Security configurations
    this.config = {
      rateLimitWindow: envConfig.get('security.rateLimitWindow'),
      rateLimitMax: envConfig.get('security.rateLimitMax'),
      allowedOrigins: envConfig.get('security.allowedOrigins'),
      apiKey: envConfig.get('security.apiKey')
    };

    // Blocked IPs (can be loaded from database)
    this.blockedIPs = new Set();

    // Suspicious activity tracker
    this.suspiciousActivity = new Map();
  }

  /**
   * Main middleware for security checks
   * @param {Object} event - Netlify function event
   * @returns {Object|null} Returns error response or null if checks pass
   */
  async validateRequest(event) {
    try {
      // 1. Check if IP is blocked
      const clientIP = this.getClientIP(event);
      if (this.blockedIPs.has(clientIP)) {
        return {
          statusCode: 403,
          body: JSON.stringify(errorHandler.handle(
            errorHandler.authorizationError('Access denied'),
            { endpoint: event.path, ip: clientIP }
          ))
        };
      }

      // 2. Validate origin
      const originCheck = this.validateOrigin(event);
      if (!originCheck.valid) {
        this.trackSuspiciousActivity(clientIP, 'invalid_origin');
        return {
          statusCode: 403,
          headers: this.getCorsHeaders(),
          body: JSON.stringify(errorHandler.handle(
            errorHandler.authorizationError(originCheck.message),
            { endpoint: event.path, origin: event.headers.origin }
          ))
        };
      }

      // 3. Check rate limit
      const rateLimitCheck = this.checkRateLimit(clientIP, event.path);
      if (!rateLimitCheck.allowed) {
        return {
          statusCode: 429,
          headers: {
            ...this.getCorsHeaders(),
            'Retry-After': rateLimitCheck.retryAfter.toString(),
            'X-RateLimit-Limit': this.config.rateLimitMax.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitCheck.resetTime.toString()
          },
          body: JSON.stringify(errorHandler.handle(
            errorHandler.rateLimitError(rateLimitCheck.retryAfter),
            { endpoint: event.path, ip: clientIP }
          ))
        };
      }

      // 4. Validate API key if configured
      if (this.config.apiKey && event.path.includes('/api/')) {
        const apiKeyValid = this.validateApiKey(event);
        if (!apiKeyValid) {
          this.trackSuspiciousActivity(clientIP, 'invalid_api_key');
          return {
            statusCode: 401,
            headers: this.getCorsHeaders(),
            body: JSON.stringify(errorHandler.handle(
              errorHandler.authenticationError('Invalid API key'),
              { endpoint: event.path }
            ))
          };
        }
      }

      // 5. Validate request body
      if (event.body && event.httpMethod === 'POST') {
        const bodyValidation = this.validateRequestBody(event.body);
        if (!bodyValidation.valid) {
          return {
            statusCode: 400,
            headers: this.getCorsHeaders(),
            body: JSON.stringify(errorHandler.handle(
              errorHandler.validationError(bodyValidation.message, bodyValidation.fields),
              { endpoint: event.path }
            ))
          };
        }
      }

      // 6. Check for suspicious patterns
      const suspiciousCheck = this.checkSuspiciousPatterns(event);
      if (suspiciousCheck.suspicious) {
        this.trackSuspiciousActivity(clientIP, suspiciousCheck.reason);
        // Don't block, but log for monitoring
        console.warn('Suspicious activity detected:', {
          ip: clientIP,
          reason: suspiciousCheck.reason,
          endpoint: event.path
        });
      }

      // All checks passed
      return null;

    } catch (error) {
      console.error('Security validation error:', error);
      return {
        statusCode: 500,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(errorHandler.handle(error, { endpoint: event.path }))
      };
    }
  }

  /**
   * Get client IP address
   * @param {Object} event - Netlify function event
   * @returns {string} Client IP address
   */
  getClientIP(event) {
    return event.headers['x-forwarded-for'] ||
           event.headers['x-real-ip'] ||
           event.headers['client-ip'] ||
           'unknown';
  }

  /**
   * Validate request origin
   * @param {Object} event - Netlify function event
   * @returns {Object} Validation result
   */
  validateOrigin(event) {
    const origin = event.headers.origin || event.headers.referer;

    // Allow requests without origin (e.g., server-to-server)
    if (!origin && event.headers['user-agent']?.includes('Netlify')) {
      return { valid: true };
    }

    // Check if origin is allowed
    if (origin) {
      const originUrl = new URL(origin);
      const isAllowed = this.config.allowedOrigins.some(allowed => {
        if (allowed.includes('*')) {
          // Handle wildcard domains
          const pattern = allowed.replace('*', '.*');
          return new RegExp(pattern).test(originUrl.origin);
        }
        return originUrl.origin === allowed;
      });

      if (!isAllowed) {
        return {
          valid: false,
          message: `Origin ${origin} is not allowed`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check rate limiting
   * @param {string} clientIP - Client IP address
   * @param {string} endpoint - API endpoint
   * @returns {Object} Rate limit check result
   */
  checkRateLimit(clientIP, endpoint) {
    const key = `${clientIP}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindow;

    // Get or create rate limit entry
    let entry = this.rateLimitStore.get(key);
    if (!entry) {
      entry = { requests: [], blockedUntil: 0 };
      this.rateLimitStore.set(key, entry);
    }

    // Check if currently blocked
    if (entry.blockedUntil > now) {
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
        resetTime: entry.blockedUntil
      };
    }

    // Remove old requests outside the window
    entry.requests = entry.requests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (entry.requests.length >= this.config.rateLimitMax) {
      // Block for double the window duration
      entry.blockedUntil = now + (this.config.rateLimitWindow * 2);
      return {
        allowed: false,
        retryAfter: Math.ceil(this.config.rateLimitWindow * 2 / 1000),
        resetTime: entry.blockedUntil
      };
    }

    // Add current request
    entry.requests.push(now);

    return {
      allowed: true,
      remaining: this.config.rateLimitMax - entry.requests.length,
      resetTime: now + this.config.rateLimitWindow
    };
  }

  /**
   * Validate API key
   * @param {Object} event - Netlify function event
   * @returns {boolean} True if API key is valid
   */
  validateApiKey(event) {
    const apiKey = event.headers['x-api-key'] || event.headers['authorization'];

    if (!apiKey) {
      return false;
    }

    // Remove 'Bearer ' prefix if present
    const cleanKey = apiKey.replace('Bearer ', '');

    // Constant-time comparison to prevent timing attacks
    return this.secureCompare(cleanKey, this.config.apiKey);
  }

  /**
   * Secure string comparison
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {boolean} True if strings are equal
   */
  secureCompare(a, b) {
    if (!a || !b || a.length !== b.length) {
      return false;
    }

    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);

    return crypto.timingSafeEqual(bufferA, bufferB);
  }

  /**
   * Validate request body
   * @param {string} body - Request body
   * @returns {Object} Validation result
   */
  validateRequestBody(body) {
    try {
      // Parse body
      const data = typeof body === 'string' ? JSON.parse(body) : body;

      // Check for common injection patterns
      const injectionPatterns = [
        /<script[\s\S]*?<\/script>/gi,  // Script tags
        /javascript:/gi,                 // JavaScript protocol
        /on\w+\s*=/gi,                   // Event handlers
        /\$\{.*\}/g,                     // Template literals
        /\{\{.*\}\}/g,                   // Template expressions
        /'.*OR.*'/gi,                    // SQL injection
        /--$/,                           // SQL comment
        /;.*DROP.*TABLE/gi              // SQL drop table
      ];

      const checkValue = (value, path = '') => {
        if (typeof value === 'string') {
          for (const pattern of injectionPatterns) {
            if (pattern.test(value)) {
              return {
                valid: false,
                message: 'Potentially malicious content detected',
                fields: [path]
              };
            }
          }
          // Check for excessive length
          if (value.length > 10000) {
            return {
              valid: false,
              message: 'Field value too long',
              fields: [path]
            };
          }
        } else if (typeof value === 'object' && value !== null) {
          for (const key in value) {
            const result = checkValue(value[key], path ? `${path}.${key}` : key);
            if (!result.valid) {
              return result;
            }
          }
        }
        return { valid: true };
      };

      return checkValue(data);

    } catch (error) {
      return {
        valid: false,
        message: 'Invalid JSON in request body'
      };
    }
  }

  /**
   * Check for suspicious patterns
   * @param {Object} event - Netlify function event
   * @returns {Object} Suspicious check result
   */
  checkSuspiciousPatterns(event) {
    const userAgent = event.headers['user-agent'] || '';
    const path = event.path;

    // Check for bot patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i
    ];

    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        return {
          suspicious: true,
          reason: 'bot_detected'
        };
      }
    }

    // Check for path traversal attempts
    if (path.includes('../') || path.includes('..\\')) {
      return {
        suspicious: true,
        reason: 'path_traversal'
      };
    }

    // Check for common vulnerability scan paths
    const scanPaths = [
      '/admin',
      '/wp-admin',
      '/.env',
      '/config',
      '/.git',
      '/phpmyadmin',
      '/api/v1/users'
    ];

    if (scanPaths.some(scan => path.includes(scan))) {
      return {
        suspicious: true,
        reason: 'vulnerability_scan'
      };
    }

    return { suspicious: false };
  }

  /**
   * Track suspicious activity
   * @param {string} clientIP - Client IP address
   * @param {string} reason - Reason for suspicion
   */
  trackSuspiciousActivity(clientIP, reason) {
    const entry = this.suspiciousActivity.get(clientIP) || {
      count: 0,
      reasons: [],
      firstSeen: Date.now()
    };

    entry.count++;
    entry.reasons.push({
      reason,
      timestamp: Date.now()
    });
    entry.lastSeen = Date.now();

    this.suspiciousActivity.set(clientIP, entry);

    // Auto-block if too many suspicious activities
    if (entry.count >= 10) {
      this.blockedIPs.add(clientIP);
      console.warn(`IP ${clientIP} has been blocked due to suspicious activity`);
    }
  }

  /**
   * Cleanup rate limit store
   */
  cleanupRateLimitStore() {
    const now = Date.now();
    const windowAge = this.config.rateLimitWindow * 2;

    for (const [key, entry] of this.rateLimitStore.entries()) {
      // Remove entries with no recent requests and no active block
      const lastRequest = entry.requests[entry.requests.length - 1] || 0;
      if (lastRequest < now - windowAge && entry.blockedUntil < now) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Get CORS headers
   * @returns {Object} CORS headers
   */
  getCorsHeaders() {
    return {
      'Access-Control-Allow-Origin': '*', // Will be restricted based on origin validation
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '86400'
    };
  }

  /**
   * Generate secure API key
   * @returns {string} Secure API key
   */
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Get security metrics
   * @returns {Object} Security metrics
   */
  getMetrics() {
    return {
      blockedIPs: Array.from(this.blockedIPs),
      suspiciousActivityCount: this.suspiciousActivity.size,
      rateLimitEntries: this.rateLimitStore.size,
      topSuspiciousIPs: Array.from(this.suspiciousActivity.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([ip, data]) => ({ ip, ...data }))
    };
  }
}

// Create singleton instance
const securityManager = new SecurityManager();

// Export for use in other functions
module.exports = securityManager;