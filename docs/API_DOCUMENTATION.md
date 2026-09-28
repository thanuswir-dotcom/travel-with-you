# REST API Documentation — Travel With You

Base URL: `http://localhost:5000/api`

---

## 1. System Health
### `GET /health`
Returns system status and timestamp.
```json
{
  "status": "ok",
  "app": "Travel With You Backend API",
  "tagline": "Discover more. Spend less. Make memories.",
  "version": "1.0.0",
  "timestamp": "2026-09-28T12:31:54.080Z"
}
```

---

## 2. Places & Hotspots
### `GET /places`
Query parameters:
- `city` (string, e.g. `Bengaluru`, `Delhi`, `Mumbai`, `Pune`)
- `category` (string, e.g. `cafes`, `study_spots`, `theatres`, `street_food`, etc.)
- `search` (string, text query)
- `maxCost` (number, max cost for one)
- `minRating` (number, 1-5)
- `hasWifi` (`true` | `false`)
- `hasCharging` (`true` | `false`)
- `isOutdoor` (`true` | `false`)
- `isFree` (`true` | `false`)
- `sort` (`rating` | `cost_asc` | `cost_desc` | `reviews` | `distance`)

**Response:**
```json
{
  "total": 3,
  "city": "Bengaluru",
  "places": [ ... ]
}
```

### `GET /places/:id`
Returns single place object with user reviews.

### `POST /places/:id/reviews`
Submit student-verified review.
**Request Body:**
```json
{
  "rating": 5,
  "cleanliness": 5,
  "valueForMoney": 5,
  "studentFriendliness": 5,
  "comment": "Super peaceful study corner with fast Wi-Fi!",
  "userName": "Pooja Sharma"
}
```

---

## 3. Weather-Smart Recommendations
### `GET /weather?city=Bengaluru`
Returns real-time/simulated weather condition and smart recommendations.
**Response:**
```json
{
  "city": "Bengaluru",
  "tempC": 27,
  "condition": "Sunny",
  "humidity": 55,
  "isRaining": false,
  "advice": "☀️ 27°C — Perfect weather for exploring outdoor parks, viewpoints, and street food!",
  "suggestedCategories": ["parks_nature", "viewpoints", "street_food", "photo_spots"]
}
```

---

## 4. AI Recommendation & Planning
### `POST /ai/plan`
Generates an itemized student itinerary with budget breakdown and Budget Guardian warning.
**Request Body:**
```json
{
  "budget": 500,
  "friends": 3,
  "hours": 4,
  "city": "Bengaluru",
  "preferences": ["cafes", "street_food", "parks_nature"]
}
```
**Response:**
```json
{
  "title": "Bengaluru Student Adventure: 4 Hours of Fun & Food",
  "city": "Bengaluru",
  "duration": "4 hours",
  "headcount": 3,
  "totalBudget": 500,
  "estimatedCostPerPerson": 160,
  "estimatedCostForGroup": 480,
  "budgetGuardianAlert": "Within Budget! You save ₹20",
  "budgetBreakdown": { "food": 216, "transit": 96, "activities": 120, "buffer": 48 },
  "stops": [ ... ],
  "transitAdvice": "Namma Metro / local buses are quickest...",
  "thingsToCarry": ["Student ID card", "Metro smart card", "Water bottle"]
}
```

### `POST /ai/chat`
Answers natural language queries grounded in student database.
**Request Body:**
```json
{
  "message": "Where can I eat under ₹200?",
  "city": "Bengaluru"
}
```

### `POST /ai/surprise-me`
Picks an activity considering weather, time, and budget.

---

## 5. Group Expenses & Bill Splitter
### `POST /expenses/split`
Calculates exact settlements across a group.
**Request Body:**
```json
{
  "friends": ["You", "Arjun", "Priya"],
  "expenses": [
    { "description": "Dosas", "amount": 600, "paidBy": "You" },
    { "description": "Auto", "amount": 300, "paidBy": "Arjun" }
  ]
}
```
**Response:**
```json
{
  "total": 900,
  "perPerson": 300,
  "settlements": [
    { "friend": "You", "paid": 600, "share": 300, "net": 300 },
    { "friend": "Arjun", "paid": 300, "share": 300, "net": 0 },
    { "friend": "Priya", "paid": 0, "share": 300, "net": -300 }
  ]
}
```
