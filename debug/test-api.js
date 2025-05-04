/**
 * Test script for API endpoint
 */

const http = require('http');

// Test query to execute
const testQuery = "SELECT * FROM nba.team LIMIT 5";

// Create the request data
const data = JSON.stringify({
  query: testQuery
});

// Configure the HTTP request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/execute-query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log(`Testing API endpoint: POST http://localhost:3000/api/execute-query`);
console.log(`Query: ${testQuery}`);

// Send the request
const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Response received:');
      console.log(`Row Count: ${parsedData.rowCount}`);
      console.log(`Fields: ${parsedData.fields.join(', ')}`);
      console.log('Sample Row:', JSON.stringify(parsedData.rows[0], null, 2));
      console.log('API Test Successful! ✅');
    } catch (err) {
      console.error('Error parsing response:', err.message);
      console.log('Raw response:', responseData);
      console.log('API Test Failed! ❌');
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error.message);
  console.log('API Test Failed! ❌');
});

// Send the request data
req.write(data);
req.end(); 