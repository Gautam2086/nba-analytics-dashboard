# NBA Analytics Dashboard

Interactive web dashboard for exploring and visualizing NBA statistics from the NBA Analytics and Performance Tracking Database.

## About the Project

This dashboard provides an interface to interact with the NBA database, allowing users to:

- View team performance metrics
- Compare player statistics 
- Run custom SQL queries against the database
- Filter data by various parameters
- Visualize NBA data through interactive charts

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript with Chart.js
- **Backend**: Node.js/Express
- **Database**: PostgreSQL (hosted on Tembo.io)
- **Deployment**: Render

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL database with NBA data

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nba-analytics-dashboard.git
   cd nba-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   DB_NAME=your_database_name
   DB_SSL=true
   PORT=3000
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

```
nba-analytics-dashboard/
├── public/              # Static files
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styles
│   └── app.js           # Frontend JavaScript
├── server.js            # Express server
├── package.json         # Dependencies
├── .env                 # Environment variables (not in git)
└── README.md            # This file
```

## Features

- **Team Analytics**: Visualize team performance metrics
- **Player Comparison**: Compare statistics between players
- **Custom Queries**: Run and visualize SQL queries against the database
- **Interactive Filtering**: Filter data by team, season, and more
- **Responsive Design**: Access the dashboard from any device

## Database Schema

The dashboard connects to an NBA database with the following tables:
- team
- player
- game
- draft_history
- common_player_info
- And more...

## Troubleshooting

- If charts don't display, check browser console for JavaScript errors
- If data doesn't load, verify database connection in server logs
- For query errors, check the PostgreSQL error message in the response

## Contributors

- Gautam Arora


## Acknowledgments

- Data source: Kaggle NBA dataset
- SUNY Buffalo CSE 560: Data Models and Query Languages course
- PostgreSQL and Tembo.io for database hosting 