/**
 * Centralized Error Handler for Tommy Coconut Backend
 * Provides consistent error handling, logging, and monitoring
 */

const envConfig = require('./env-config');

class ErrorHandler {
  constructor() {
    this.errorTypes = {
      VALIDATION_ERROR: 'ValidationError',
      AUTHENTICATION_ERROR: 'AuthenticationError',
      AUTHORIZATION_ERROR: 'AuthorizationError',
      RATE_LIMIT_ERROR: 'RateLimitError',
      INTEGRATION_ERROR: 'IntegrationError',
      DATABASE_ERROR: 'DatabaseError',
      NOT_FOUND_ERROR: 'NotFoundError',
      CONFIGURATION_ERROR: 'ConfigurationError',
      NETWORK_ERROR: 'NetworkError',
      UNKNOWN_ERROR: 'UnknownError'
    };

    this.errorCodes = {
      VALIDATION_ERROR: 400,
      AUTHENTICATION_ERROR: 401,
      AUTHORIZATION_ERROR: 403,
      NOT_FOUND_ERROR: 404,
      RATE_LIMIT_ERROR: 429,
      INTEGRATION_ERROR: 502,
      DATABASE_ERROR: 503,
      CONFIGURATION_ERROR: 500,
      NETWORK_ERROR: 503,
      UNKNOWN_ERROR: 500
    };

    // Initialize Sentry if available
    this.initializeSentry();

    // Track error metrics
    this.errorMetrics = {
      total: 0,
      byType: {},
      byEndpoint: {},
      lastError: null
    };
  }

  /**
   * Initialize Sentry for production error tracking
   */
  initializeSentry() {
    if (envConfig.has('monitoring.sentryDsn')) {
      try {
        const Sentry = require('@sentry/node');
        Sentry.init({
          dsn: envConfig.get('monitoring.sentryDsn'),
          environment: envConfig.get('monitoring.environment'),
          tracesSampleRate: 1.0
        });
        this.sentry = Sentry;
        console.log('Sentry initialized successfully');
      } catch (error) {
        console.warn('Sentry initialization failed:', error.message);
        this.sentry = null;
      }
    }
  }

  /**
   * Main error handling method
   * @param {Error} error - The error object
   * @param {Object} context - Additional context (endpoint, userId, etc.)
   * @returns {Object} Formatted error response
   */
  handle(error, context = {}) {
    // Determine error type
    const errorType = this.getErrorType(error);
    const statusCode = this.errorCodes[errorType] || 500;

    // Create error response
    const errorResponse = {
      error: true,
      type: errorType,
      message: this.getSafeErrorMessage(error, errorType),
      statusCode,
      timestamp: new Date().toISOString()
    };

    // Add request ID if available
    if (context.requestId) {
      errorResponse.requestId = context.requestId;
    }

    // In development, add more details
    if (envConfig.get('monitoring.environment') === 'development') {
      errorResponse.details = {
        stack: error.stack,
        context,
        originalError: error.message
      };
    }

    // Log the error
    this.logError(error, errorType, context);

    // Track metrics
    this.updateMetrics(errorType, context);

    // Send to Sentry if available
    if (this.sentry && statusCode >= 500) {
      this.sentry.captureException(error, {
        tags: {
          errorType,
          endpoint: context.endpoint
        },
        extra: context
      });
    }

    return errorResponse;
  }

  /**
   * Determine error type based on error properties
   * @param {Error} error - The error object
   * @returns {string} Error type
   */
  getErrorType(error) {
    // Check for specific error types
    if (error.name === 'ValidationError' || error.statusCode === 400) {
      return this.errorTypes.VALIDATION_ERROR;
    }
    if (error.name === 'AuthenticationError' || error.statusCode === 401) {
      return this.errorTypes.AUTHENTICATION_ERROR;
    }
    if (error.name === 'AuthorizationError' || error.statusCode === 403) {
      return this.errorTypes.AUTHORIZATION_ERROR;
    }
    if (error.name === 'RateLimitError' || error.statusCode === 429) {
      return this.errorTypes.RATE_LIMIT_ERROR;
    }
    if (error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      return this.errorTypes.NETWORK_ERROR;
    }
    if (error.message?.includes('Airtable') || error.message?.includes('Supabase')) {
      return this.errorTypes.INTEGRATION_ERROR;
    }
    if (error.message?.includes('configuration') || error.message?.includes('environment')) {
      return this.errorTypes.CONFIGURATION_ERROR;
    }
    if (error.statusCode === 404) {
      return this.errorTypes.NOT_FOUND_ERROR;
    }

    return this.errorTypes.UNKNOWN_ERROR;
  }

