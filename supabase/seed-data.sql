-- Tommy Coconut Sample Data for Testing
-- This file adds sample properties, amenities, and test data

-- Insert sample amenities
INSERT INTO amenities (name, icon, category, description) VALUES
-- Essentials
('WiFi', 'wifi', 'essentials', 'High-speed fiber optic internet throughout property'),
('Air Conditioning', 'ac', 'essentials', 'Central air conditioning in all rooms'),
('Hot Water', 'water', 'essentials', '24/7 hot water availability'),
('Washer & Dryer', 'laundry', 'essentials', 'Private laundry facilities'),
('Hair Dryer', 'hairdryer', 'essentials', 'Professional hair dryers in all bathrooms'),
('Iron & Board', 'iron', 'essentials', 'Steam iron and ironing board'),

-- Entertainment
('Smart TV', 'tv', 'entertainment', '65" 4K Smart TV with Netflix'),
('Pool Table', 'pool', 'entertainment', 'Professional pool table'),
('Sound System', 'music', 'entertainment', 'Sonos sound system throughout'),
('Board Games', 'games', 'entertainment', 'Collection of board games and cards'),
('Books', 'books', 'entertainment', 'Curated library of books'),

-- Outdoor
('Private Pool', 'pool', 'outdoor', 'Heated infinity pool with ocean view'),
('BBQ Grill', 'bbq', 'outdoor', 'Professional gas BBQ grill'),
('Beach Access', 'beach', 'outdoor', 'Direct private beach access'),
('Garden', 'garden', 'outdoor', 'Tropical garden with loungers'),
('Outdoor Shower', 'shower', 'outdoor', 'Outdoor shower by pool'),
('Fire Pit', 'fire', 'outdoor', 'Beachside fire pit area'),

-- Kitchen
('Full Kitchen', 'kitchen', 'kitchen', 'Fully equipped gourmet kitchen'),
('Coffee Machine', 'coffee', 'kitchen', 'Nespresso and drip coffee makers'),
('Dishwasher', 'dishwasher', 'kitchen', 'Modern dishwasher'),
('Wine Fridge', 'wine', 'kitchen', 'Temperature-controlled wine storage'),
('Ice Maker', 'ice', 'kitchen', 'Built-in ice maker'),

-- Luxury
('Hot Tub', 'hottub', 'luxury', 'Private hot tub with ocean view'),
('Gym', 'gym', 'luxury', 'Private fitness room with equipment'),
('Chef Service', 'chef', 'luxury', 'Private chef available on request'),
('Concierge', 'concierge', 'luxury', '24/7 concierge service'),
('Daily Housekeeping', 'cleaning', 'luxury', 'Daily housekeeping service included'),

-- Safety
('Safe', 'safe', 'safety', 'In-room digital safe'),
('Security System', 'security', 'safety', '24/7 security monitoring'),
('First Aid Kit', 'firstaid', 'safety', 'Complete first aid supplies'),
('Fire Extinguisher', 'fire-extinguisher', 'safety', 'Fire safety equipment'),
('Smoke Detector', 'smoke', 'safety', 'Smoke and carbon monoxide detectors');

