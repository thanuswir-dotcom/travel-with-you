-- Pan-India Destinations Migration (Generated)
CREATE TABLE IF NOT EXISTS public.destinations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    area VARCHAR(128) NOT NULL,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    price_level INTEGER DEFAULT 0,
    approx_cost_for_one NUMERIC(10, 2) DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    opening_time VARCHAR(16) DEFAULT '08:00',
    closing_time VARCHAR(16) DEFAULT '20:00',
    image_url TEXT NOT NULL,
    has_wifi BOOLEAN DEFAULT false,
    has_charging BOOLEAN DEFAULT false,
    is_quiet BOOLEAN DEFAULT false,
    is_outdoor BOOLEAN DEFAULT true,
    is_student_friendly BOOLEAN DEFAULT true,
    student_perks TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.destinations (
    id, name, category, description, address, area, city, state,
    latitude, longitude, price_level, approx_cost_for_one, rating,
    review_count, opening_time, closing_time, image_url, has_wifi,
    has_charging, is_quiet, is_outdoor, is_student_friendly, student_perks
) VALUES
  (
    'ap-vizag-1', 'Rushikonda Beach & Sea View Promenade', 'viewpoints', 'Golden sand beach surrounded by lush green Eastern Ghats. Surfing schools, beachside speedboats, and student-friendly seafood stalls.',
    'Bheemili Road, Rushikonda', 'Rushikonda', 'Visakhapatnam', 'Andhra Pradesh',
    17.7818, 83.3857, 1, 120, 4.7,
    18500, '06:00', '21:00',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Free Public Beach', 'Speed Boat Rides ₹200', 'Coastal Bike Rides']::TEXT[]
  ),
  (
    'ap-araku-1', 'Araku Valley Coffee Gardens & Borra Caves', 'weekend_trips', 'Enchanting hill station in Eastern Ghats with rolling coffee plantations, tribal culture museums, and million-year-old stalactite Borra Caves.',
    'Araku Valley, Alluri Sitharama Raju District', 'Araku Hill Range', 'Araku Valley', 'Andhra Pradesh',
    18.3273, 82.8775, 1, 350, 4.8,
    14200, '08:00', '18:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Scenic Vistadome Train Route', 'Fresh Organic Araku Coffee ₹20', 'Student Group Trekking']::TEXT[]
  ),
  (
    'ap-tirupati-1', 'Tirupati & Silathoranam Natural Rock Arch', 'cultural_temples', 'Ancient spiritual gateway nestled in the Seshachalam Hills featuring a rare prehistoric geological rock arch and serene garden viewpoints.',
    'Tirumala Hills', 'Tirumala', 'Tirupati', 'Andhra Pradesh',
    13.6288, 79.4192, 0, 50, 4.9,
    42000, '05:00', '22:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Rock Garden', 'Subsidized Student Trek Path', 'Famous Tirupati Laddu']::TEXT[]
  ),
  (
    'ap-vijayawada-1', 'Bhavani Island & Krishna River Promenade', 'parks_nature', 'One of the largest river islands in India nestled on the Krishna River with rope courses, canopy walks, boat rides, and riverbank picnics.',
    'Bhavani Island, Bhavanipuram', 'Bhavanipuram', 'Vijayawada', 'Andhra Pradesh',
    16.5167, 80.596, 1, 150, 4.5,
    9200, '09:00', '19:30',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Ferry Ride Included', 'Budget Kayaking', 'Scenic Sunset Views']::TEXT[]
  ),
  (
    'atp-cult-1', 'Lepakshi Temple & Monolithic Nandi', 'cultural_temples', 'Iconic 16th-century Vijayanagara architectural wonder near Gorantla featuring the world-famous Hanging Pillar, monolithic granite Nandi, and rock carvings.',
    'Lepakshi Heritage Precinct, Near Gorantla', 'Lepakshi (Near Gorantla)', 'Anantapur', 'Andhra Pradesh',
    13.8042, 77.6083, 0, 40, 4.8,
    16400, '06:00', '18:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry with College ID', 'Spectacular Architecture Photos', 'Popular Student Bike Trip']::TEXT[]
  ),
  (
    'atp-cult-2', 'Gorantla Madhava Raya Temple', 'cultural_temples', 'Historic Vijayanagara-era temple located right in Gorantla town with carved pillars, spacious stone mandapams, and a peaceful ambiance for study breaks.',
    'Temple Street, Gorantla', 'Gorantla Town', 'Anantapur', 'Andhra Pradesh',
    13.985, 77.772, 0, 0, 4.7,
    3800, '06:30', '19:30',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['100% Free Entry', 'Quiet Reading Corners', 'Heritage Stone Courtyard']::TEXT[]
  ),
  (
    'atp-food-1', 'Anantapur Clock Tower Uggani Bajji Street', 'street_food', 'The ultimate Rayalaseema comfort food hub! Famous hot crispy mirchi bajjis served with spicy lemon puffed rice (Uggani) and badam milk for under ₹50.',
    'Subhash Road, Clock Tower Circle', 'Clock Tower', 'Anantapur', 'Andhra Pradesh',
    14.6819, 77.6006, 1, 50, 4.8,
    11200, '07:30', '22:30',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Full Breakfast / Evening Snack Under ₹50', 'Legendary Rayalaseema Flavor']::TEXT[]
  ),
  (
    'atp-penukonda-1', 'Penukonda Fort & Gagan Mahal Palace', 'viewpoints', 'Ancient hill citadel and second capital of the Vijayanagara Empire. Climb to the watchtower ruins for sweeping views of the Rayalaseema valley and sunset.',
    'Penukonda Hill, Sri Sathya Sai District', 'Penukonda (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.0847, 77.5958, 0, 30, 4.7,
    8400, '06:00', '18:30',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Fort Ruins', 'Epic Hilltop Sunset Trek', 'Just 25km from Gorantla']::TEXT[]
  ),
  (
    'atp-puttaparthi-1', 'Puttaparthi Chaitanya Jyothi & Peace Gardens', 'parks_nature', 'Serene world-renowned spiritual center with grand lotus-shaped architecture, Chinese and Japanese style roof pagodas, peaceful reflection lawns, and hill viewpoints.',
    'Main Road, Puttaparthi', 'Puttaparthi (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.1678, 77.8105, 0, 50, 4.8,
    15600, '08:00', '19:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['Free Entry & Meditation Halls', 'Subsidized Pure Veg Meals ₹40', 'Quiet Study Ambience']::TEXT[]
  ),
  (
    'atp-gandikota-1', 'Gandikota "Grand Canyon of India" Gorge & Fort', 'weekend_trips', 'Breathtaking 300-foot deep river canyon carved by the Pennar River into red granite cliffs. Camping on cliffs, ancient fort gates, and star gazing for college groups.',
    'Gandikota, Jammalamadugu Road', 'Gandikota Canyon', 'Anantapur', 'Andhra Pradesh',
    14.8152, 78.2862, 0, 250, 4.9,
    32000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['100% Free Public Canyon Access', 'Night Tent Camping', 'Famous Student Roadtrip']::TEXT[]
  ),
  (
    'gor-cafe-1', 'Chai Shai & Student Hangout Point', 'cafes', 'Popular local student meeting spot in Gorantla town. Authentic brewed ginger chai, badam milk, fresh veg sandwiches, and breezy evening seating.',
    'Main Road, Near RTC Bus Stop, Gorantla', 'Gorantla Town', 'Gorantla', 'Andhra Pradesh',
    13.9858, 77.7718, 1, 40, 4.6,
    2100, '06:30', '22:00',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80', true, true,
    false, true,
    true,
    ARRAY['Irani Chai & Bun Maska Under ₹35', 'Free Wi-Fi & Seating', 'Popular Campus Group Spot']::TEXT[]
  ),
  (
    'gor-cafe-2', 'Highway Cafe 44 & Student Bistro', 'cafes', 'Modern air-conditioned highway cafe with great coffee, grilled wraps, cold brews, and power outlets for laptop study sessions.',
    'NH44 Highway Junction, Gorantla Bypass', 'NH44 Bypass (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    13.9625, 77.7285, 1, 90, 4.7,
    4300, '08:00', '23:00',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', true, true,
    false, false,
    true,
    ARRAY['Fast 5G Wi-Fi & Laptop Plugs', 'Cold Coffee & Fries Combo ₹99', 'Scenic Highway Views']::TEXT[]
  ),
  (
    'gor-study-1', 'Gorantla Youth Reading Hall & Digital Library', 'study_spots', 'Quiet public reading space with daily newspapers, exam reference books, peaceful fan-cooled seating, and high-speed Wi-Fi.',
    'Near Old Panchayat Office, Gorantla', 'Gorantla Town', 'Gorantla', 'Andhra Pradesh',
    13.984, 77.7732, 0, 0, 4.8,
    1540, '07:00', '20:30',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', true, true,
    true, false,
    true,
    ARRAY['100% Free Entry', 'Silent Study & Exam Prep Space', 'Free Wi-Fi & Reference Guides']::TEXT[]
  ),
  (
    'gor-study-2', 'Sri Sathya Sai Central Library & Meditation Grounds', 'study_spots', 'Sprawling peaceful university library pavilion with thousands of academic and philosophical volumes, manicured gardens, and pin-drop silence.',
    'Vidyagiri Campus, Puttaparthi (Near Gorantla)', 'Puttaparthi (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.1682, 77.8118, 0, 0, 4.9,
    9800, '08:00', '19:00',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80', true, true,
    true, false,
    true,
    ARRAY['Free Student Entry with ID', 'Air-Conditioned Silence Hall', 'Huge Reference Collection']::TEXT[]
  ),
  (
    'gor-food-1', 'Gorantla Bus Stand Ghee Karam Dosa & Mirchi Bajji Corner', 'street_food', 'Legendary morning and evening street food haven. Crispy red chilli chutney dosas, hot mirchi bajjis stuffed with onions, and fresh coconut chutney.',
    'RTC Bus Stand Circle, Gorantla', 'Gorantla Town', 'Gorantla', 'Andhra Pradesh',
    13.9852, 77.7705, 1, 40, 4.8,
    6200, '06:30', '22:00',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Hot Mirchi Bajjis ₹20 for 4', 'Crispy Ghee Dosa ₹35', 'Authentic Rayalaseema Spice']::TEXT[]
  ),
  (
    'gor-theatre-1', 'Sri Venkateswara Picture Palace', 'theatres', 'Historic single-screen cinema theatre in Gorantla town offering big-screen mass entertainer films with Dolby digital sound at student pocket rates.',
    'Cinema Road, Gorantla Town', 'Gorantla Town', 'Gorantla', 'Andhra Pradesh',
    13.9835, 77.7748, 1, 90, 4.5,
    4700, '10:30', '23:30',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', false, false,
    false, false,
    true,
    ARRAY['Balcony Tickets Under ₹100', 'Mass College Crowd Vibrancy', 'Affordable Popcorn & Samosas']::TEXT[]
  ),
  (
    'gor-theatre-2', 'Balaji V-Max Multiplex & Entertainment', 'theatres', 'Dual-screen modern cinema hall near Gorantla featuring pushback seats, 4K projection, and student weekday offers.',
    'Penukonda Bypass Road, Hindupur (Near Gorantla)', 'Hindupur (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    13.8295, 77.493, 1, 120, 4.6,
    8900, '10:00', '23:45',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', false, false,
    false, false,
    true,
    ARRAY['Weekday Student Tickets ₹120', '4K Laser Projection', 'AC Pushback Seats']::TEXT[]
  ),
  (
    'gor-latenight-1', 'Highway Royal Dhaba & Late Night Tiffin', 'restaurants', '24/7 highway student haunt serving hot rotis, spicy egg bhurji, dal tadka, and midnight parottas for night road-trippers and exam studiers.',
    'NH44 Highway Bypass, Near Gorantla', 'NH44 Bypass (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    13.9675, 77.7345, 1, 110, 4.6,
    5600, '18:00', '03:30',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Open till 3:30 AM', 'Butter Roti & Sev Tamatar Under ₹90', 'Midnight Tea & Lassi']::TEXT[]
  ),
  (
    'gor-latenight-2', 'Hindupur Night Food Street & Biryani Point', 'restaurants', 'Buzzing late night street food lane near the station. Famous for midnight chicken pakoda, hot tiffins, and aromatic biryani parcels.',
    'Railway Station Circle, Hindupur (Near Gorantla)', 'Hindupur (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    13.8268, 77.496, 1, 90, 4.7,
    7100, '19:00', '02:00',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Open till 2:00 AM', 'Chicken 65 & Parotta ₹80', 'Budget Group Dinner']::TEXT[]
  ),
  (
    'gor-shopping-1', 'Gorantla Handloom Weavers Colony & Silk Market', 'shopping', 'Direct weaver market in Gorantla known for traditional hand-woven cotton kurtas, dhotis, and sarees at authentic factory prices.',
    'Weavers Street, Gorantla', 'Gorantla Town', 'Gorantla', 'Andhra Pradesh',
    13.9872, 77.7765, 1, 150, 4.7,
    3100, '09:00', '20:30',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Direct Weaver Discounts', 'Handloom Cotton Kurtas from ₹150', 'Traditional Rayalaseema Craft']::TEXT[]
  ),
  (
    'gor-shopping-2', 'Dharmavaram Silk & College Fest Shopping Street', 'shopping', 'Famous silk and ethnic shopping paradise where college student groups shop for traditional fests and graduation celebrations.',
    'Gandhi Road, Dharmavaram (Near Gorantla)', 'Dharmavaram (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.4135, 77.7215, 1, 200, 4.8,
    14200, '10:00', '21:00',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Wholesale Prices on Ethnic Outfits', 'Student Group Discounts', 'Historic Silk Hub']::TEXT[]
  ),
  (
    'gor-entertainment-1', 'Penukonda Sports Hub & Snooker Lounge', 'entertainment', 'Student recreational zone with snooker tables, 8-ball pool, table tennis, and box cricket turf.',
    'Fort Road, Penukonda (Near Gorantla)', 'Penukonda (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.0865, 77.6015, 1, 60, 4.6,
    1850, '10:00', '22:30',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80', true, true,
    false, false,
    true,
    ARRAY['Snooker ₹40 per 30 mins', 'Box Cricket Turf Hourly Rates', 'Student Squad Challenges']::TEXT[]
  ),
  (
    'gor-rooftops-1', 'Penukonda Hill Ghat Open Air Sunset Dhaba', 'viewpoints', 'Elevated open terrace and valley-facing outdoor restaurant on the slopes of Penukonda Hill with panoramic sunset views across the plains.',
    'Penukonda Ghat Road (Near Gorantla)', 'Penukonda Hills', 'Gorantla', 'Andhra Pradesh',
    14.0785, 77.6035, 1, 130, 4.7,
    4200, '16:00', '23:00',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Breathtaking Sunset Viewpoint', 'Budget Biryani & Tandoori', 'Breezy Open Air Terrace']::TEXT[]
  ),
  (
    'gor-nature-1', 'Yogi Vemana Forest Reserve & Samadhi', 'parks_nature', 'Lush green forested pilgrimage grove dedicated to the revered Telugu philosopher poet Yogi Vemana. Shaded trees, peaceful natural ponds, and trekking trails.',
    'Katarupalli Forest Range (Near Gorantla)', 'Katarupalli (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.2375, 78.0255, 0, 0, 4.7,
    3900, '06:00', '18:00',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['100% Free Entry', 'Shady Forest Picnic Glades', 'Historic Literary Heritage']::TEXT[]
  ),
  (
    'gor-nature-2', 'Thimmamma Marrimanu World Record Banyan Tree', 'parks_nature', 'Guinness World Record holding giant banyan tree covering over 5 acres with thousands of aerial roots forming a natural forest canopy. Spectacular day-out for student squads.',
    'Kadiri Rural, Near Gorantla', 'Kadiri (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    14.0275, 78.3235, 0, 20, 4.8,
    16500, '06:00', '18:30',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['5-Acre Single Tree Forest', 'Cool Natural Breeze Even in Summer', 'Guinness World Record Wonder']::TEXT[]
  ),
  (
    'gor-weekend-1', 'Horsley Hills Hill Station & Viewpoint', 'weekend_trips', 'Charming mist-shrouded hill resort at 4,100 feet altitude with eucalyptus forests, adventure ropes, and sweeping sunset cliffs. The top weekend ride for college students.',
    'Horsley Hills Ghat Road', 'Horsley Hills (Near Gorantla)', 'Gorantla', 'Andhra Pradesh',
    13.655, 78.399, 1, 180, 4.8,
    28000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Chilly Mountain Climate & Mist', 'Scenic Ghat Hairpin Bends Bike Trip', 'Budget Cottages & Viewpoints']::TEXT[]
  ),
  (
    'tg-hyd-1', 'Charminar & Laad Bazaar Street Food Walk', 'street_food', 'World-famous 16th-century monument surrounded by buzzing markets serving authentic Irani Chai, Osmania biscuits, mutton haleem, and pearl bazaars.',
    'Charminar Road, Old City', 'Old City', 'Hyderabad', 'Telangana',
    17.3616, 78.4747, 1, 120, 4.8,
    38000, '09:00', '23:30',
    'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['₹20 Irani Chai with Maskabun', 'Night Photography Hotspot']::TEXT[]
  ),
  (
    'tg-warangal-1', 'Warangal Fort & Thousand Pillar Temple', 'cultural_temples', 'Magnificent Kakatiya architecture featuring intricately carved stone toranas (gateways), star-shaped temples, and lush garden walking trails.',
    'Fort Road, Mathwada', 'Warangal Central', 'Warangal', 'Telangana',
    17.9577, 79.62, 0, 30, 4.7,
    11000, '06:00', '19:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Student Concession Entry', 'Kakatiya Heritage Walk']::TEXT[]
  ),
  (
    'tg-srisailam-1', 'Srisailam Dam Viewpoint & Tiger Reserve Trek', 'viewpoints', 'Spectacular gorge viewpoints overlooking the deep turquoise waters of the Krishna River surrounded by Nallamala dense forest hills.',
    'Srisailam Dam Road, Nallamala Hills', 'Nallamala', 'Srisailam', 'Telangana',
    16.0864, 78.8972, 1, 180, 4.8,
    14500, '06:00', '18:30',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Dam Viewpoints', 'Ropeway Rides across the River']::TEXT[]
  ),
  (
    'ka-hampi-1', 'Hampi Bouldering & Virupaksha Sunset Ruins', 'weekend_trips', 'UNESCO World Heritage open-air museum of giant surreal boulders, ancient banana plantations, riverside coracle boat rides, and Hippie Island cafes.',
    'Hampi Bazaar, Vijayanagara District', 'Hampi Historic Site', 'Hampi', 'Karnataka',
    15.335, 76.46, 1, 250, 4.9,
    28000, '06:00', '18:30',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['Bicycle Rental ₹100/day', 'Matanga Hill Free Sunset', 'Student Friendly Cafes']::TEXT[]
  ),
  (
    'ka-coorg-1', 'Coorg Abbey Falls & Raja''s Seat Mist View', 'viewpoints', 'The "Scotland of India" with misty coffee estates, cascading waterfalls, spicy Kodava street curries, and panoramic western ghat sunset gazebos.',
    'Madikeri, Kodagu', 'Madikeri', 'Coorg', 'Karnataka',
    12.4244, 75.7382, 1, 180, 4.7,
    21000, '06:00', '20:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹20 Entry to Raja''s Seat', 'Spice Farm Tours', 'Chill Cool Climate']::TEXT[]
  ),
  (
    'ka-gokarna-1', 'Gokarna Om Beach & Cliff Trek Path', 'weekend_trips', 'Laid-back paradise for college squad treks connecting Kudle Beach, Om Beach, Half Moon Beach, and Paradise Beach through rocky sea cliffs.',
    'Om Beach Road, Gokarna', 'Om Beach', 'Gokarna', 'Karnataka',
    14.5186, 74.3168, 1, 200, 4.8,
    22000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['Free 5-Beach Cliff Trek', 'Beachside Shacks Under ₹150', 'Bioluminescent Waves in Winter']::TEXT[]
  ),
  (
    'kl-munnar-1', 'Munnar Tea Hills & Top Station Clouds', 'viewpoints', 'Breath-taking emerald tea gardens stretching into clouds at 1,700m elevation. Crisp mountain air, Neelakurinji flower hills, and cozy hillside tea stalls.',
    'Top Station, Kannan Devan Hills', 'Top Station', 'Munnar', 'Kerala',
    10.0889, 77.0595, 1, 120, 4.9,
    31000, '06:00', '18:30',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Fresh Cardamom Tea ₹15', 'Trekking Trails', 'Mist & Chilly Climate']::TEXT[]
  ),
  (
    'kl-alleppey-1', 'Alleppey Backwaters & Kayaking Canals', 'parks_nature', 'The "Venice of the East". Glide through tranquil palm-fringed lagoons, rural paddy fields, and traditional village waterways on budget wooden shikaras.',
    'Punnamada Jetty, Alappuzha', 'Punnamada', 'Alleppey', 'Kerala',
    9.4981, 76.3388, 1, 250, 4.8,
    26000, '06:30', '19:00',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Group Kayak Deals from ₹200', '₹15 State Water Ferry', 'Local Fish Curry Meals']::TEXT[]
  ),
  (
    'kl-kochi-1', 'Fort Kochi Art Street & Chinese Fishing Nets', 'photo_spots', 'Colonial Portuguese and Dutch alleys brimming with contemporary street murals, indie bohemian cafes, antique curio shops, and sunset sea breezes.',
    'Princess Street, Fort Kochi', 'Fort Kochi', 'Kochi', 'Kerala',
    9.9658, 76.2421, 1, 180, 4.7,
    24500, '00:00', '23:59',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80', true, true,
    true, true,
    true,
    ARRAY['Kochi-Muziris Biennale Hub', 'Free Walking Promenades', 'Student Cafe Discounts']::TEXT[]
  ),
  (
    'kl-varkala-1', 'Varkala Red Cliff & North Cliff Cafes', 'cafes', 'Dramatic geological red laterite cliffs towering over the Arabian Sea with chilled-out beach shacks, Tibetan shops, yoga lofts, and live acoustic music.',
    'North Cliff, Varkala', 'North Cliff', 'Varkala', 'Kerala',
    8.7379, 76.7163, 1, 220, 4.8,
    19800, '07:00', '23:00',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', true, true,
    true, true,
    true,
    ARRAY['Sunset Cliffside Seating', 'Surfing Lessons Available', 'Affordable Hostel Dorms']::TEXT[]
  ),
  (
    'tn-ooty-1', 'Ooty Nilgiri Toy Train & Doddabetta Peak', 'viewpoints', 'UNESCO Heritage steam railway chugging through 250 bridges and pine forests to the highest peak in Nilgiris at 2,637m with telescope house views.',
    'Doddabetta Road, Ooty', 'Doddabetta', 'Ooty', 'Tamil Nadu',
    11.4064, 76.7337, 1, 120, 4.7,
    28500, '07:00', '18:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹30 Toy Train Student Fare', 'Homemade Chocolates from ₹50', 'Pine Forest Photo Walks']::TEXT[]
  ),
  (
    'tn-madurai-1', 'Madurai Meenakshi Amman Temple & Jigarthanda Hub', 'cultural_temples', 'Towering colorful Dravidian gopurams with 33,000 sculptures, vibrant flower markets, and the legendary cool Madurai Famous Jigarthanda drink.',
    'Madurai Main, East Gate', 'Meenakshi Temple Precinct', 'Madurai', 'Tamil Nadu',
    9.9195, 78.1193, 0, 50, 4.9,
    45000, '05:00', '22:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Temple Grounds', 'Original Jigarthanda for ₹40', 'Night Market Strolls']::TEXT[]
  ),
  (
    'tn-kodaikanal-1', 'Kodaikanal Star Lake & Coaker''s Walk', 'parks_nature', 'Princess of Hill Stations featuring a giant star-shaped lake with pedal boating, misty pedestrian cliffside paths, and pine forest cycle tracks.',
    'Lake Road, Kodaikanal', 'Kodai Lake', 'Kodaikanal', 'Tamil Nadu',
    10.2381, 77.4892, 1, 120, 4.8,
    22000, '06:00', '19:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Bicycle Rental ₹50/hour', 'Budget Boating Deals', 'Pleasant Year-round Chill']::TEXT[]
  ),
  (
    'mh-lonavala-1', 'Lonavala Tiger''s Leap & Bhushi Dam Trek', 'weekend_trips', 'Iconic Western Ghats getaway for college squads. Sheer 650m cliff with roaring wind, cascading monsoon waterfalls, and hot sweet chikki stalls.',
    'Khandala-Lonavala Road', 'Tiger Point', 'Lonavala', 'Maharashtra',
    18.7548, 73.4062, 1, 150, 4.6,
    29000, '06:00', '19:00',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Shared Auto from Station ₹40', 'Hot Corn Cob & Maggi Under ₹70', 'Epic Monsoon Mist']::TEXT[]
  ),
  (
    'mh-pune-1', 'FC Road & Cafe Vaishali Student Strip', 'restaurants', 'The heartbeat of Pune collegiate life since 1949. Hot SPDP (Sev Potato Dahi Puri), Mysore masala dosas, filter coffee, and post-lecture banter under trees.',
    'Fergusson College Road, Shivajinagar', 'FC Road', 'Pune', 'Maharashtra',
    18.5204, 73.8427, 1, 120, 4.7,
    19400, '07:00', '23:00',
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Student Spot Since 1949', 'SPDP at ₹90', 'Lively Collegiate Boulevard']::TEXT[]
  ),
  (
    'mh-mum-1', 'Marine Drive & Girgaon Chowpatty Sunset', 'viewpoints', 'The Queen''s Necklace curved 3.6km seaside promenade. Cool sea breeze, tetrapods, cutting chai, pani puri, and late-night talks with friends.',
    'Netaji Subhash Chandra Bose Road', 'South Mumbai', 'Mumbai', 'Maharashtra',
    18.9438, 72.8234, 0, 40, 4.9,
    52000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['100% Free Public Promenade', 'Midnight Chai and Bun Maska', '24/7 Police Patrol']::TEXT[]
  ),
  (
    'ga-panaji-1', 'Fontainhas Latin Quarter Colorful Streets', 'photo_spots', 'Heritage Portuguese quarter with pastel yellow and blue villas, vintage balconies, narrow cobblestone streets, and cozy indie bakeries.',
    'Fontainhas, Panjim', 'Latin Quarter', 'Panaji', 'Goa',
    15.4989, 73.8278, 0, 60, 4.7,
    18200, '00:00', '23:59',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['Free Aesthetic Photo Backdrops', 'Traditional Bebinca & Patties under ₹50', 'Art Walk']::TEXT[]
  ),
  (
    'ga-anjuna-1', 'Anjuna Beach & Curlies Sunset Rocks', 'weekend_trips', 'Legendary bohemian seaside destination with volcanic red rock formations, Wednesday flea markets, beach shacks, and vibrant student party vibe.',
    'Anjuna Beach Road, North Goa', 'North Goa Beach', 'Anjuna', 'Goa',
    15.5807, 73.7423, 1, 250, 4.6,
    27000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', true, false,
    false, true,
    true,
    ARRAY['Scooter Rental ₹300/day', 'Sunset Trance & Acoustic Music', 'Thrift Shopping']::TEXT[]
  ),
  (
    'rj-jaipur-1', 'Hawa Mahal & Pink City Bazaars', 'photo_spots', 'Iconic 5-story pink honeycomb palace with 953 jharokhas (windows). Rooftop cafes opposite the facade offer prime photo views and ginger tea.',
    'Badi Choupad, J.D.A. Market, Pink City', 'Pink City', 'Jaipur', 'Rajasthan',
    26.9239, 75.8267, 1, 100, 4.8,
    39000, '09:00', '17:00',
    'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['₹20 Indian Student Concession Ticket', 'Rooftop Cafe Sunset View', 'Pyaaz Kachori Nearby ₹35']::TEXT[]
  ),
  (
    'rj-udaipur-1', 'Lake Pichola Ghats & City Palace Vista', 'viewpoints', 'The "City of Lakes" romantic jewel. Watch golden sunsets reflect off Lake Pichola from Ambrai Ghat with bagpipers and temple bells.',
    'Ambrai Ghat, Chandpole', 'Chandpole', 'Udaipur', 'Rajasthan',
    24.5807, 73.6823, 0, 50, 4.9,
    32000, '06:00', '22:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Ambrai Ghat', 'Heritage Rooftop Dining Under ₹200', 'Boat Rides Available']::TEXT[]
  ),
  (
    'rj-jaisalmer-1', 'Sam Sand Dunes & Desert Safari Camp', 'weekend_trips', 'Golden Thar desert dunes for camel trekking, stargazing under clear skies, folk dances by campfires, and quad biking adventures.',
    'Sam Sand Dunes Road', 'Sam Dunes', 'Jaisalmer', 'Rajasthan',
    26.8317, 70.5056, 2, 450, 4.7,
    16800, '06:00', '22:00',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Camel Ride Group Discounts', 'Free Golden Hour Sunset Photography', 'Bonfire & Folk Music']::TEXT[]
  ),
  (
    'up-agra-1', 'Taj Mahal & Mehtab Bagh Sunset View', 'cultural_temples', 'One of the Seven Wonders of the World. Glowing ivory-white marble mausoleum on the Yamuna riverbank with symmetrical Mughal reflection pools.',
    'Dharmapuri, Forest Colony', 'Tajganj', 'Agra', 'Uttar Pradesh',
    27.1751, 78.0421, 1, 80, 4.9,
    68000, '06:00', '18:30',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['₹50 Indian Citizen Entry', 'Mehtab Bagh Budget Sunset Point', 'Agra Petha Tasting']::TEXT[]
  ),
  (
    'up-varanasi-1', 'Dashashwamedh Ghat & Evening Ganga Aarti', 'cultural_temples', 'The oldest living city in the world. Mystical evening Aarti ceremonies with bronze brass lamps, rhythmic chants, boat rides, and famous Banarasi kachori.',
    'Dashashwamedh Ghat Road', 'Ghats Promenade', 'Varanasi', 'Uttar Pradesh',
    25.3076, 83.0107, 0, 60, 4.9,
    48000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1561361066-419a4bc030e4?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Free Aarti Viewing from Ghat Steps', 'Shared Morning Boat ₹50', 'Blue Lassi Shop under ₹80']::TEXT[]
  ),
  (
    'up-lucknow-1', 'Rumi Darwaza & Hazratganj Kebab Walk', 'street_food', 'City of Nawabs heritage trail. 60-foot Awadhi monumental gateway, the acoustic maze of Bara Imambara, and world-renowned Galouti Kebabs.',
    'Husainabad, Lucknow', 'Husainabad', 'Lucknow', 'Uttar Pradesh',
    26.8687, 80.913, 1, 140, 4.8,
    26000, '06:00', '23:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Free Monument Exterior Lighting at Night', 'Tunday Kababi Rolls under ₹100']::TEXT[]
  ),
  (
    'uk-rishikesh-1', 'Laxman Jhula & White Water River Rafting', 'weekend_trips', 'Yoga capital of the world on the banks of clear emerald Ganga. Thrilling Grade III river rafting, cliff jumping, Beatles Ashram, and rooftop vegan cafes.',
    'Tapovan, Laxman Jhula', 'Tapovan', 'Rishikesh', 'Uttarakhand',
    30.136, 78.3262, 1, 350, 4.9,
    34000, '06:00', '22:00',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', true, true,
    false, true,
    true,
    ARRAY['16km Rafting from ₹400/person', 'Free Beach Camping & Ganga Aarti', 'Backpacker Hostels']::TEXT[]
  ),
  (
    'uk-nainital-1', 'Naini Lake & Snow View Point Cable Car', 'viewpoints', 'Eye-shaped mountain lake surrounded by seven verdant peaks. Rowboat sailing, Mall Road evening walks, and Himalayan mountain panorama vistas.',
    'The Mall, Nainital', 'Mall Road', 'Nainital', 'Uttarakhand',
    29.3803, 79.4636, 1, 160, 4.7,
    24000, '06:00', '20:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Rowboat ₹150 for 4 Friends', 'Momos and Hot Thukpa from ₹80', 'Cable Car Rides']::TEXT[]
  ),
  (
    'hp-manali-1', 'Old Manali Bohemian Cafes & Solang Valley', 'cafes', 'Chill cedar forest enclave filled with live jam sessions, rustic wooden pizza cafes, trout fishing, and adrenaline-pumping Solang valley paragliding.',
    'Old Manali Village, Kullu District', 'Old Manali', 'Manali', 'Himachal Pradesh',
    32.253, 77.175, 1, 200, 4.8,
    36000, '08:00', '23:30',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', true, true,
    true, true,
    true,
    ARRAY['High-speed Wi-Fi in Cafes', 'Woodfire Pizza under ₹250', 'Trek to Jogini Waterfall']::TEXT[]
  ),
  (
    'hp-kasol-1', 'Kasol & Chalal Parvati River Walk', 'parks_nature', 'Backpacker''s haven nestled beside roaring Parvati River with pine forest suspension bridges, Israeli shakshuka cafes, and trailheads to Kheerganga.',
    'Parvati Valley, Kasol', 'Parvati Valley', 'Kasol', 'Himachal Pradesh',
    32.01, 77.315, 1, 180, 4.8,
    21000, '06:00', '22:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', true, true,
    true, true,
    true,
    ARRAY['Free Chalal Nature Trek', 'Riverside Bonfires & Acoustic Jamming', 'Budget Homestays']::TEXT[]
  ),
  (
    'hp-shimla-1', 'Shimla Ridge & Mall Road Heritage Walk', 'photo_spots', 'Classic colonial summer capital promenade with neo-Gothic Christ Church, panoramic views of snow-capped Shivalik ranges, and street pastries.',
    'The Ridge, Mall Road', 'The Ridge', 'Shimla', 'Himachal Pradesh',
    31.1048, 77.1734, 1, 120, 4.7,
    29000, '07:00', '22:00',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Pedestrian-Only Safe Boulevard', 'Yak Photo Opportunities', 'Budget Heritage Toy Train']::TEXT[]
  ),
  (
    'wb-darjeeling-1', 'Darjeeling Tiger Hill Sunrise & Kanchenjunga', 'viewpoints', 'Witness the sunrise paint Mount Kanchenjunga in gold and crimson at 2,590m. Follow with steaming cups of Muscatel tea and colonial bakeries.',
    'Senchal Road, Darjeeling', 'Tiger Hill', 'Darjeeling', 'West Bengal',
    27.0098, 88.2612, 1, 100, 4.9,
    27500, '04:00', '18:00',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹40 Shared Jeep from Town', 'Glenary''s Bakery Treats under ₹100', 'World Heritage Toy Train']::TEXT[]
  ),
  (
    'wb-kolkata-1', 'College Street Boi Para & Indian Coffee House', 'study_spots', 'The world''s largest second-hand book market spanning 1.5km. Heritage 1876 coffee house frequented by Nobel laureates, poets, and student debaters.',
    '15, Bankim Chatterjee St, College Square', 'College Street', 'Kolkata', 'West Bengal',
    22.5744, 88.3629, 1, 80, 4.8,
    21000, '09:00', '21:00',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', false, false,
    false, false,
    true,
    ARRAY['Rare College Textbooks at 60% Off', '₹25 Hot Filter Coffee & Mutton Cutlet', 'Historic Intellectual Vibe']::TEXT[]
  ),
  (
    'or-konark-1', 'Konark Sun Temple & Chandrabhaga Beach', 'cultural_temples', '13th-century colossal stone chariot of the Sun God with 24 carved wheels and erotic reliefs. Pair with clean golden sands of Chandrabhaga beach.',
    'Konark, Puri District', 'Konark', 'Konark', 'Odisha',
    19.8876, 86.0945, 1, 70, 4.8,
    31000, '06:00', '20:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹40 Indian Student Ticket', 'Chariot Wheel Geometry Tour', 'Beach Surfing Spot']::TEXT[]
  ),
  (
    'or-puri-1', 'Puri Golden Beach & Jagannath Temple Street', 'viewpoints', 'Blue Flag certified pristine beach with rolling waves of the Bay of Bengal, sand art displays, and authentic Khaja sweet stalls.',
    'Chakratirtha Road, Puri', 'Golden Beach', 'Puri', 'Odisha',
    19.8037, 85.8286, 0, 40, 4.7,
    33000, '05:00', '22:00',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Clean Blue Flag Promenade', 'Crispy Crab and Fish Fry under ₹100', 'Sand Sculpture Spot']::TEXT[]
  ),
  (
    'gj-kutch-1', 'Rann of Kutch White Desert & Salt Flat Sunset', 'weekend_trips', 'The world''s largest salt desert sparkling like snow under the sun and moonlight. Camel cart rides, Kutchi embroidery, and Rann Utsav cultural nights.',
    'Dhordo, Kutch District', 'Dhordo Salt Marsh', 'Kutch', 'Gujarat',
    23.834, 69.54, 1, 250, 4.9,
    22000, '06:00', '22:00',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Full Moon Night Stargazing', 'Unique White Salt Photography', 'Budget Dorm Tents']::TEXT[]
  ),
  (
    'gj-ahmedabad-1', 'Sabarmati Riverfront & Manek Chowk Night Food', 'street_food', 'Modern 11km riverfront promenade with cycle tracks, followed by the buzzing midnight food court serving chocolate sandwiches and Gwalior dosas.',
    'Riverfront West & Manek Chowk, Old City', 'Riverfront', 'Ahmedabad', 'Gujarat',
    23.0225, 72.5714, 1, 120, 4.7,
    28000, '06:00', '02:00',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80', true, false,
    false, true,
    true,
    ARRAY['Public Smart Cycle ₹10/hour', 'Open till 2 AM for Exams Study Breaks']::TEXT[]
  ),
  (
    'mp-khajuraho-1', 'Khajuraho Western Group of Temples', 'cultural_temples', 'UNESCO World Heritage sandstone masterpieces from 950 AD depicting celestial celebration of life, dance, spirituality, and love.',
    'Rajnagar Road, Sevagram', 'Western Group', 'Khajuraho', 'Madhya Pradesh',
    24.8318, 79.9199, 1, 60, 4.8,
    18000, '06:00', '18:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹40 Indian Student Ticket', 'Bicycle Tours Around the Lakes', 'Evening Light & Sound Show']::TEXT[]
  ),
  (
    'mp-indore-1', 'Sarafa Bazaar Midnight Street Food Street', 'street_food', 'Jewelry market by day, food paradise by night! Famous Bhutte Ka Kees, Garadu, giant Jalebas, Joshi''s flying dahi vada, and kulfi.',
    'Sarafa Bazaar, Rajwada', 'Rajwada', 'Indore', 'Madhya Pradesh',
    22.7196, 75.8577, 1, 120, 4.9,
    31000, '20:00', '03:00',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Full Street Food Tour Under ₹150', 'Open Till 3 AM', 'India''s Cleanest City Experience']::TEXT[]
  ),
  (
    'br-bodhgaya-1', 'Mahabodhi Temple & Bodhi Tree Meditation', 'cultural_temples', 'The sacred place where Prince Siddhartha attained enlightenment under the Bodhi Tree in 588 BCE. Monasteries built by Japan, Bhutan, and Thailand.',
    'Bodh Gaya, Gaya District', 'Bodh Gaya', 'Bodh Gaya', 'Bihar',
    24.6951, 84.9913, 0, 20, 4.9,
    29000, '05:00', '21:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Temple', 'Serene International Meditation Gardens', 'Litti Chokha Nearby ₹40']::TEXT[]
  ),
  (
    'br-nalanda-1', 'Nalanda Mahavihara Ancient University Ruins', 'cultural_temples', 'The world''s premier residential university active from 5th to 12th century with red-brick stupas, lecture halls, and sprawling student dormitories.',
    'Bargaon, Nalanda', 'Nalanda Archaeological Site', 'Nalanda', 'Bihar',
    25.1357, 85.4449, 1, 50, 4.7,
    14000, '09:00', '17:00',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Student Concession Entry ₹20', 'World Heritage Learning Experience']::TEXT[]
  ),
  (
    'as-kaziranga-1', 'Kaziranga Elephant Safari & One-Horned Rhinos', 'parks_nature', 'Vast Brahmaputra floodplain grasslands hosting two-thirds of the world''s great one-horned rhinoceros population, wild water buffaloes, and tigers.',
    'Kanchanjuri, Golaghat District', 'Central Range', 'Kaziranga', 'Assam',
    26.5775, 93.1711, 2, 400, 4.8,
    22000, '06:00', '17:00',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Jeep Safari Group Sharing ₹350', 'Assam Orchid & Biodiversity Park', 'Rhino Sighting Guaranteed']::TEXT[]
  ),
  (
    'as-guwahati-1', 'Umananda Island & Brahmaputra Sunset Cruise', 'viewpoints', 'The smallest inhabited river island in the world right in the middle of mighty Brahmaputra river. Affordable public ferry and peacock island walks.',
    'Umananda Ghat, Panbazar', 'Brahmaputra River', 'Guwahati', 'Assam',
    26.195, 91.745, 1, 60, 4.7,
    16500, '07:00', '17:30',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹20 Government Ferry Ride', 'Stunning 360° River Views', 'Golden Langur Sighting']::TEXT[]
  ),
  (
    'sk-gangtok-1', 'MG Marg Pedestrian Boulevard & Ropeway', 'photo_spots', 'Clean eco-friendly smoke-free pedestrian mall lined with fairy lights, Himalayan momo corners, rooftop karaoke cafes, and cable car aerial views.',
    'MG Marg, Gangtok', 'MG Marg', 'Gangtok', 'Sikkim',
    27.3314, 88.6138, 1, 150, 4.8,
    26000, '08:00', '22:00',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', true, true,
    false, true,
    true,
    ARRAY['Free Wi-Fi Boulevard', 'Steaming Pork & Veg Momos ₹80', 'Clean & Litter-free Alpine Vibe']::TEXT[]
  ),
  (
    'ml-cherrapunji-1', 'Nohkalikai Falls & Double Decker Living Root Bridges', 'viewpoints', 'Tallest plunge waterfall in India dropping 340m into a turquoise pool, paired with the legendary bio-engineered Ficus tree living root bridges.',
    'Sohra, East Khasi Hills', 'Nohkalikai', 'Cherrapunji', 'Meghalaya',
    25.2757, 91.6848, 1, 80, 4.9,
    24000, '06:00', '17:30',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹30 Entry to Viewpoint', 'Bucket-list Student Hiking', 'Clouds Rolling Under Your Feet']::TEXT[]
  ),
  (
    'ar-tawang-1', 'Tawang Monastery & Sela Pass Frozen Lake', 'cultural_temples', 'Second largest monastery in the world at 3,000m altitude with painted Buddhist mandalas, chanting monk halls, and snow-clad mountain passes.',
    'Tawang Town', 'Tawang Valley', 'Tawang', 'Arunachal Pradesh',
    27.5861, 91.8594, 1, 120, 4.9,
    14000, '07:00', '18:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Monastery Grounds', 'Traditional Butter Tea & Thukpa ₹50', 'Untouched Himalayan Beauty']::TEXT[]
  ),
  (
    'cg-bastar-1', 'Chitrakote Waterfalls (Niagara of India)', 'parks_nature', 'India''s widest waterfall spanning 300 meters across the Indravati river. Roaring horseshoe plunge with boat rides directly up to the mist spray.',
    'Chitrakote, Bastar District', 'Indravati Gorge', 'Bastar', 'Chhattisgarh',
    19.2014, 81.7061, 1, 100, 4.8,
    16000, '06:00', '19:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Boat Rides Under ₹100', 'Night Floodlit Waterfall Views', 'Tribal Bell Metal Craft Markets']::TEXT[]
  ),
  (
    'jh-ranchi-1', 'Dassam Falls & Hundru Rapids Nature Trek', 'viewpoints', 'Spectacular 44m natural staircase falls cascading over Nick Point rocks on the Kanchi River surrounded by dense green sal forest canopy.',
    'Taimara, Bundu Block', 'Kanchi River Range', 'Ranchi', 'Jharkhand',
    23.1436, 85.465, 0, 40, 4.6,
    13500, '08:00', '17:30',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Falls View', 'Picnic Spot for College Groups', 'Fresh Roasted Sweet Corn']::TEXT[]
  ),
  (
    'hr-gurugram-1', 'Cyber Hub & Galleria Food Promenade', 'cafes', 'High-energy open-air pedestrian amphitheatre with gourmet food trucks, gaming lounges, microbreweries, and student hangout terraces.',
    'DLF Cyber City, Phase 2', 'Cyber City', 'Gurugram', 'Haryana',
    28.495, 77.0895, 2, 250, 4.7,
    32000, '10:00', '01:00',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', true, true,
    false, true,
    true,
    ARRAY['Metro Connected (Rapid Metro)', 'Free Live Busker Performances', 'Late Night Dining']::TEXT[]
  ),
  (
    'mn-imphal-1', 'Loktak Lake & Sendra Floating Phumdis', 'parks_nature', 'The largest freshwater lake in Northeast India, famous for its unique circular floating biomass islands (Phumdis) and dancing Sangai deer sanctuary.',
    'Moirang, Bishnupur District', 'Sendra Island', 'Imphal', 'Manipur',
    24.55, 93.8, 1, 120, 4.8,
    11500, '06:00', '18:00',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Traditional Canoe Boat Rides ₹100', 'Unique World-only Floating National Park']::TEXT[]
  ),
  (
    'mz-aizawl-1', 'Reiek Tlang Mountain Peak & Heritage Village', 'viewpoints', 'Spectacular cliff top peak at 1,548m overlooking the emerald hills of Mizoram and plains of Bangladesh, with preserved traditional Mizo huts.',
    'Reiek Village, Mamit District', 'Reiek Peak', 'Aizawl', 'Mizoram',
    23.6872, 92.6044, 0, 50, 4.9,
    8900, '06:00', '18:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Nature Trek Path', '360° Panoramic Cloud Bed View', 'Traditional Bamboo Cuisine']::TEXT[]
  ),
  (
    'nl-kohima-1', 'Dzukou Valley Trek & Kisama Heritage Village', 'weekend_trips', 'The "Valley of Flowers of the East" with rolling green velvet hills, natural rock shelters, crystal streams, and the annual Hornbill Festival grounds.',
    'Jakhama Trailhead, Kohima District', 'Dzukou Valley', 'Kohima', 'Nagaland',
    25.5667, 94.0667, 1, 250, 4.9,
    15600, '05:00', '18:00',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Cave Camping for Student Groups', 'Endemic Dzukou Lily Flowers', 'Epic Backpacking']::TEXT[]
  ),
  (
    'pb-amritsar-1', 'Golden Temple (Harmandir Sahib) & Langar Hall', 'cultural_temples', 'Sacred gold-leafed gurdwara rising from the holy Amrit Sarovar pool. 24/7 volunteer-run mega Langar kitchen feeding 100,000 people free daily.',
    'Golden Temple Road, Katra Ahluwalia', 'Heritage Street', 'Amritsar', 'Punjab',
    31.62, 74.8765, 0, 0, 4.9,
    72000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free 24/7 Langar Meals', 'Pure Ghee Kulchas Nearby ₹60', 'Peaceful Night Illuminations']::TEXT[]
  ),
  (
    'tr-agartala-1', 'Ujjayanta Palace & Neermahal Water Palace', 'cultural_temples', 'Stunning white neoclassical royal palace set within Mughal gardens, alongside Neermahal — eastern India''s only lake water palace in Rudrasagar.',
    'Palace Compound, Agartala', 'Central Agartala', 'Agartala', 'Tripura',
    23.8364, 91.2828, 1, 40, 4.7,
    11000, '10:00', '17:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹20 Student Entry to State Museum', 'Night Musical Fountain Shows']::TEXT[]
  ),
  (
    'an-havelock-1', 'Radhanagar Beach & Elephant Beach Snorkel', 'parks_nature', 'Voted one of Asia''s best beaches. Powder-white sand, clear turquoise waters, coastal coral reef snorkeling, and sunset kayaking in mangroves.',
    'Beach No. 7, Swaraj Dweep (Havelock Island)', 'Havelock Island', 'Port Blair', 'Andaman and Nicobar Islands',
    11.984, 92.951, 1, 250, 4.9,
    23000, '06:00', '18:00',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Public Beach Access', 'Snorkeling Coral Reefs from ₹300', 'Bicycle Island Exploring']::TEXT[]
  ),
  (
    'ch-sukhna-1', 'Sukhna Lake Promenade & Rock Garden', 'parks_nature', 'Iconic 3km rain-fed lake at the foothills of the Himalayas, paired with Nek Chand''s surreal 40-acre wonderland crafted entirely from recycled urban waste.',
    'Sector 1, Chandigarh', 'Sector 1', 'Chandigarh', 'Chandigarh',
    30.7421, 76.8188, 1, 60, 4.8,
    34000, '05:00', '21:00',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['₹30 Student Entry to Rock Garden', 'Solar Boat Rides on Sukhna Lake', 'Sunset Jogging Track']::TEXT[]
  ),
  (
    'dd-diu-1', 'Diu Fort & Nagoa Beach Horseshoe Bay', 'cultural_temples', '16th-century sea fortress surrounded on three sides by the Arabian Sea with stone cannons, paired with Nagoa Beach''s semi-circular African Hoka palm bay.',
    'Fort Road, Diu Town', 'Diu Seafront', 'Diu', 'Dadra and Nagar Haveli and Daman and Diu',
    20.7144, 70.9874, 0, 50, 4.7,
    16500, '06:00', '19:00',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry to Historic Sea Fort', 'Budget Scooter Rentals ₹250', 'Water Sports at Nagoa']::TEXT[]
  ),
  (
    'dl-northcampus-1', 'DU North Campus & Hudson Lane Cafes', 'cafes', 'The holy grail of student life in Delhi. Cheesy nachos, thick shakes, pasta combos, and rustic wooden interiors at unbeatable student prices.',
    'H-8, Hudson Lane, GTB Nagar', 'North Campus', 'Delhi', 'Delhi',
    28.6942, 77.2065, 1, 180, 4.7,
    8900, '11:00', '23:00',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', true, true,
    false, false,
    true,
    ARRAY['DU Student ID Specials', 'Bomb Pasta under ₹150', 'Metro Connected (GTB Nagar)']::TEXT[]
  ),
  (
    'dl-chandni-1', 'Chandni Chowk Paranthe Wali Gali & Red Fort', 'street_food', '300-year-old historic culinary lane serving deep-fried stuffed parathas with pumpkin sabzi, rabdi jalebi, and night views of the Red Fort ramparts.',
    'Gali Paranthe Wali, Chandni Chowk', 'Old Delhi', 'Delhi', 'Delhi',
    28.6562, 77.2307, 1, 110, 4.8,
    42000, '08:00', '23:00',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80', false, false,
    false, true,
    true,
    ARRAY['Stuffed Parathas from ₹80', 'Historic Shahjahanabad Culture', 'Cycle Rickshaw Tours']::TEXT[]
  ),
  (
    'jk-srinagar-1', 'Dal Lake Shikara Ride & Floating Flower Market', 'parks_nature', 'Glide on mirror-still waters framed by Pir Panjal peaks. Traditional ornate wooden shikaras, floating artisan markets, and Mughal Nishat Bagh gardens.',
    'Boulevard Road, Dal Lake', 'Dal Lake', 'Srinagar', 'Jammu and Kashmir',
    34.0837, 74.837, 1, 200, 4.9,
    38000, '05:30', '20:30',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Group Shikara ₹400 for 4 Friends', 'Steaming Kashmiri Kahwa ₹30', 'Floating Market Experience']::TEXT[]
  ),
  (
    'jk-gulmarg-1', 'Gulmarg Gondola & Apharwat Peak Snowfields', 'viewpoints', 'One of the highest cable cars in the world reaching 3,980m. Powder snow skiing, snowboarding, panoramic snow vistas, and pine forest snow treks.',
    'Gulmarg Gondola Station, Baramulla', 'Apharwat Range', 'Gulmarg', 'Jammu and Kashmir',
    34.0484, 74.3805, 2, 500, 4.9,
    31000, '08:30', '17:00',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['World-class Snow Adventures', 'Phase 1 Gondola Ride', 'Hot Samosas in Snow']::TEXT[]
  ),
  (
    'la-pangong-1', 'Pangong Tso Crystal Blue High-Altitude Lake', 'viewpoints', 'World-famous 134km endorheic lake changing shades from turquoise to cobalt blue at 4,225m altitude framed by barren rugged Himalayan peaks.',
    'Lukung, Changthang Plateau', 'Pangong Lake', 'Leh', 'Ladakh',
    33.7595, 78.6674, 2, 600, 4.9,
    28000, '06:00', '19:00',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['"3 Idiots" Movie Photo Spot', 'Crystal Clear Milky Way Stargazing', 'Lakeside Shared Camps']::TEXT[]
  ),
  (
    'la-leh-1', 'Leh Main Bazaar & Shanti Stupa Sunset', 'photo_spots', 'White-domed Buddhist stupa on Changspa hilltop offering breathtaking panoramic sunset views of Leh town, Namgyal Tsemo Gompa, and Indus valley.',
    'Shanti Stupa Road, Changspa', 'Changspa', 'Leh', 'Ladakh',
    34.1642, 77.575, 0, 40, 4.8,
    24000, '05:00', '21:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', true, false,
    true, true,
    true,
    ARRAY['Free Entry to Stupa Grounds', 'German Bakeries with Student Wi-Fi', 'Tibetan Thukpa under ₹100']::TEXT[]
  ),
  (
    'ld-agatti-1', 'Agatti Island Lagoon & Coral Atolls', 'parks_nature', 'Pristine 7km coral island with transparent turquoise lagoons, sea turtles, scuba diving on coral reefs, and tranquil coconut palm shores.',
    'Agatti Airport Lagoon Area', 'Agatti Atoll', 'Kavaratti', 'Lakshadweep',
    10.8533, 72.1948, 2, 450, 4.9,
    7800, '06:00', '18:30',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Snorkel with Marine Life', 'Uncrowded Island Paradise', 'Kayaking in Clear Lagoons']::TEXT[]
  ),
  (
    'py-whitetown-1', 'White Town French Quarter & Promenade Beach', 'cafes', 'Mustard-yellow French colonial villas with bougainvillea draped balconies, chic bakeries with croissants and baguettes, and the rock beach promenade.',
    'Romain Rolland Street, White Town', 'White Town', 'Puducherry', 'Puducherry',
    11.9338, 79.835, 1, 150, 4.8,
    31000, '00:00', '23:59',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', true, true,
    true, true,
    true,
    ARRAY['Bicycle Rental ₹80/day', 'French Crepes & Coffee under ₹120', 'Traffic-free Evening Promenade']::TEXT[]
  ),
  (
    'py-auroville-1', 'Auroville Matrimandir & Solar Kitchen Cafe', 'cultural_temples', 'Universal experimental township dedicated to human unity. Golden geodesic meditation dome surrounded by lush green tranquility gardens.',
    'Auroville Road, Villupuram District', 'Auroville', 'Puducherry', 'Puducherry',
    12.007, 79.8106, 0, 50, 4.7,
    22000, '09:00', '17:00',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', false, false,
    true, true,
    true,
    ARRAY['Free Entry with Visitor Pass', 'Peaceful Cycling Trails', 'Organic Farm Cafes']::TEXT[]
  )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    area = EXCLUDED.area,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    price_level = EXCLUDED.price_level,
    approx_cost_for_one = EXCLUDED.approx_cost_for_one,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    image_url = EXCLUDED.image_url,
    has_wifi = EXCLUDED.has_wifi,
    has_charging = EXCLUDED.has_charging,
    is_quiet = EXCLUDED.is_quiet,
    is_outdoor = EXCLUDED.is_outdoor,
    is_student_friendly = EXCLUDED.is_student_friendly,
    student_perks = EXCLUDED.student_perks;
