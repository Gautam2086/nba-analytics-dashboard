/**
 * Browser Test Script for NBA Analytics Dashboard
 * 
 * To use this:
 * 1. Open your browser developer tools (F12 or right-click > Inspect)
 * 2. Go to the Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter to run it
 */

// Test query
const testQuery = 'SELECT * FROM nba.team LIMIT 5';

console.log('NBA Analytics Dashboard - Browser Test');
console.log('-------------------------------------');
console.log(`Testing query: ${testQuery}`);

// Direct fetch to test the API
fetch('/api/execute-query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: testQuery })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('API response data:', data);
  
  if (data.rows && data.rows.length > 0) {
    console.log(`Found ${data.rows.length} rows`);
    console.log('First row:', data.rows[0]);
    
    // Test the formatting function used in the main app
    const formattedResults = data.rows.map(row => {
      return {
        id: row.team_id || row.player_id || row.game_id || 'N/A',
        name: row.full_name || row.name || 'N/A',
        team: row.abbreviation || 'N/A',
        position: 'N/A',
        stats: formatStatsForTest(row)
      };
    });
    
    console.log('Formatted results (same as what should appear in the UI):', formattedResults);
  } else {
    console.log('No rows returned or empty result');
  }
})
.catch(error => {
  console.error('Error testing API:', error);
});

// Copy of the formatting function from app.js
function formatStatsForTest(row) {
  // Create a formatted string of row data excluding some fields
  const excludeKeys = ['id', 'player_id', 'team_id', 'game_id', 'full_name', 'name', 'abbreviation', 'position'];
  const statsEntries = Object.entries(row).filter(([key]) => !excludeKeys.includes(key));
  
  if (statsEntries.length === 0) {
    return 'No stats available';
  }
  
  return statsEntries.map(([key, value]) => {
    // Format the key to be more readable (e.g., pts_home -> PTS Home)
    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return `${formattedKey}: ${value}`;
  }).join(', ');
} 