-- Insert Tommy Coconut properties
INSERT INTO properties (
    slug, name, type, description, location, address,
    latitude, longitude, bedrooms, bathrooms, max_guests,
    square_feet, base_nightly_rate, cleaning_fee,
    is_active, is_featured, order_index
) VALUES
(
    'villa-aurora',
    'Villa Aurora',
    'villa',
    'Experience paradise at Villa Aurora, where luxury meets the Caribbean''s natural beauty. This stunning 4-bedroom oceanfront villa offers breathtaking views, a private infinity pool, and direct beach access. Every detail has been crafted to create your perfect island escape.',
    'Coral Estate, Curacao',
    'Coral Estate, Wilhelminalaan 12, Curacao',
    12.083333, -68.899444,
    4, 4.5, 8,
    4500, 850.00, 250.00,
    true, true, 1
),
(
    'bayside-hill',
    'Bayside Hill Villa',
    'villa',
    'Perched on a hillside with panoramic ocean views, Bayside Hill Villa is a modern sanctuary designed for those who appreciate sophistication. This 5-bedroom masterpiece features an infinity pool, outdoor cinema, and luxurious amenities throughout.',
    'Jan Thiel, Curacao',
    'Jan Thiel, Kaya Papaya 8, Curacao',
    12.075000, -68.883333,
    5, 5, 10,
    5500, 1200.00, 350.00,
    true, true, 2
),
(
    'sunset-retreat',
    'Sunset Retreat',
    'villa',
    'Capture magical sunsets from this elegant 3-bedroom villa. Sunset Retreat combines intimate luxury with spectacular views, featuring a private pool, gourmet kitchen, and seamless indoor-outdoor living spaces perfect for Caribbean relaxation.',
    'Blue Bay, Curacao',
    'Blue Bay Golf & Beach Resort, Curacao',
    12.131944, -68.988889,
    3, 3, 6,
    3200, 650.00, 200.00,
    true, false, 3
),
(
    'coconut-cove',
    'Coconut Cove Villa',
    'villa',
    'Hidden in a private cove, this 4-bedroom gem offers the ultimate in privacy and luxury. With your own beach access, infinity pool, and tropical gardens, Coconut Cove Villa is where unforgettable memories are made.',
    'Westpunt, Curacao',
    'Westpunt, Kaya Grandi 45, Curacao',
    12.390000, -69.155000,
    4, 4, 8,
    4200, 750.00, 250.00,
    true, false, 4
),
(
    'ocean-breeze-penthouse',
    'Ocean Breeze Penthouse',
    'apartment',
    'Modern luxury meets island charm in this stunning 2-bedroom penthouse. Enjoy 360-degree ocean views, a private rooftop terrace with plunge pool, and walking distance to beaches, restaurants, and nightlife.',
    'Pietermaai, Curacao',
    'Pietermaai District, Willemstad, Curacao',
    12.108889, -68.923611,
    2, 2, 4,
    2100, 450.00, 150.00,
    true, false, 5
);

-- Link amenities to properties (sample for Villa Aurora)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT
    p.id as property_id,
    a.id as amenity_id
FROM properties p
CROSS JOIN amenities a
WHERE p.slug = 'villa-aurora'
AND a.name IN (
    'WiFi', 'Air Conditioning', 'Hot Water', 'Washer & Dryer',
    'Smart TV', 'Sound System', 'Private Pool', 'BBQ Grill',
    'Beach Access', 'Garden', 'Full Kitchen', 'Coffee Machine',
    'Hot Tub', 'Concierge', 'Daily Housekeeping', 'Safe', 'Security System'
);

-- Link amenities to Bayside Hill
INSERT INTO property_amenities (property_id, amenity_id)
SELECT
    p.id as property_id,
    a.id as amenity_id
FROM properties p
CROSS JOIN amenities a
WHERE p.slug = 'bayside-hill'
AND a.name IN (
    'WiFi', 'Air Conditioning', 'Hot Water', 'Washer & Dryer',
    'Smart TV', 'Pool Table', 'Sound System', 'Private Pool',
    'BBQ Grill', 'Garden', 'Fire Pit', 'Full Kitchen', 'Wine Fridge',
    'Hot Tub', 'Gym', 'Chef Service', 'Concierge', 'Daily Housekeeping'
);

-- Add sample pricing for Villa Aurora (seasonal rates)
INSERT INTO pricing (property_id, season, start_date, end_date, nightly_rate, weekly_rate, monthly_rate, minimum_nights)
SELECT
    id as property_id,
    'High Season' as season,
    '2024-12-15' as start_date,
    '2025-04-15' as end_date,
    950.00 as nightly_rate,
    6300.00 as weekly_rate,
    25000.00 as monthly_rate,
    5 as minimum_nights
FROM properties WHERE slug = 'villa-aurora'
UNION ALL
SELECT
    id as property_id,
    'Low Season' as season,
    '2024-04-16' as start_date,
    '2024-12-14' as end_date,
    750.00 as nightly_rate,
    4900.00 as weekly_rate,
    19000.00 as monthly_rate,
    3 as minimum_nights
