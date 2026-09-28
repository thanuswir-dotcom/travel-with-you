-- Travel With You - Initial Supabase PostgreSQL Schema & Seed Data
-- Migration: 001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema if running fresh
DROP TABLE IF EXISTS trip_expenses CASCADE;
DROP TABLE IF EXISTS trip_members CASCADE;
DROP TABLE IF EXISTS trip_itinerary_items CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS saved_places CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 1. User Profiles (Extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    college_name TEXT,
    city TEXT DEFAULT 'Bengaluru',
    avatar_url TEXT,
    preferred_vibe TEXT[] DEFAULT ARRAY['CHILL', 'HUNGRY'],
    default_transit TEXT DEFAULT 'PUBLIC_TRANSIT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Places Repository
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'theatres', 'cafes', 'restaurants', 'street_food', 'study_spots',
        'parks_nature', 'viewpoints', 'entertainment', 'cultural_temples',
        'shopping', 'weekend_trips', 'photo_spots'
    )),
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    price_level INTEGER NOT NULL CHECK (price_level BETWEEN 0 AND 4), -- 0=Free, 1=<₹150, 2=₹150-₹350, 3=₹350-₹700, 4=₹700+
    approx_cost_for_one NUMERIC(8,2) NOT NULL DEFAULT 150.00,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.2 CHECK (rating BETWEEN 1.0 AND 5.0),
    review_count INTEGER NOT NULL DEFAULT 0,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '22:00:00',
    image_url TEXT NOT NULL,
    has_wifi BOOLEAN DEFAULT false,
    has_charging BOOLEAN DEFAULT false,
    is_quiet BOOLEAN DEFAULT false,
    is_outdoor BOOLEAN DEFAULT false,
    is_student_friendly BOOLEAN DEFAULT true,
    student_perks TEXT[] DEFAULT ARRAY['Affordable Combos'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Saved Places (Wishlist / Visited / Favorite)
CREATE TABLE saved_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'WANT_TO_VISIT' CHECK (status IN ('WANT_TO_VISIT', 'VISITED', 'FAVORITE')),
    personal_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, place_id)
);

-- 4. Trips & Itineraries
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    planned_date DATE NOT NULL,
    total_budget NUMERIC(10,2) NOT NULL,
    allocated_food_budget NUMERIC(10,2) DEFAULT 0,
    allocated_transit_budget NUMERIC(10,2) DEFAULT 0,
    allocated_activity_budget NUMERIC(10,2) DEFAULT 0,
    allocated_emergency_budget NUMERIC(10,2) DEFAULT 0,
    headcount INTEGER NOT NULL DEFAULT 1 CHECK (headcount >= 1),
    transit_mode TEXT NOT NULL DEFAULT 'PUBLIC_TRANSIT',
    weather_summary TEXT,
    ai_generated_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Trip Itinerary Items (Stops)
CREATE TABLE trip_itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    custom_title TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    estimated_cost_per_person NUMERIC(8,2) NOT NULL DEFAULT 0,
    activity_order INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Trip Expenses (Budget Guardian & Splitter)
CREATE TABLE trip_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('FOOD', 'TRANSIT', 'TICKET', 'MISC')),
    amount NUMERIC(10,2) NOT NULL,
    paid_by_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    split_count INTEGER NOT NULL DEFAULT 1 CHECK (split_count >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Reviews & Student Ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    value_for_money_rating INTEGER NOT NULL CHECK (value_for_money_rating BETWEEN 1 AND 5),
    student_friendliness_rating INTEGER NOT NULL CHECK (student_friendliness_rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Memories (Photo Journal)
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    place_name_tag TEXT NOT NULL,
    memory_date DATE NOT NULL DEFAULT CURRENT_DATE,
    caption TEXT NOT NULL,
    image_url TEXT NOT NULL,
    friends_tagged TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);
CREATE INDEX IF NOT EXISTS idx_places_coords ON places(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_places_price ON places(approx_cost_for_one);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_trip ON trip_itinerary_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip ON trip_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_memories_user ON memories(user_id);

-- Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- 1. Places: Public Read, Service Role Write
CREATE POLICY "Public places are viewable by everyone" 
ON places FOR SELECT USING (true);

-- 2. User Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Saved Places
CREATE POLICY "Users can view their own saved places" 
ON saved_places FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places" 
ON saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places" 
ON saved_places FOR DELETE USING (auth.uid() = user_id);

-- 4. Trips
CREATE POLICY "Users can view their own trips" 
ON trips FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips" 
ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" 
ON trips FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" 
ON trips FOR DELETE USING (auth.uid() = user_id);

-- 5. Trip Itinerary Items
CREATE POLICY "Users can view their trip itinerary items" 
ON trip_itinerary_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can insert trip itinerary items" 
ON trip_itinerary_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can delete trip itinerary items" 
ON trip_itinerary_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_itinerary_items.trip_id AND trips.user_id = auth.uid()));

