/**
 * Unified Form Handler for Tommy Coconut
 * Consolidates all form submission logic with proper error handling, validation, and integrations
 */

const envConfig = require('./utils/env-config');
const errorHandler = require('./utils/error-handler');
const securityManager = require('./utils/security');
const supabaseManager = require('./utils/supabase-client');

// Form type definitions
const FORM_TYPES = {
  CONTACT: 'contact',
  BOOKING_INQUIRY: 'booking_inquiry',
  NEWSLETTER: 'newsletter',
  CONCIERGE: 'concierge',
  VIP_PASS: 'vip_pass',
  EARLY_ACCESS: 'early_access',
  ROUND_TABLE: 'round_table'
};

// Validation schemas for each form type
const validationSchemas = {
  [FORM_TYPES.CONTACT]: {
    required: ['name', 'email', 'message'],
    email: ['email'],
    minLength: { message: 10 },
    maxLength: { message: 5000 }
  },
  [FORM_TYPES.BOOKING_INQUIRY]: {
    required: ['firstName', 'lastName', 'email', 'checkIn', 'checkOut', 'propertyId'],
    email: ['email'],
    phone: ['phone'],
    date: ['checkIn', 'checkOut'],
    integer: ['guestsCount']
  },
  [FORM_TYPES.NEWSLETTER]: {
    required: ['email'],
    email: ['email']
  },
  [FORM_TYPES.CONCIERGE]: {
    required: ['name', 'email', 'service'],
    email: ['email'],
    phone: ['phone']
  },
  [FORM_TYPES.VIP_PASS]: {
    required: ['firstName', 'lastName', 'email'],
    email: ['email'],
    phone: ['phone']
  },
  [FORM_TYPES.EARLY_ACCESS]: {
    required: ['email', 'name'],
    email: ['email']
  },
  [FORM_TYPES.ROUND_TABLE]: {
    required: ['email', 'name', 'interested'],
    email: ['email']
  }
};

/**
 * Main handler function
 */
exports.handler = async (event) => {
  // Generate request ID for tracking
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    // 1. Basic request validation
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: securityManager.getCorsHeaders(),
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: securityManager.getCorsHeaders(),
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // 2. Security validation
    const securityCheck = await securityManager.validateRequest(event);
    if (securityCheck) {
      return securityCheck;
    }

    // 3. Parse and validate form data
    let formData;
    try {
      formData = JSON.parse(event.body);
    } catch (error) {
      return createErrorResponse(
        errorHandler.validationError('Invalid JSON in request body'),
        { requestId }
      );
    }

    // 4. Determine form type
    const formType = formData.formType || detectFormType(formData);
    if (!formType) {
      return createErrorResponse(
        errorHandler.validationError('Unable to determine form type'),
        { requestId }
      );
    }

    // 5. Validate form data against schema
    const validationResult = validateFormData(formData, formType);
    if (!validationResult.valid) {
      return createErrorResponse(
        errorHandler.validationError(validationResult.message, validationResult.fields),
        { requestId }
      );
    }

    // 6. Sanitize form data
    const sanitizedData = sanitizeFormData(formData);

    // 7. Process form based on type
    const result = await processForm(formType, sanitizedData, {
      requestId,
      clientIP: securityManager.getClientIP(event),
      userAgent: event.headers['user-agent'],
      referrer: event.headers.referer || event.headers.referrer
    });

    // 8. Track analytics
    await trackFormSubmission(formType, result, {
      requestId,
      duration: Date.now() - startTime
    });

    // 9. Return success response
    return {
      statusCode: 200,
      headers: securityManager.getCorsHeaders(),
      body: JSON.stringify({
        success: true,
        message: result.message || 'Form submitted successfully',
        data: result.data || {},
        requestId
      })
    };

  } catch (error) {
    console.error('Form handler error:', error);
    return createErrorResponse(error, {
      requestId,
      formType: formData?.formType
    });
  }
};

/**
 * Detect form type based on fields present
 */
