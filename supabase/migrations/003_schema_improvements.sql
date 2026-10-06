-- ============================================================
-- Migration 003: Schema Improvements & Security Hardening
-- Travel With You v1.1.0
-- ============================================================

-- 1. ADD MISSING COLUMNS TO user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS trips_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS memories_count INTEGER DEFAULT 0;

-- 2. ADD MISSING COLUMNS TO memories
ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS mood TEXT DEFAULT 'happy',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

-- 3. ADD MISSING COLUMNS TO places
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Karnataka',
  ADD COLUMN IF NOT EXISTS distance_km NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 4. ADD MISSING COLUMNS TO reviews
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS cleanliness_rating INTEGER DEFAULT 3
    CHECK (cleanliness_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS user_name TEXT;

-- 5. ADD MISSING COLUMNS TO trips
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Bengaluru',
  ADD COLUMN IF NOT EXISTS squad_size INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PLANNED'
    CHECK (status IN ('PLANNED','ACTIVE','COMPLETED','CANCELLED'));

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_places_state ON places(state);
CREATE INDEX IF NOT EXISTS idx_places_rating ON places(rating DESC);
CREATE INDEX IF NOT EXISTS idx_memories_user_date ON memories(user_id, memory_date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_destinations_city ON public.destinations(city);
CREATE INDEX IF NOT EXISTS idx_destinations_state ON public.destinations(state);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON public.destinations(rating DESC);

-- 7. FULL-TEXT SEARCH ON places
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(name,'') || ' ' || coalesce(description,'') || ' ' ||
        coalesce(area,'') || ' ' || coalesce(city,'') || ' ' ||
        coalesce(state,'') || ' ' || coalesce(category,'')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_places_search ON places USING GIN(search_vector);

-- 8. FULL-TEXT SEARCH ON destinations
ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(name,'') || ' ' || coalesce(description,'') || ' ' ||
        coalesce(area,'') || ' ' || coalesce(city,'') || ' ' ||
        coalesce(state,'') || ' ' || coalesce(category,'')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_destinations_search ON destinations USING GIN(search_vector);

-- 9. ENABLE RLS ON destinations + SERVICE ROLE POLICIES
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='destinations' AND policyname='Public destinations are viewable by everyone') THEN
    CREATE POLICY "Public destinations are viewable by everyone" ON public.destinations FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='destinations' AND policyname='Service role can manage destinations') THEN
    CREATE POLICY "Service role can manage destinations" ON public.destinations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Service role can manage all profiles') THEN
    CREATE POLICY "Service role can manage all profiles" ON public.user_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='memories' AND policyname='Service role can manage all memories') THEN
    CREATE POLICY "Service role can manage all memories" ON public.memories FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='places' AND policyname='Service role can manage places') THEN
    CREATE POLICY "Service role can manage places" ON public.places FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 10. TIGHTEN MEMORIES PRIVACY POLICY
DROP POLICY IF EXISTS "Memories are viewable by everyone" ON memories;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='memories' AND policyname='Public memories are viewable by everyone') THEN
    CREATE POLICY "Public memories are viewable by everyone" ON memories FOR SELECT USING (is_public = true OR auth.uid() = user_id);
  END IF;
END $$;

-- 11. UPDATED_AT TRIGGER FOR memories
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_memories_updated_at ON memories;
CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON memories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. HAVERSINE DISTANCE FUNCTION
CREATE OR REPLACE FUNCTION get_places_near_location(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
  id UUID, name TEXT, category TEXT, city TEXT, area TEXT,
  latitude DOUBLE PRECISION, longitude DOUBLE PRECISION,
  rating NUMERIC, approx_cost_for_one NUMERIC, distance_km DOUBLE PRECISION
)
LANGUAGE sql STABLE AS $$
  SELECT p.id, p.name, p.category, p.city, p.area, p.latitude, p.longitude,
    p.rating, p.approx_cost_for_one,
    ROUND((6371 * acos(
      cos(radians(user_lat)) * cos(radians(p.latitude)) *
      cos(radians(p.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(p.latitude))
    ))::NUMERIC, 2) AS distance_km
  FROM places p
  WHERE (6371 * acos(
    cos(radians(user_lat)) * cos(radians(p.latitude)) *
    cos(radians(p.longitude) - radians(user_lng)) +
    sin(radians(user_lat)) * sin(radians(p.latitude))
  )) <= radius_km
  ORDER BY distance_km ASC;
$$;

-- 13. CONVENIENCE VIEW: places with aggregated review stats
CREATE OR REPLACE VIEW places_with_review_stats AS
SELECT
  p.*,
  COALESCE(r.avg_rating, p.rating) AS computed_rating,
  COALESCE(r.total_reviews, 0) AS total_reviews,
  COALESCE(r.avg_value_for_money, 0) AS avg_value_for_money,
  COALESCE(r.avg_cleanliness, 0) AS avg_cleanliness
FROM places p
LEFT JOIN (
  SELECT place_id,
    ROUND(AVG(rating)::NUMERIC, 1) AS avg_rating,
    COUNT(*) AS total_reviews,
    ROUND(AVG(value_for_money_rating)::NUMERIC, 1) AS avg_value_for_money,
    ROUND(AVG(cleanliness_rating)::NUMERIC, 1) AS avg_cleanliness
  FROM reviews GROUP BY place_id
) r ON r.place_id = p.id;

-- END OF MIGRATION 003
