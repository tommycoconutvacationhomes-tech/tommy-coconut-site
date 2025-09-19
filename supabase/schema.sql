-- Tommy Coconut Database Schema for Supabase
-- This schema creates all necessary tables for the Tommy Coconut vacation rental platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded');
CREATE TYPE inquiry_status AS ENUM ('pending', 'responded', 'converted', 'closed');
CREATE TYPE property_type AS ENUM ('villa', 'apartment', 'house', 'condo');
CREATE TYPE amenity_category AS ENUM ('essentials', 'entertainment', 'outdoor', 'kitchen', 'luxury', 'safety');

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    country VARCHAR(100),
    preferences JSONB DEFAULT '{}',
    source VARCHAR(50),
    tags TEXT[],
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_booking_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_created_at ON guests(created_at DESC);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type property_type DEFAULT 'villa',
    description TEXT,
    location VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(3, 1),
    max_guests INTEGER NOT NULL,
    square_feet INTEGER,
    base_nightly_rate DECIMAL(10, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for property queries
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_active ON properties(is_active);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);

-- Property images table
CREATE TABLE IF NOT EXISTS images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    cloudinary_id VARCHAR(255),
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for image queries
CREATE INDEX idx_images_property ON images(property_id);
CREATE INDEX idx_images_primary ON images(property_id, is_primary);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    category amenity_category,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities junction table
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    details JSONB DEFAULT '{}',
    PRIMARY KEY (property_id, amenity_id)
);

-- Pricing table for seasonal rates
CREATE TABLE IF NOT EXISTS pricing (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    season VARCHAR(50),
    start_date DATE,
    end_date DATE,
    nightly_rate DECIMAL(10, 2) NOT NULL,
    weekly_rate DECIMAL(10, 2),
    monthly_rate DECIMAL(10, 2),
    minimum_nights INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for pricing lookups
CREATE INDEX idx_pricing_property_dates ON pricing(property_id, start_date, end_date);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES guests(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INTEGER NOT NULL,
    adults_count INTEGER,
    children_count INTEGER DEFAULT 0,
    total_nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
    nightly_rate DECIMAL(10, 2),
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    taxes DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    special_requests TEXT,
    check_in_time TIME,
    check_out_time TIME,
    confirmation_code VARCHAR(20) UNIQUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for booking queries
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_dates ON bookings(property_id, check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guest_id UUID REFERENCES guests(id),
    property_id UUID REFERENCES properties(id),
    check_in_date DATE,
    check_out_date DATE,
    guests_count INTEGER,
    message TEXT,
    status inquiry_status DEFAULT 'pending',
    source VARCHAR(50),
    responded_at TIMESTAMP WITH TIME ZONE,
    response_message TEXT,
    converted_booking_id UUID REFERENCES bookings(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for inquiry queries
CREATE INDEX idx_inquiries_guest ON inquiries(guest_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- Availability calendar table
CREATE TABLE IF NOT EXISTS availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booking_id UUID REFERENCES bookings(id),
    nightly_rate DECIMAL(10, 2),
    minimum_nights INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date)
);

-- Create index for availability lookups
CREATE INDEX idx_availability_property_date ON availability(property_id, date);
CREATE INDEX idx_availability_available ON availability(property_id, is_available);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id),
    guest_id UUID NOT NULL REFERENCES guests(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    review_text TEXT,
    host_response TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for review queries
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_guest ON reviews(guest_id);
CREATE INDEX idx_reviews_published ON reviews(property_id, is_published);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    event_value DECIMAL(10, 2),
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS VARCHAR(20) AS $$
DECLARE
    chars VARCHAR(62) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(20) := 'TC-';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to update guest statistics
CREATE OR REPLACE FUNCTION update_guest_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE guests
        SET
            total_bookings = total_bookings + 1,
            total_spent = total_spent + NEW.total_price,
            last_booking_date = NEW.created_at
        WHERE id = NEW.guest_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply guest stats trigger
CREATE TRIGGER update_guest_stats_on_booking
    AFTER INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_guest_stats();

-- Create view for property availability summary
CREATE OR REPLACE VIEW property_availability_summary AS
SELECT
    p.id,
    p.slug,
    p.name,
    COUNT(CASE WHEN a.is_available = true THEN 1 END) as available_days,
    COUNT(CASE WHEN a.is_available = false THEN 1 END) as booked_days,
    MIN(CASE WHEN a.is_available = true THEN a.date END) as next_available_date
FROM properties p
LEFT JOIN availability a ON p.id = a.property_id
WHERE a.date >= CURRENT_DATE
GROUP BY p.id, p.slug, p.name;

-- Create view for guest booking history
CREATE OR REPLACE VIEW guest_booking_history AS
SELECT
    g.id as guest_id,
    g.email,
    g.first_name,
    g.last_name,
    b.id as booking_id,
    p.name as property_name,
    b.check_in_date,
    b.check_out_date,
    b.total_price,
    b.status,
    b.created_at
FROM guests g
JOIN bookings b ON g.id = b.guest_id
JOIN properties p ON b.property_id = p.id
ORDER BY b.created_at DESC;

-- Create materialized view for property statistics
CREATE MATERIALIZED VIEW property_statistics AS
SELECT
    p.id,
    p.slug,
    p.name,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT b.guest_id) as unique_guests,
    AVG(b.total_price) as average_booking_value,
    SUM(b.total_price) as total_revenue,
    AVG(r.rating) as average_rating,
    COUNT(r.id) as total_reviews,
    MAX(b.check_out_date) as last_booking_date
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id AND b.status = 'completed'
LEFT JOIN reviews r ON p.id = r.property_id AND r.is_published = true
GROUP BY p.id, p.slug, p.name;

-- Create index on materialized view
CREATE INDEX idx_property_stats_property ON property_statistics(id);

-- Grant permissions (adjust based on your Supabase setup)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;