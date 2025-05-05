// NBA Analytics Dashboard - Query Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Query app loaded');
    
    // Get the Run Query button
    const runQueryButton = document.getElementById('run-query');
    
    // Add event listener to the button
    if (runQueryButton) {
        console.log('Run Query button found, adding event listener');
        runQueryButton.addEventListener('click', executeQuery);
    } else {
        console.error('Run Query button not found in the DOM');
    }
    
    // Function to execute the query
    function executeQuery() {
        console.log('Execute query function called');
        
        // Get the query from the textarea
        const sqlQueryElement = document.getElementById('sql-query');
        if (!sqlQueryElement) {
            console.error('SQL query textarea not found');
            return;
        }
        
        const sqlQuery = sqlQueryElement.value.trim();
        console.log('Query to execute:', sqlQuery);
        
        if (!sqlQuery) {
            alert('Please enter a SQL query');
            return;
        }
        
        // Get the results table elements
        const resultsTable = document.getElementById('query-results');
        if (!resultsTable) {
            console.error('Results table not found');
            return;
        }
        
        const tableHead = resultsTable.querySelector('thead tr');
        const tableBody = resultsTable.querySelector('tbody');
        
        if (!tableHead || !tableBody) {
            console.error('Table head or body not found');
            return;
        }
        
        // Show loading state
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading results...</td></tr>';
        
        // Execute the query
        console.log('Sending fetch request to /api/execute-query');
        fetch('/api/execute-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sqlQuery })
        })
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Query result data received:', data);
            
            // Clear the table
            tableHead.innerHTML = '';
            tableBody.innerHTML = '';
            
            if (!data.rows || data.rows.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No results found</td></tr>';
                return;
            }
            
            // Add headers
            data.fields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field;
                tableHead.appendChild(th);
            });
            
            // Add rows
            data.rows.forEach(row => {
                const tr = document.createElement('tr');
                
                data.fields.forEach(field => {
                    const td = document.createElement('td');
                    td.textContent = row[field] !== null ? row[field] : '';
                    tr.appendChild(td);
                });
                
                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error executing query:', error);
            let errorMessage = error.message;
            
            // Provide a more user-friendly message for SSL certificate errors
            if (errorMessage.includes('self-signed certificate') || errorMessage.includes('certificate')) {
                errorMessage = 'Database SSL connection error. Please check the server logs for details.';
            }
            
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error: ${errorMessage}</td></tr>`;
        });
    }
});
