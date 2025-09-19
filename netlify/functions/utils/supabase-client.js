/**
 * Supabase Client Configuration
 * Manages database connections and operations for Tommy Coconut
 */

const { createClient } = require('@supabase/supabase-js');
const envConfig = require('./env-config');
const errorHandler = require('./error-handler');

class SupabaseManager {
  constructor() {
    this.client = null;
    this.adminClient = null;
    this.initialized = false;

    // Table names
    this.tables = {
      guests: 'guests',
      properties: 'properties',
      bookings: 'bookings',
      inquiries: 'inquiries',
      availability: 'availability',
      reviews: 'reviews',
      amenities: 'amenities',
      propertyAmenities: 'property_amenities',
      images: 'images',
      pricing: 'pricing',
      analytics: 'analytics_events'
    };

    this.initialize();
  }

  /**
   * Initialize Supabase clients
   */
  initialize() {
    try {
      if (!envConfig.has('supabase.url') || !envConfig.has('supabase.anonKey')) {
        console.warn('Supabase credentials not configured');
        return;
      }

      // Public client for general operations
      this.client = createClient(
        envConfig.get('supabase.url'),
        envConfig.get('supabase.anonKey')
      );

      // Admin client for privileged operations
      if (envConfig.has('supabase.serviceRoleKey')) {
        this.adminClient = createClient(
          envConfig.get('supabase.url'),
          envConfig.get('supabase.serviceRoleKey')
        );
      }

      this.initialized = true;
      console.log('Supabase clients initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      this.initialized = false;
    }
  }

  /**
   * Check if Supabase is available
   * @returns {boolean} True if Supabase is initialized
   */
  isAvailable() {
    return this.initialized && this.client !== null;
  }

  /**
   * Get Supabase client
   * @param {boolean} admin - Whether to return admin client
   * @returns {Object} Supabase client
   */
  getClient(admin = false) {
    if (!this.isAvailable()) {
      throw errorHandler.integrationError('Supabase', new Error('Supabase not initialized'));
    }
    return admin && this.adminClient ? this.adminClient : this.client;
  }

  /**
   * Create a new guest record
   * @param {Object} guestData - Guest information
   * @returns {Object} Created guest record
   */
  async createGuest(guestData) {
    try {
      const { data, error } = await this.client
        .from(this.tables.guests)
        .insert([{
          email: guestData.email.toLowerCase(),
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          phone: guestData.phone,
          country: guestData.country,
          preferences: guestData.preferences || {},
          source: guestData.source || 'website',
          tags: guestData.tags || [],
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Get or create guest by email
   * @param {Object} guestData - Guest information
   * @returns {Object} Guest record
   */
  async upsertGuest(guestData) {
    try {
      const { data, error } = await this.client
        .from(this.tables.guests)
        .upsert({
          email: guestData.email.toLowerCase(),
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          phone: guestData.phone,
          country: guestData.country,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email',
          returning: 'representation'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Create an inquiry record
   * @param {Object} inquiryData - Inquiry information
   * @returns {Object} Created inquiry record
   */
  async createInquiry(inquiryData) {
    try {
      const { data, error } = await this.client
        .from(this.tables.inquiries)
        .insert([{
          guest_id: inquiryData.guestId,
          property_id: inquiryData.propertyId,
          check_in_date: inquiryData.checkIn,
          check_out_date: inquiryData.checkOut,
          guests_count: inquiryData.guestsCount,
          message: inquiryData.message,
          status: 'pending',
          source: inquiryData.source || 'website',
          metadata: inquiryData.metadata || {},
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Get property by slug or ID
   * @param {string} identifier - Property slug or ID
   * @returns {Object} Property record
   */
  async getProperty(identifier) {
    try {
      // Check if identifier is a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

      const query = this.client
        .from(this.tables.properties)
        .select(`
          *,
          ${this.tables.images} (
            id,
            url,
            caption,
            is_primary,
            order_index
          ),
          ${this.tables.amenities} (
            id,
            name,
            icon,
            category
          ),
          ${this.tables.pricing} (
            id,
            season,
            nightly_rate,
            weekly_rate,
            minimum_nights
          )
        `);

      const { data, error } = isUUID
        ? await query.eq('id', identifier).single()
        : await query.eq('slug', identifier).single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Get all properties
   * @param {Object} filters - Filter options
   * @returns {Array} Properties list
   */
  async getProperties(filters = {}) {
    try {
      let query = this.client
        .from(this.tables.properties)
        .select(`
          *,
          ${this.tables.images} (
            url,
            is_primary
          )
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.location) {
        query = query.eq('location', filters.location);
      }
      if (filters.maxPrice) {
        query = query.lte('base_nightly_rate', filters.maxPrice);
      }

      const { data, error } = await query.order('order_index', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Check availability for a property
   * @param {string} propertyId - Property ID
   * @param {string} checkIn - Check-in date
   * @param {string} checkOut - Check-out date
   * @returns {Object} Availability status
   */
  async checkAvailability(propertyId, checkIn, checkOut) {
    try {
      // Check for overlapping bookings
      const { data: bookings, error } = await this.client
        .from(this.tables.bookings)
        .select('id, check_in_date, check_out_date')
        .eq('property_id', propertyId)
        .eq('status', 'confirmed')
        .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`);

      if (error) throw error;

      const isAvailable = bookings.length === 0;

      // Get pricing for the period
      const { data: pricing } = await this.client
        .from(this.tables.pricing)
        .select('*')
        .eq('property_id', propertyId)
        .single();

      return {
        available: isAvailable,
        conflicts: bookings,
        pricing: pricing
      };
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Create a booking
   * @param {Object} bookingData - Booking information
   * @returns {Object} Created booking record
   */
  async createBooking(bookingData) {
    try {
      const { data, error } = await this.adminClient
        .from(this.tables.bookings)
        .insert([{
          guest_id: bookingData.guestId,
          property_id: bookingData.propertyId,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          guests_count: bookingData.guestsCount,
          total_price: bookingData.totalPrice,
          status: 'pending',
          payment_status: 'pending',
          special_requests: bookingData.specialRequests,
          metadata: bookingData.metadata || {},
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.integrationError('Supabase', error);
    }
  }

  /**
   * Track analytics event
   * @param {Object} eventData - Event information
   */
  async trackEvent(eventData) {
    try {
      await this.client
        .from(this.tables.analytics)
        .insert([{
          event_type: eventData.type,
          event_category: eventData.category,
          event_action: eventData.action,
          event_label: eventData.label,
          event_value: eventData.value,
          user_id: eventData.userId,
          session_id: eventData.sessionId,
          page_url: eventData.pageUrl,
          referrer: eventData.referrer,
          metadata: eventData.metadata || {},
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      // Don't throw for analytics errors
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Sync with Airtable
   * @param {string} table - Table to sync
   * @param {Object} data - Data to sync
   */
  async syncWithAirtable(table, data) {
    // Implementation for bi-directional sync with Airtable
    // This would be called after Supabase operations to keep Airtable in sync
    console.log(`Syncing ${table} with Airtable:`, data);
  }

  /**
   * Get database health status
   * @returns {Object} Health status
   */
  async getHealthStatus() {
    if (!this.isAvailable()) {
      return {
        status: 'unavailable',
        message: 'Supabase not configured'
      };
    }

    try {
      // Test connection with a simple query
      const { error } = await this.client
        .from(this.tables.properties)
        .select('id')
        .limit(1);

      if (error) throw error;

      return {
        status: 'healthy',
        message: 'Database connection successful',
        tables: Object.keys(this.tables)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        error: error
      };
    }
  }
}

// Create singleton instance
const supabaseManager = new SupabaseManager();

// Export for use in other functions
module.exports = supabaseManager;