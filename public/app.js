// NBA Analytics Dashboard - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for charts
    // In a real application, this data would come from the PostgreSQL database via API calls
    
    // Initialize charts when the page loads
    initializeCharts();
    
    // Add event listeners
    document.getElementById('apply-filter').addEventListener('click', applyTeamFilter);
    document.getElementById('run-query').addEventListener('click', runCustomQuery);
    
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
        const sqlQuery = document.getElementById('sql-query').value.trim();
        
        if (!sqlQuery) {
            alert('Please enter a SQL query');
            return;
        }
        
        // Check if the query includes schema name
        if (sqlQuery.toLowerCase().includes(' from ') && 
            !sqlQuery.toLowerCase().includes(' from nba.')) {
            console.warn('Query missing schema name, automatically adding "nba." prefix');
            // Try to add the schema name
            const parts = sqlQuery.split(/\s+from\s+/i);
            if (parts.length >= 2) {
                const modifiedQuery = parts[0] + ' FROM nba.' + parts[1];
                console.log('Modified query:', modifiedQuery);
                document.getElementById('sql-query').value = modifiedQuery;
                // Continue with the modified query
            }
        }
        
        // Get the query again in case it was modified
        const finalQuery = document.getElementById('sql-query').value.trim();
        console.log('Executing query:', finalQuery);
        showLoadingIndicator();
        
        // Make a real API call to execute the query
        fetch('/api/execute-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: finalQuery })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                console.error('Server response not OK:', response.status, response.statusText);
            }
            return response.json();
        })
        .then(data => {
            hideLoadingIndicator();
            console.log('Response data:', data);
            
            if (data.error) {
                console.error('Error from server:', data.error, data.message || '');
                alert('Error: ' + data.error + (data.message ? '\n' + data.message : ''));
                return;
            }
            
            if (!data.rows || !Array.isArray(data.rows)) {
                console.error('Invalid data format:', data);
                alert('Error: Invalid response format from server');
                return;
            }
            
            console.log('Rows returned:', data.rows.length);
            
            // Convert the data format to what displayQueryResults expects
            const formattedResults = data.rows.map(row => {
                // Extract key properties or create defaults
                return {
                    id: row.player_id || row.team_id || row.game_id || row.id || 'N/A',
                    name: row.full_name || row.team_name || row.name || 'N/A',
                    team: row.team_abbreviation || row.abbreviation || 'N/A',
                    position: row.position || 'N/A',
                    stats: formatStats(row)
                };
            });
            
            console.log('Formatted results:', formattedResults);
            displayQueryResults(formattedResults);
        })
        .catch(error => {
            hideLoadingIndicator();
            console.error('Error in fetch:', error);
            alert('Error executing query: ' + error.message);
        });
    }
    
    // Helper function to format stats from row data
    function formatStats(row) {
        // Create a formatted string of row data excluding some fields
        const excludeKeys = ['id', 'player_id', 'team_id', 'game_id', 'full_name', 'team_name', 'name', 'team_abbreviation', 'abbreviation', 'position'];
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
    
    // Display query results in the table
    function displayQueryResults(results) {
        console.log('displayQueryResults called with:', results);
        const tableBody = document.querySelector('#query-results tbody');
        if (!tableBody) {
            console.error('Error: Could not find table body element');
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (results.length === 0) {
            console.log('No results to display');
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No results found</td></tr>';
            return;
        }
        
        console.log(`Displaying ${results.length} results in table`);
        
        results.forEach((row, index) => {
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
        
        console.log('Table updated with results');
    }
    
    // Show loading indicator
    function showLoadingIndicator() {
        // This would typically show a spinner or loading message
        console.log('Loading data...');
    }
    
    // Hide loading indicator
    function hideLoadingIndicator() {
        // This would typically hide the spinner or loading message
        console.log('Data loaded.');
    }
});

// API service for database interactions
class NBADatabaseService {
    constructor() {
        // Use current location's origin for the API URL to work in both development and production
        this.apiUrl = '/api';
        console.log('API URL configured:', this.apiUrl);
    }
    
    async getTeams() {
        try {
            const response = await fetch(`${this.apiUrl}/teams`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    }
    
    async getTeamStats(teamId) {
        try {
            const response = await fetch(`${this.apiUrl}/team/${teamId}/stats`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching team stats:', error);
            return {
                team_id: teamId,
                games_played: 0,
                wins: 0,
                losses: 0,
                points_per_game: 0,
                assists_per_game: 0,
                rebounds_per_game: 0
            };
        }
    }
    
    async executeQuery(sqlQuery) {
        try {
            const response = await fetch(`${this.apiUrl}/execute-query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: sqlQuery })
            });
            const data = await response.json();
            return data.rows;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
} 