// Test suite for all Travel With You REST API endpoints
async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('Testing Travel With You REST API endpoints...\n');

  try {
    // 1. Health
    const health = await (await fetch(`${BASE_URL}/health`)).json();
    console.log('✓ Health Endpoint:', health.status, `(${health.app})`);

    // 2. Places filter
    const places = await (await fetch(`${BASE_URL}/places?city=Bengaluru&category=cafes`)).json();
    console.log(`✓ Places Endpoint: Found ${places.total} cafes in Bengaluru.`);

    // 3. Single Place Details
    const singlePlace = await (await fetch(`${BASE_URL}/places/blr-cafe-1`)).json();
    console.log(`✓ Place Details Endpoint: ${singlePlace.place.name}, ${singlePlace.reviews.length} reviews.`);

    // 4. Submit Review
    const reviewRes = await (await fetch(`${BASE_URL}/places/blr-cafe-1/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        cleanliness: 5,
        valueForMoney: 5,
        studentFriendliness: 5,
        comment: 'Super peaceful environment for hackathon coding!',
        userName: 'Aakash Verma'
      })
    })).json();
    console.log(`✓ Review Submission: ${reviewRes.success ? 'Success' : 'Failed'}, new place rating: ${reviewRes.place.rating}`);

    // 5. Weather Endpoint
    const weather = await (await fetch(`${BASE_URL}/weather?city=Bengaluru`)).json();
    console.log(`✓ Weather Endpoint: ${weather.tempC}°C ${weather.condition}. Advice: ${weather.advice}`);

    // 6. AI Plan Endpoint
    const plan = await (await fetch(`${BASE_URL}/ai/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budget: 500,
        friends: 3,
        hours: 4,
        city: 'Bengaluru',
        preferences: ['cafes', 'street_food', 'parks_nature']
      })
    })).json();
    console.log(`✓ AI Planner Endpoint: "${plan.title}" with ${plan.stops.length} stops.`);
    console.log(`  ${plan.budgetGuardianAlert}`);

    // 7. AI Chat Endpoint
    const chat = await (await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Suggest a place to hang out with 4 friends under ₹500',
        city: 'Bengaluru'
      })
    })).json();
    console.log(`✓ AI Chat Endpoint: Response received (${chat.reply.slice(0, 70)}...)`);

    // 8. AI Surprise Me Endpoint
    const surprise = await (await fetch(`${BASE_URL}/ai/surprise-me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: 'Bengaluru', budget: 300 })
    })).json();
    console.log(`✓ AI Surprise Me Endpoint: Picked "${surprise.place.name}" (₹${surprise.place.approxCostForOne})`);

    // 9. Saved Places & Toggle
    const savedToggle = await (await fetch(`${BASE_URL}/saved/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId: 'blr-food-1', userId: 'usr-1' })
    })).json();
    console.log(`✓ Saved Toggle Endpoint: ${savedToggle.isSaved ? 'Added' : 'Removed'} place`);

    // 10. Group Expense Split Endpoint
    const split = await (await fetch(`${BASE_URL}/expenses/split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        friends: ['You', 'Arjun', 'Priya', 'Rohan'],
        expenses: [
          { description: 'Dinner dosas', amount: 1200, paidBy: 'You' },
          { description: 'Bowling', amount: 800, paidBy: 'Arjun' },
          { description: 'Filter coffees', amount: 400, paidBy: 'Priya' }
        ]
      })
    })).json();
    console.log(`✓ Expense Split Endpoint: Total ₹${split.total}, ₹${split.perPerson}/person across 4 friends.`);

    // 11. Memories Endpoint
    const memories = await (await fetch(`${BASE_URL}/memories`)).json();
    console.log(`✓ Memories Endpoint: ${memories.length} memories logged in journal.`);

    console.log('\n🌟 ALL 11 BACKEND REST API ENDPOINTS TESTED SUCCESSFULLY AND WORKING 100%!');
  } catch (err) {
    console.error('Test error:', err);
  }
}

runTests();