function detectFormType(data) {
  if (data.checkIn && data.checkOut && data.propertyId) {
    return FORM_TYPES.BOOKING_INQUIRY;
  }
  if (data.service && (data.concierge || data.propertyId)) {
    return FORM_TYPES.CONCIERGE;
  }
  if (data.vipPass || data.earlyBird) {
    return FORM_TYPES.VIP_PASS;
  }
  if (data.interested && data.roundTable) {
    return FORM_TYPES.ROUND_TABLE;
  }
  if (data.newsletter === true) {
    return FORM_TYPES.NEWSLETTER;
  }
  if (data.message) {
    return FORM_TYPES.CONTACT;
  }
  return null;
}

/**
 * Validate form data against schema
 */
function validateFormData(data, formType) {
  const schema = validationSchemas[formType];
  if (!schema) {
    return { valid: false, message: 'Unknown form type' };
  }

  const errors = [];
  const invalidFields = [];

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`${field} is required`);
        invalidFields.push(field);
      }
    }
  }

  // Validate email fields
  if (schema.email) {
    for (const field of schema.email) {
      if (data[field] && !isValidEmail(data[field])) {
        errors.push(`${field} must be a valid email address`);
        invalidFields.push(field);
      }
    }
  }

  // Validate phone fields
  if (schema.phone) {
    for (const field of schema.phone) {
      if (data[field] && !isValidPhone(data[field])) {
        errors.push(`${field} must be a valid phone number`);
        invalidFields.push(field);
      }
    }
  }

  // Validate date fields
  if (schema.date) {
    for (const field of schema.date) {
      if (data[field] && !isValidDate(data[field])) {
        errors.push(`${field} must be a valid date`);
        invalidFields.push(field);
      }
    }
  }

  // Validate integer fields
  if (schema.integer) {
    for (const field of schema.integer) {
      if (data[field] && !Number.isInteger(Number(data[field]))) {
        errors.push(`${field} must be a whole number`);
        invalidFields.push(field);
      }
    }
  }

  // Check min/max length
  if (schema.minLength) {
    for (const [field, minLength] of Object.entries(schema.minLength)) {
      if (data[field] && data[field].length < minLength) {
        errors.push(`${field} must be at least ${minLength} characters`);
        invalidFields.push(field);
      }
    }
  }

  if (schema.maxLength) {
    for (const [field, maxLength] of Object.entries(schema.maxLength)) {
      if (data[field] && data[field].length > maxLength) {
        errors.push(`${field} must not exceed ${maxLength} characters`);
        invalidFields.push(field);
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors.join(', '),
      fields: invalidFields
    };
  }

  return { valid: true };
}

/**
 * Sanitize form data
 */
function sanitizeFormData(data) {
  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove HTML tags and trim whitespace
      sanitized[key] = value
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 10000); // Max field length
    } else {
      sanitized[key] = value;
    }
  }

  // Normalize email to lowercase
  if (sanitized.email) {
    sanitized.email = sanitized.email.toLowerCase();
  }

  return sanitized;
}

/**
 * Process form based on type
 */
async function processForm(formType, data, context) {
  switch (formType) {
    case FORM_TYPES.BOOKING_INQUIRY:
      return await processBookingInquiry(data, context);

    case FORM_TYPES.CONTACT:
      return await processContactForm(data, context);

    case FORM_TYPES.NEWSLETTER:
      return await processNewsletterSignup(data, context);

    case FORM_TYPES.CONCIERGE:
      return await processConciergeRequest(data, context);

    case FORM_TYPES.VIP_PASS:
      return await processVIPPassSignup(data, context);

    case FORM_TYPES.EARLY_ACCESS:
      return await processEarlyAccess(data, context);

    case FORM_TYPES.ROUND_TABLE:
      return await processRoundTable(data, context);

    default:
      throw new Error(`Unsupported form type: ${formType}`);
  }
}

/**
 * Process booking inquiry
 */