FROM properties WHERE slug = 'villa-aurora';

-- Add sample images for properties
INSERT INTO images (property_id, url, caption, is_primary, order_index)
SELECT
    id as property_id,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600' as url,
    'Stunning ocean view from Villa Aurora' as caption,
    true as is_primary,
    1 as order_index
FROM properties WHERE slug = 'villa-aurora'
UNION ALL
SELECT
    id,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    'Private infinity pool overlooking the Caribbean',
    false,
    2
FROM properties WHERE slug = 'villa-aurora'
UNION ALL
SELECT
    id,
    'https://images.unsplash.com/photo-1600573472591-401c9f174166?w=1600',
    'Luxurious master bedroom with ocean views',
    false,
    3
FROM properties WHERE slug = 'villa-aurora';

-- Create a test guest
INSERT INTO guests (email, first_name, last_name, phone, country, source, tags)
VALUES (
    'test@example.com',
    'Test',
    'Guest',
    '+1234567890',
    'United States',
    'website',
    ARRAY['test', 'vip_pass']
);

-- Create sample availability (mark some dates as booked)
INSERT INTO availability (property_id, date, is_available, nightly_rate)
SELECT
    p.id,
    generate_series(
        CURRENT_DATE,
        CURRENT_DATE + interval '90 days',
        interval '1 day'
    )::date as date,
    CASE
        WHEN generate_series::date BETWEEN CURRENT_DATE + 10 AND CURRENT_DATE + 17 THEN false
        WHEN generate_series::date BETWEEN CURRENT_DATE + 30 AND CURRENT_DATE + 35 THEN false
        ELSE true
    END as is_available,
    CASE
        WHEN EXTRACT(month FROM generate_series) IN (12, 1, 2, 3) THEN 950.00
        ELSE 750.00
    END as nightly_rate
FROM properties p
WHERE p.slug = 'villa-aurora';

-- Add a sample completed booking with review
INSERT INTO bookings (
    guest_id, property_id, check_in_date, check_out_date,
    guests_count, adults_count, children_count,
    nightly_rate, cleaning_fee, total_price,
    status, payment_status, confirmation_code
)
SELECT
    g.id as guest_id,
    p.id as property_id,
    CURRENT_DATE - interval '30 days' as check_in_date,
    CURRENT_DATE - interval '23 days' as check_out_date,
    4 as guests_count,
    4 as adults_count,
    0 as children_count,
    850.00 as nightly_rate,
    250.00 as cleaning_fee,
    6200.00 as total_price,
    'completed' as status,
    'paid' as payment_status,
    'TC-SAMPLE01' as confirmation_code
FROM guests g, properties p
WHERE g.email = 'test@example.com'
AND p.slug = 'villa-aurora';

-- Add a sample review
INSERT INTO reviews (
    booking_id, guest_id, property_id,
    rating, cleanliness_rating, accuracy_rating,
    communication_rating, location_rating, value_rating,
    review_text, is_published
)
SELECT
    b.id as booking_id,
    b.guest_id,
    b.property_id,
    5 as rating,
    5 as cleanliness_rating,
    5 as accuracy_rating,
    5 as communication_rating,
    5 as location_rating,
    5 as value_rating,
    'Villa Aurora exceeded all our expectations! The views were breathtaking, the villa was immaculate, and the concierge service was exceptional. We''ll definitely be back!' as review_text,
    true as is_published
FROM bookings b
WHERE b.confirmation_code = 'TC-SAMPLE01';

-- Refresh materialized view
REFRESH MATERIALIZED VIEW property_statistics;

-- Output confirmation
SELECT
    'Sample data loaded successfully!' as status,
    COUNT(*) as properties_count,
    (SELECT COUNT(*) FROM amenities) as amenities_count,
    (SELECT COUNT(*) FROM guests) as guests_count,
    (SELECT COUNT(*) FROM bookings) as bookings_count
FROM properties;