-- 6. Trip Expenses
CREATE POLICY "Users can view their trip expenses" 
ON trip_expenses FOR SELECT 
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can insert trip expenses" 
ON trip_expenses FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can delete trip expenses" 
ON trip_expenses FOR DELETE 
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid()));

-- 7. Reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Memories
CREATE POLICY "Memories are viewable by everyone" 
ON memories FOR SELECT USING (true);

CREATE POLICY "Users can create their own memories" 
ON memories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" 
ON memories FOR DELETE USING (auth.uid() = user_id);

-- Comprehensive Realistic Seed Data for College Hubs (Bengaluru / Central Districts)
INSERT INTO places (id, name, category, description, address, area, city, latitude, longitude, price_level, approx_cost_for_one, rating, review_count, opening_time, closing_time, image_url, has_wifi, has_charging, is_quiet, is_outdoor, is_student_friendly, student_perks) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Ranga Shankara Cafe & Theatre',
    'theatres',
    'Iconic performing arts theatre with famous sabudana vadas and student discount stage shows.',
    '36/2 8th Cross Road, JP Nagar 2nd Phase',
    'JP Nagar',
    'Bengaluru',
    12.9126,
    77.5843,
    1,
    90.00,
    4.7,
    1840,
    '10:00:00',
    '21:30:00',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    false,
    true,
    true,
    ARRAY['₹50 Sabudana Vada', '₹150 Student Play Tickets']
),
(
    '00000000-0000-0000-0000-000000000002',
    'Blossom Book House & Reading Nook',
    'study_spots',
    'Legendary 3-storey second-hand and new bookstore with quiet reading benches and budget filter coffee next door.',
    '84, Church Street, Haridevpur, Shanthala Nagar',
    'Church Street',
    'Bengaluru',
    12.9749,
    77.6082,
    1,
    70.00,
    4.8,
    4920,
    '10:30:00',
    '21:00:00',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    true,
    false,
    true,
    ARRAY['Used Books at 50% Off', 'Silent Study Area']
),
(
    '00000000-0000-0000-0000-000000000003',
    'Airlines Hotel (Open Air Tree Cafe)',
    'cafes',
    'Legendary drive-in banyan tree cafe serving crispy dosas, filter coffee, and youthful student vibes.',
    '4, State Bank of India Rd, Shanthala Nagar',
    'Ashok Nagar',
    'Bengaluru',
    12.9702,
    77.5963,
    2,
    180.00,
    4.3,
    3120,
    '07:00:00',
    '22:00:00',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    false,
    true,
    true,
    ARRAY['Iconic Outdoor Seating', 'Quick Group Hangout']
),
(
    '00000000-0000-0000-0000-000000000004',
    'VV Puram Food Street',
    'street_food',
    'The ultimate late-night vegetarian street food heaven. Crispy paddus, congress bun, and floating pani puri under ₹100.',
    'Old Market Road, Sajjan Rao Circle, Visveswarapuram',
    'VV Puram',
    'Bengaluru',
    12.9515,
    77.5786,
    1,
    120.00,
    4.6,
    8900,
    '17:30:00',
    '23:30:00',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    false,
    true,
    true,
    ARRAY['₹40 Paddu', 'Late Night Open', 'Group Street Crawl']
),
(
    '00000000-0000-0000-0000-000000000005',
    'Cubbon Park Bamboo Grove & Promenade',
    'parks_nature',
    'Sprawling 300-acre heritage park ideal for group frisbee, acoustic jams, reading, and picnics with zero entry cost.',
    'Kasturba Road, Behind High Court',
    'Central Business District',
    'Bengaluru',
    12.9763,
    77.5929,
    0,
    0.00,
    4.7,
    14500,
    '06:00:00',
    '18:00:00',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    true,
    true,
    true,
    ARRAY['Free Entry', 'Ideal Picnic Spot', 'Photography Friendly']
),
(
    '00000000-0000-0000-0000-000000000006',
    'Amoeba Bowling & Arcade',
    'entertainment',
    'Classic multi-lane bowling center with student-priced weekday slots and arcade racing simulators.',
    'Church Street & MG Road Junction',
    'Church Street',
    'Bengaluru',
    12.9752,
    77.6065,
    2,
    220.00,
    4.1,
    2400,
    '11:00:00',
    '22:30:00',
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?auto=format&fit=crop&w=800&q=80',
    true,
    false,
    false,
    false,
    true,
    ARRAY['₹180 Weekday Bowling', 'Arcade Combos']
),
(
    '00000000-0000-0000-0000-000000000007',
    'Sankey Tank Lake Promontory',
    'viewpoints',
    'Lakeside walkways with tranquil water reflections, sunset viewing decks, and shady benches for group chats.',
    'Kodandarampura, Malleshwaram',
    'Malleshwaram',
    'Bengaluru',
    13.0078,
    77.5752,
    1,
    20.00,
    4.5,
    3800,
    '06:00:00',
    '20:00:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    true,
    true,
    true,
    ARRAY['₹10 Entry', 'Sunset Point', 'Peaceful Breezes']
),
(
    '00000000-0000-0000-0000-000000000008',
    'Third Wave Coffee Roasters (Study Hub)',
    'study_spots',
    'Student-friendly tech and design workspace with charging sockets at every table and uninterrupted high-speed Wi-Fi.',
    '12th Main Rd, HAL 2nd Stage, Indiranagar',
    'Indiranagar',
    'Bengaluru',
    12.9719,
    77.6412,
    2,
    240.00,
    4.5,
    1950,
    '08:00:00',
    '23:00:00',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    true,
    true,
    true,
    false,
    true,
    ARRAY['High-Speed 200Mbps Wi-Fi', 'Power Outlets Everywhere']
),
(
    '00000000-0000-0000-0000-000000000009',
    'Sri Gavi Gangadhareshwara Temple',
    'cultural_temples',
    'Ancient 9th-century rock-cut cave temple dedicated to Lord Shiva with mysterious astronomical monolithic pillars.',
    'Gavikangadhara Temple Rd, Gavipuram Extension, Kempegowda Nagar',
    'Basavanagudi',
    'Bengaluru',
    12.9497,
    77.5646,
    0,
    0.00,
    4.8,
    4100,
    '06:00:00',
    '19:30:00',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    true,
    false,
    true,
    ARRAY['Free Entry', 'Ancient Rock Cave', 'Historic Significance']
),
(
    '00000000-0000-0000-0000-000000000010',
    'Commercial Street Thrift & Fashion Alleys',
    'shopping',
    'Buzzing flea alleys with budget streetwear, accessories, footwear, and student bargains galore.',
    'Tasker Town, Shivaji Nagar',
    'Shivajinagar',
    'Bengaluru',
    12.9822,
    77.6083,
    1,
    200.00,
    4.4,
    11200,
    '10:30:00',
    '21:30:00',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    false,
    true,
    true,
    ARRAY['Bargain Shopping', 'College Fashion Finds']
),
(
    '00000000-0000-0000-0000-000000000011',
    'Nandi Hills Sunrise & Cloud Walk',
    'weekend_trips',
    'Popular college dawn getaway 60km away. Ancient hill fortress offering spectacular sunrise above the misty cloud bed.',
    'Nandi Hills Road, Chikkaballapur District',
    'Outskirts',
    'Bengaluru',
    13.3702,
    77.6835,
    1,
    150.00,
    4.6,
    22000,
    '06:00:00',
    '18:00:00',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    false,
    false,
    false,
    true,
    true,
    ARRAY['Cloud Sea Sunrise', 'Weekend Bike Trip', '₹20 Entry']
),
(
    '00000000-0000-0000-0000-000000000012',
    'Church Street Graffiti Wall & Art Walk',
    'photo_spots',
    'Vibrant pedestrian cobblestone street lined with murals, musicians, street artists, and youth culture.',
    'Church Street, Off Brigade Road',
    'Church Street',
    'Bengaluru',
    12.9745,
    77.6074,
    0,
    0.00,
    4.7,
    6300,
    '08:00:00',
    '23:00:00',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    true,
    false,
    false,
    true,
    true,
    ARRAY['Instagram Photo Spot', 'Street Music on Weekends', 'Free Vibe']
);