async function processBookingInquiry(data, context) {
  // Create or update guest in Supabase
  let guest = null;
  if (supabaseManager.isAvailable()) {
    guest = await supabaseManager.upsertGuest({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      source: 'website_booking_inquiry'
    });

    // Create inquiry record
    await supabaseManager.createInquiry({
      guestId: guest.id,
      propertyId: data.propertyId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guestsCount: data.guestsCount,
      message: data.message,
      source: 'website',
      metadata: {
        requestId: context.requestId,
        referrer: context.referrer
      }
    });
  }

  // Send to Airtable for business workflows
  await sendToAirtable('bookingInquiries', {
    ...data,
    supabaseGuestId: guest?.id,
    timestamp: new Date().toISOString(),
    source: 'website'
  });

  // Send notification emails
  await sendNotificationEmail('booking_inquiry', data);

  return {
    message: 'Your booking inquiry has been received. We\'ll contact you within 24 hours.',
    data: {
      guestId: guest?.id,
      inquiryReceived: true
    }
  };
}

/**
 * Process contact form
 */
async function processContactForm(data, context) {
  // Store in Supabase if available
  if (supabaseManager.isAvailable()) {
    const guest = await supabaseManager.upsertGuest({
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' '),
      email: data.email,
      phone: data.phone,
      source: 'website_contact'
    });

    // Track as an inquiry without specific property
    await supabaseManager.createInquiry({
      guestId: guest.id,
      message: data.message,
      source: 'contact_form',
      metadata: {
        subject: data.subject,
        requestId: context.requestId
      }
    });
  }

  // Send to Airtable
  await sendToAirtable('contactSubmissions', {
    ...data,
    timestamp: new Date().toISOString()
  });

  // Send notification email
  await sendNotificationEmail('contact', data);

  return {
    message: 'Thank you for contacting us. We\'ll respond within 24 hours.',
    data: { contactReceived: true }
  };
}

/**
 * Process newsletter signup
 */
async function processNewsletterSignup(data, context) {
  // Add to Supabase
  if (supabaseManager.isAvailable()) {
    await supabaseManager.upsertGuest({
      email: data.email,
      firstName: data.name?.split(' ')[0],
      tags: ['newsletter'],
      source: 'website_newsletter',
      preferences: {
        newsletter: true,
        marketingEmails: true
      }
    });
  }

  // Add to Airtable mailing list
  await sendToAirtable('newsletter', {
    email: data.email,
    name: data.name,
    signupDate: new Date().toISOString(),
    source: data.source || 'website'
  });

  // Send welcome email
  await sendWelcomeEmail(data.email, data.name);

  return {
    message: 'Welcome to the Tommy Coconut family! Check your inbox for a special welcome gift.',
    data: { subscribed: true }
  };
}

/**
 * Process concierge request
 */
async function processConciergeRequest(data, context) {
  // Store request
  if (supabaseManager.isAvailable()) {
    const guest = await supabaseManager.upsertGuest({
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' '),
      email: data.email,
      phone: data.phone,
      tags: ['concierge_user'],
      source: 'website_concierge'
    });

    await supabaseManager.createInquiry({
      guestId: guest.id,
      propertyId: data.propertyId,
      message: `Concierge Service Request: ${data.service}\n\nDetails: ${data.details}`,
      source: 'concierge',
      metadata: {
        service: data.service,
        urgency: data.urgency || 'normal'
      }
    });
  }

  // Send to Airtable for immediate action
  await sendToAirtable('conciergeRequests', {
    ...data,
    timestamp: new Date().toISOString(),
    priority: data.urgency === 'urgent' ? 'high' : 'normal'
  });

  // Send urgent notification if needed
  if (data.urgency === 'urgent') {
    await sendUrgentNotification('concierge', data);
  }

  return {
    message: 'Your concierge request has been received. Our team will contact you shortly.',
    data: { requestReceived: true }
  };
}

/**
 * Process VIP Pass signup
 */