  /**
   * Get safe error message for client response
   * @param {Error} error - The error object
   * @param {string} errorType - The error type
   * @returns {string} Safe error message
   */
  getSafeErrorMessage(error, errorType) {
    const safeMessages = {
      [this.errorTypes.VALIDATION_ERROR]: 'Invalid input provided. Please check your data and try again.',
      [this.errorTypes.AUTHENTICATION_ERROR]: 'Authentication failed. Please check your credentials.',
      [this.errorTypes.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
      [this.errorTypes.RATE_LIMIT_ERROR]: 'Too many requests. Please try again later.',
      [this.errorTypes.INTEGRATION_ERROR]: 'External service temporarily unavailable. Please try again.',
      [this.errorTypes.DATABASE_ERROR]: 'Database operation failed. Please try again.',
      [this.errorTypes.NOT_FOUND_ERROR]: 'The requested resource was not found.',
      [this.errorTypes.CONFIGURATION_ERROR]: 'System configuration error. Please contact support.',
      [this.errorTypes.NETWORK_ERROR]: 'Network error. Please check your connection.',
      [this.errorTypes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
    };

    // For validation errors, we can be more specific
    if (errorType === this.errorTypes.VALIDATION_ERROR && error.details) {
      return error.message;
    }

    // In development, return actual error message
    if (envConfig.get('monitoring.environment') === 'development') {
      return error.message || safeMessages[errorType];
    }

    // In production, return safe message
    return safeMessages[errorType] || safeMessages[this.errorTypes.UNKNOWN_ERROR];
  }

  /**
   * Log error with appropriate level
   * @param {Error} error - The error object
   * @param {string} errorType - The error type
   * @param {Object} context - Additional context
   */
  logError(error, errorType, context) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      errorType,
      message: error.message,
      endpoint: context.endpoint,
      userId: context.userId,
      requestId: context.requestId,
      environment: envConfig.get('monitoring.environment')
    };

    // Determine log level
    const statusCode = this.errorCodes[errorType];
    if (statusCode >= 500) {
      console.error('ERROR:', JSON.stringify(logEntry, null, 2));
      if (envConfig.get('monitoring.environment') === 'development') {
        console.error('Stack:', error.stack);
      }
    } else if (statusCode >= 400) {
      console.warn('WARNING:', JSON.stringify(logEntry, null, 2));
    } else {
      console.info('INFO:', JSON.stringify(logEntry, null, 2));
    }
  }

  /**
   * Update error metrics
   * @param {string} errorType - The error type
   * @param {Object} context - Additional context
   */
  updateMetrics(errorType, context) {
    this.errorMetrics.total++;
    this.errorMetrics.byType[errorType] = (this.errorMetrics.byType[errorType] || 0) + 1;

    if (context.endpoint) {
      this.errorMetrics.byEndpoint[context.endpoint] =
        (this.errorMetrics.byEndpoint[context.endpoint] || 0) + 1;
    }

    this.errorMetrics.lastError = {
      type: errorType,
      timestamp: new Date().toISOString(),
      endpoint: context.endpoint
    };
  }

  /**
   * Get error metrics
   * @returns {Object} Current error metrics
   */
  getMetrics() {
    return {
      ...this.errorMetrics,
      environment: envConfig.get('monitoring.environment'),
      uptime: process.uptime()
    };
  }

  /**
   * Create custom error classes
   */
  createError(type, message, details = {}) {
    const error = new Error(message);
    error.name = type;
    error.statusCode = this.errorCodes[type] || 500;
    error.details = details;
    return error;
  }

  /**
   * Validation error helper
   */
  validationError(message, fields = []) {
    return this.createError(
      this.errorTypes.VALIDATION_ERROR,
      message,
      { fields }
    );
  }

  /**
   * Authentication error helper
   */
  authenticationError(message = 'Authentication required') {
    return this.createError(
      this.errorTypes.AUTHENTICATION_ERROR,
      message
    );
  }

  /**
   * Rate limit error helper
   */
  rateLimitError(retryAfter = 60) {
    return this.createError(
      this.errorTypes.RATE_LIMIT_ERROR,
      'Rate limit exceeded',
      { retryAfter }
    );
  }

  /**
   * Integration error helper
   */
  integrationError(service, originalError) {
    return this.createError(
      this.errorTypes.INTEGRATION_ERROR,
      `${service} integration failed: ${originalError.message}`,
      { service, originalError: originalError.message }
    );
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export for use in other functions
module.exports = errorHandler;