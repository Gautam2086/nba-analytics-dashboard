// NBA Analytics Dashboard - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for charts
    // In a real application, this data would come from the PostgreSQL database via API calls
    
    // Initialize charts when the page loads
    initializeCharts();
    
    // Add event listeners
    document.getElementById('apply-filter').addEventListener('click', applyTeamFilter);
    
    // Add event listener to Run Query button with debug log
    const runQueryBtn = document.getElementById('run-query');
    console.log('Run Query button element:', runQueryBtn);
    
    runQueryBtn.addEventListener('click', function(e) {
        console.log('Run Query button clicked');
        e.preventDefault(); // Prevent any default form submission
        runCustomQuery();
    });
    
    // Initialize the dashboard with default data
    function initializeCharts() {
        renderTeamPerformanceChart();
        renderTopScorersChart();
        renderWinLossChart();
    }
    
    // Team Performance Chart
    function renderTeamPerformanceChart() {
        const ctx = document.getElementById('team-performance-chart').getContext('2d');
        
        // Sample data - would be fetched from database in real app
        const teamData = {
            labels: ['Hawks', 'Celtics', 'Cavaliers', 'Pelicans', 'Bulls', 'Mavericks', 'Nuggets', 'Pistons'],
            datasets: [
                {
                    label: 'Points Per Game',
                    data: [112.5, 117.9, 110.3, 114.2, 109.8, 115.6, 116.2, 106.7],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Assists Per Game',
                    data: [25.1, 26.3, 23.7, 25.9, 24.2, 22.8, 28.5, 22.3],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Rebounds Per Game',
                    data: [44.2, 46.8, 43.5, 45.1, 42.9, 41.5, 44.3, 42.7],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: teamData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Team Performance Metrics'
                    }
                }
            }
        });
    }
    
    // Top Scorers Chart
    function renderTopScorersChart() {
        const ctx = document.getElementById('top-scorers-chart').getContext('2d');
        
        // Sample data - would be fetched from database in real app
        const scorersData = {
            labels: ['LeBron James', 'Kevin Durant', 'Stephen Curry', 'Giannis Antetokounmpo', 'Joel Embiid'],
            datasets: [{
                label: 'Points Per Game',
                data: [27.4, 29.1, 30.2, 28.7, 31.5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'horizontalBar',
            data: scorersData,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Scorers in the League'
                    }
                }
            }
        });
    }
    
    // Win/Loss Chart
    function renderWinLossChart() {
        const ctx = document.getElementById('win-loss-chart').getContext('2d');
        
        // Sample data - would be fetched from database in real app
        const winLossData = {
            labels: ['Hawks', 'Celtics', 'Cavaliers', 'Pelicans', 'Bulls'],
            datasets: [{
                label: 'Wins',
                data: [43, 57, 51, 48, 40],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Losses',
                data: [39, 25, 31, 34, 42],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: winLossData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Team Win/Loss Record'
                    }
                }
            }
        });
    }
    
    // Apply team filter when button is clicked
    function applyTeamFilter() {
        const teamSelect = document.getElementById('team-select');
        const selectedTeam = teamSelect.options[teamSelect.selectedIndex].text;
        const teamId = teamSelect.value;
        
        if (teamId === 'Select a team') {
            alert('Please select a team to filter data');
            return;
        }
        
        // In a real application, this would make an API call to get team-specific data
        alert(`Filtering data for ${selectedTeam} (ID: ${teamId})`);
        
        // Simulate loading data with a timeout
        showLoadingIndicator();
        
        setTimeout(() => {
            // Update charts with new data
            // This is a placeholder - in a real app we would update charts with real data
            hideLoadingIndicator();
            
            // Example notification of success
            alert(`Data successfully filtered for ${selectedTeam}`);
        }, 1500);
    }
    
    // Run custom SQL query
    function runCustomQuery() {
        console.log('runCustomQuery function called');
        
        const sqlQuery = document.getElementById('sql-query').value.trim();
        console.log('SQL Query:', sqlQuery);
        
        if (!sqlQuery) {
            alert('Please enter a SQL query');
            return;
        }
        
        // Show loading indicator
        showLoadingIndicator();
        
        console.log('Sending query to server:', sqlQuery);
        
        // Get the full URL including hostname
        const apiUrl = window.location.origin + '/api/execute-query';
        console.log('API URL:', apiUrl);
        
        // Send the query to the server
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sqlQuery })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Query result data:', data);
            hideLoadingIndicator();
            
            if (data.error) {
                // Handle error
                alert('Error executing query: ' + data.message);
                return;
            }
            
            if (data.rowCount === 0) {
                // No results
                displayQueryResults([]);
                return;
            }
            
            // Process the results into a format for the table
            const results = data.rows.map(row => {
                // Create a generic object that matches the table structure
                return {
                    id: row.player_id || row.team_id || row.game_id || Object.values(row)[0] || 'N/A',
                    name: row.full_name || (row.first_name && row.last_name ? row.first_name + ' ' + row.last_name : '') || Object.values(row)[1] || 'N/A',
                    team: row.team_name || row.abbreviation || Object.values(row)[2] || 'N/A',
                    position: row.position || Object.values(row)[3] || 'N/A',
                    stats: formatStats(row)
                };
            });
            
            console.log('Processed results:', results);
            displayQueryResults(results);
            
            // If we have results, also render a chart
            if (results.length > 0 && results.length < 20) {
                renderQueryResultChart(data.rows);
            }
        })
        .catch(error => {
            console.error('Error executing query:', error);
            hideLoadingIndicator();
            alert('Error executing query: ' + error.message);
        });
    }
    
    // Format stats object for display
    function formatStats(row) {
        // Look for common stat fields
        const statFields = ['pts', 'reb', 'ast', 'stl', 'blk', 'avg_points', 'avg_rebounds', 'avg_assists'];
        
        // Get stats that exist in the row
        const stats = statFields
            .filter(field => row[field] !== undefined)
            .map(field => `${field.replace('avg_', '')}: ${row[field]}`)
            .join(', ');
        
        return stats || 'N/A';
    }
    
    // Render a chart from query results if possible
    function renderQueryResultChart(data) {
        // This is a simple implementation - in a real app, you would analyze the data
        // to determine the best chart type
        
        // For simplicity, we'll just check if there are numeric fields we can chart
        const numericFields = [];
        const sampleRow = data[0];
        
        // Find numeric fields
        Object.keys(sampleRow).forEach(key => {
            if (typeof sampleRow[key] === 'number') {
                numericFields.push(key);
            }
        });
        
        if (numericFields.length === 0) {
            return; // No numeric fields to chart
        }
        
        // Use the first string field as labels
        let labelField = Object.keys(sampleRow).find(key => typeof sampleRow[key] === 'string');
        if (!labelField) {
            labelField = Object.keys(sampleRow)[0]; // Fallback to first field
        }
        
        // Create a simple bar chart with the first numeric field
        const chartField = numericFields[0];
        
        // Get container to place the chart
        const resultsSection = document.querySelector('.card-body');
        
        // Create canvas for the chart if it doesn't exist
        let chartCanvas = document.getElementById('query-result-chart');
        if (!chartCanvas) {
            chartCanvas = document.createElement('canvas');
            chartCanvas.id = 'query-result-chart';
            chartCanvas.style.marginTop = '20px';
            chartCanvas.style.maxHeight = '300px';
            resultsSection.appendChild(chartCanvas);
        }
        
        // Create chart
        new Chart(chartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.map(row => row[labelField]),
                datasets: [{
                    label: chartField,
                    data: data.map(row => row[chartField]),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Display query results in the table
    function displayQueryResults(results) {
        console.log('Displaying query results in table:', results);
        
        const tableBody = document.querySelector('#query-results tbody');
        tableBody.innerHTML = '';
        
        if (results.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No results found</td></tr>';
            return;
        }
        
        results.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'highlight-row';
            
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.team}</td>
                <td>${row.position}</td>
                <td>${row.stats}</td>
            `;
            
            tableBody.appendChild(tr);
        });
    }
    
    // Show loading indicator
    function showLoadingIndicator() {
        console.log('Showing loading indicator');
        
        // Get the specific card-body for the query section
        const queryCardBody = document.querySelector('.card-header.bg-secondary').nextElementSibling;
        console.log('Query card body element:', queryCardBody);
        
        // Create a loading indicator if it doesn't exist
        let loadingIndicator = document.getElementById('loading-indicator');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-indicator';
            loadingIndicator.className = 'loading';
            loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Executing query...</p>
            `;
            queryCardBody.appendChild(loadingIndicator);
        }
        
        loadingIndicator.style.display = 'block';
    }
    
    // Hide loading indicator
    function hideLoadingIndicator() {
        console.log('Hiding loading indicator');
        
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
});

// Simulate an API service for database interactions
// In a real application, this would make actual HTTP requests to a backend server
class NBADatabaseService {
    constructor() {
        this.apiUrl = '/api'; // This would be the actual API endpoint
    }
    
    async getTeams() {
        // Simulated API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { team_id: 1610612737, full_name: 'Atlanta Hawks', abbreviation: 'ATL' },
                    { team_id: 1610612738, full_name: 'Boston Celtics', abbreviation: 'BOS' },
                    { team_id: 1610612739, full_name: 'Cleveland Cavaliers', abbreviation: 'CLE' }
                    // More teams would be included here
                ]);
            }, 300);
        });
    }
    
    async getTeamStats(teamId) {
        // Simulated API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    team_id: teamId,
                    games_played: 82,
                    wins: 48,
                    losses: 34,
                    points_per_game: 114.2,
                    assists_per_game: 25.9,
                    rebounds_per_game: 45.1
                });
            }, 500);
        });
    }
    
    async executeQuery(sqlQuery) {
        // Simulated API call - in a real app this would be sanitized and executed on the server
        console.log(`Executing query: ${sqlQuery}`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                // Sample results
                resolve([
                    { player_id: 201939, full_name: 'Stephen Curry', team_name: 'Golden State Warriors' },
                    { player_id: 2544, full_name: 'LeBron James', team_name: 'Los Angeles Lakers' },
                    { player_id: 201142, full_name: 'Kevin Durant', team_name: 'Phoenix Suns' }
                ]);
            }, 800);
        });
    }
} 