async function processVIPPassSignup(data, context) {
  // Generate VIP Pass code
  const vipCode = generateVIPCode();

  // Store in database
  if (supabaseManager.isAvailable()) {
    const guest = await supabaseManager.upsertGuest({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: ['vip_pass', 'early_bird'],
      source: 'website_vip_pass',
      preferences: {
        vipPass: true,
        vipCode: vipCode,
        signupDate: new Date().toISOString()
      }
    });
  }

  // Send to Airtable
  await sendToAirtable('vipPassSignups', {
    ...data,
    vipCode: vipCode,
    signupDate: new Date().toISOString()
  });

  // Send VIP welcome email with code
  await sendVIPWelcomeEmail(data.email, data.firstName, vipCode);

  return {
    message: 'Congratulations! Your VIP Pass has been activated.',
    data: {
      vipCode: vipCode,
      benefits: [
        '10% off your first stay',
        'Early access to new properties',
        'Complimentary welcome amenity',
        'Priority concierge service'
      ]
    }
  };
}

/**
 * Process early access signup
 */
async function processEarlyAccess(data, context) {
  if (supabaseManager.isAvailable()) {
    await supabaseManager.upsertGuest({
      email: data.email,
      firstName: data.name?.split(' ')[0],
      tags: ['early_access'],
      source: 'website_early_access',
      preferences: {
        earlyAccess: true,
        interests: data.interests || []
      }
    });
  }

  await sendToAirtable('earlyAccess', {
    ...data,
    signupDate: new Date().toISOString()
  });

  return {
    message: 'You\'re on the list! We\'ll notify you first when new properties become available.',
    data: { earlyAccess: true }
  };
}

/**
 * Process Round Table application
 */
async function processRoundTable(data, context) {
  if (supabaseManager.isAvailable()) {
    await supabaseManager.upsertGuest({
      email: data.email,
      firstName: data.name?.split(' ')[0],
      tags: ['round_table_interested'],
      source: 'website_round_table',
      preferences: {
        roundTable: true,
        investmentInterest: data.interested
      }
    });
  }

  await sendToAirtable('roundTableApplications', {
    ...data,
    applicationDate: new Date().toISOString(),
    status: 'pending_review'
  });

  await sendNotificationEmail('round_table_application', data);

  return {
    message: 'Thank you for your interest in The Round Table. Our team will review your application and contact you soon.',
    data: { applicationReceived: true }
  };
}

/**
 * Send data to Airtable
 */
async function sendToAirtable(table, data) {
  if (!envConfig.has('airtable.pat') || !envConfig.has('airtable.baseId')) {
    console.warn('Airtable not configured, skipping');
    return;
  }

  try {
    // Airtable API call would go here
    console.log(`Sending to Airtable table ${table}:`, data);
  } catch (error) {
    console.error('Airtable error:', error);
    // Don't fail the whole request if Airtable fails
  }
}

/**
 * Send notification emails
 */
async function sendNotificationEmail(type, data) {
  try {
    // Email sending logic would go here
    console.log(`Sending ${type} notification email:`, data);
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

/**
 * Send welcome email
 */
async function sendWelcomeEmail(email, name) {
  console.log(`Sending welcome email to ${email}`);
}

/**
 * Send VIP welcome email
 */
async function sendVIPWelcomeEmail(email, firstName, vipCode) {
  console.log(`Sending VIP welcome email to ${email} with code ${vipCode}`);
}

/**
 * Send urgent notification
 */
async function sendUrgentNotification(type, data) {
  console.log(`URGENT: ${type} notification:`, data);
  // Could trigger SMS, WhatsApp, or priority email
}

/**
 * Track form submission analytics
 */
async function trackFormSubmission(formType, result, metrics) {
  if (supabaseManager.isAvailable()) {
    await supabaseManager.trackEvent({
      type: 'form_submission',
      category: 'engagement',
      action: formType,
      label: result.message,
      value: 1,
      metadata: {
        ...metrics,
        success: true
      }
    });
  }
}

/**
 * Helper functions
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
}

function isValidDate(date) {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime()) && parsed > new Date();
}

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateVIPCode() {
  const prefix = 'VIP';
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

function createErrorResponse(error, context) {
  const errorResponse = errorHandler.handle(error, context);
  return {
    statusCode: errorResponse.statusCode || 500,
    headers: securityManager.getCorsHeaders(),
    body: JSON.stringify(errorResponse)
  };
}