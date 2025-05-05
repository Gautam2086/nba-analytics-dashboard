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
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Make an actual API call to execute the query
        fetch('/api/execute-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sqlQuery })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideLoadingIndicator();
            if (data.success) {
                displayQueryResults(data);
            } else {
                alert('Error executing query: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            hideLoadingIndicator();
            console.error('Error executing query:', error);
            alert('Error executing query: ' + error.message);
        });
    }
    
    // Display query results in the table
    function displayQueryResults(data) {
        const tableBody = document.querySelector('#query-results tbody');
        const tableHead = document.querySelector('#query-results thead tr');
        
        // Clear previous results
        tableBody.innerHTML = '';
        tableHead.innerHTML = '';
        
        if (!data.rows || data.rows.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No results found</td></tr>';
            return;
        }
        
        // Create table headers based on the fields returned
        data.fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            tableHead.appendChild(th);
        });
        
        // Add rows to the table
        data.rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'highlight-row';
            
            // Add each field in the row
            data.fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = row[field] !== null ? row[field] : '';
                tr.appendChild(td);
            });
            
            tableBody.appendChild(tr);
        });
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