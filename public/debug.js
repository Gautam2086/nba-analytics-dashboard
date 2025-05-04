/**
 * Debug script to check if event listeners are properly attached
 * Add this script at the end of the body in index.html to debug event listeners
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug script loaded');
  
  // Check if the Run Query button exists
  const runQueryButton = document.getElementById('run-query');
  
  if (runQueryButton) {
    console.log('Run Query button found', runQueryButton);
    
    // Add our own test listener to see if button clicks work
    runQueryButton.addEventListener('click', function() {
      console.log('Run Query button clicked (from debug listener)');
    });
    
    // Manually trigger a query for testing
    const testQuery = 'SELECT * FROM nba.team LIMIT 3';
    console.log('Setting test query in the textarea');
    
    const queryTextarea = document.getElementById('sql-query');
    if (queryTextarea) {
      queryTextarea.value = testQuery;
    } else {
      console.error('SQL query textarea not found!');
    }
    
  } else {
    console.error('Run Query button NOT FOUND!');
    
    // List all buttons on the page
    console.log('Available buttons:');
    document.querySelectorAll('button').forEach((button, index) => {
      console.log(`Button ${index}:`, button.id, button.textContent);
    });
  }
  
  // Log the structure of elements to check IDs
  console.log('Query input element:', document.getElementById('sql-query'));
  console.log('Query results table:', document.getElementById('query-results'));
}); 