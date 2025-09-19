/**
 * Environment Configuration Manager
 * Centralizes environment variable access with validation
 */

class EnvConfig {
  constructor() {
    this.config = {
      // Airtable Configuration
      airtable: {
        pat: process.env.AIRTABLE_PAT,
        baseId: process.env.AIRTABLE_BASE_ID,
        guestsTableId: process.env.AIRTABLE_GUESTS_TABLE_ID || 'tblGuestInquiries',
        bookingsTableId: process.env.AIRTABLE_BOOKINGS_TABLE_ID || 'tblBookings',
        propertiesTableId: process.env.AIRTABLE_PROPERTIES_TABLE_ID || 'tblProperties'
      },

      // Cloudinary Configuration
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
      },

      // Supabase Configuration (for future implementation)
      supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      },

      // WhatsApp Business API (for future implementation)
      whatsapp: {
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
        verifyToken: process.env.WHATSAPP_VERIFY_TOKEN
      },

      // Email Configuration
      email: {
        sendgridApiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'hello@tommycoconut.com',
        notificationEmail: process.env.NOTIFICATION_EMAIL || 'bookings@tommycoconut.com'
      },

      // Monitoring & Analytics
      monitoring: {
        sentryDsn: process.env.SENTRY_DSN,
        logLevel: process.env.LOG_LEVEL || 'info',
        environment: process.env.NODE_ENV || 'development'
      },

      // Security
      security: {
        apiKey: process.env.API_KEY,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1 minute default
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '10'), // 10 requests per window
        allowedOrigins: process.env.ALLOWED_ORIGINS ?
          process.env.ALLOWED_ORIGINS.split(',') :
          ['https://tommycoconut.com', 'https://www.tommycoconut.com']
      }
    };

    this.requiredVars = {
      critical: [
        'AIRTABLE_PAT',
        'AIRTABLE_BASE_ID'
      ],
      recommended: [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'SENTRY_DSN'
      ]
    };
  }

  /**
   * Validates environment configuration
   * @returns {Object} Validation result with status and missing variables
   */
  validate() {
    const result = {
      isValid: true,
      missingCritical: [],
      missingRecommended: [],
      warnings: []
    };

    // Check critical variables
    for (const varName of this.requiredVars.critical) {
      if (!process.env[varName] || process.env[varName].includes('your_')) {
        result.missingCritical.push(varName);
        result.isValid = false;
      }
    }

    // Check recommended variables
    for (const varName of this.requiredVars.recommended) {
      if (!process.env[varName] || process.env[varName].includes('your_')) {
        result.missingRecommended.push(varName);
        result.warnings.push(`Missing recommended variable: ${varName}`);
      }
    }

    // Additional validation checks
    if (this.config.airtable.pat && !this.config.airtable.pat.startsWith('pat')) {
      result.warnings.push('AIRTABLE_PAT should start with "pat"');
    }

    if (this.config.monitoring.environment === 'production' && !this.config.monitoring.sentryDsn) {
      result.warnings.push('Sentry DSN is highly recommended for production environments');
    }

    return result;
  }

  /**
   * Gets configuration value by path
   * @param {string} path - Dot-separated path to config value (e.g., 'airtable.baseId')
   * @returns {any} Configuration value
   */
  get(path) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        throw new Error(`Configuration not found: ${path}`);
      }
    }

    return value;
  }

  /**
   * Checks if a configuration value exists and is valid
   * @param {string} path - Dot-separated path to config value
   * @returns {boolean} True if configuration exists and is not a placeholder
   */
  has(path) {
    try {
      const value = this.get(path);
      return value && !value.includes('your_') && value !== '';
    } catch {
      return false;
    }
  }

  /**
   * Gets all configuration
   * @returns {Object} Complete configuration object
   */
  getAll() {
    return this.config;
  }

  /**
   * Generates a health report for the configuration
   * @returns {Object} Health report with status and recommendations
   */
  healthReport() {
    const validation = this.validate();
    const report = {
      status: validation.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: this.config.monitoring.environment,
      criticalIssues: validation.missingCritical,
      warnings: validation.warnings,
      recommendations: []
    };

    // Add recommendations based on configuration state
    if (!this.has('supabase.url')) {
      report.recommendations.push('Consider implementing Supabase for better data management');
    }

    if (!this.has('email.sendgridApiKey')) {
      report.recommendations.push('Email notifications are not configured');
    }

    if (!this.has('whatsapp.accessToken')) {
      report.recommendations.push('WhatsApp Business API integration pending');
    }

    if (validation.missingCritical.length > 0) {
      report.recommendations.push('Critical configuration missing - forms may not work');
    }

    return report;
  }
}

// Create singleton instance
const envConfig = new EnvConfig();

// Export for use in other functions
module.exports = envConfig;