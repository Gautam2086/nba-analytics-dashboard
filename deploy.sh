#!/bin/bash
# NBA Analytics Dashboard Deployment Script
# Author: Gautam Arora

echo "NBA Analytics Dashboard Deployment"
echo "=================================="

# Check for required programs
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is required but not installed. Please install npm and try again."
    exit 1
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    echo "Creating public directory..."
    mkdir -p public
fi

# Copy HTML, CSS and JS files to public directory
echo "Copying HTML, CSS, and JavaScript files to public directory..."
cp index.html public/
cp styles.css public/
cp app.js public/

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if deployment is to Heroku
if [ "$1" = "heroku" ]; then
    echo "Preparing for Heroku deployment..."
    
    # Check for Heroku CLI
    if ! command -v heroku &> /dev/null; then
        echo "Heroku CLI is required for Heroku deployment but not installed."
        echo "Please install the Heroku CLI and try again:"
        echo "https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Create Procfile for Heroku if it doesn't exist
    if [ ! -f "Procfile" ]; then
        echo "Creating Procfile for Heroku..."
        echo "web: node server.js" > Procfile
    fi
    
    # Initialize Git repository if not already initialized
    if [ ! -d ".git" ]; then
        echo "Initializing Git repository..."
        git init
        echo "node_modules" > .gitignore
        echo "npm-debug.log" >> .gitignore
        echo ".env" >> .gitignore
    fi
    
    echo "To deploy to Heroku, run the following commands:"
    echo "git add ."
    echo "git commit -m \"Deploy to Heroku\""
    echo "heroku create"
    echo "git push heroku master"
    echo "heroku open"
    
elif [ "$1" = "render" ]; then
    echo "Preparing for Render deployment..."
    echo "Create a new Web Service on Render and connect your GitHub repository."
    echo "Use the following settings:"
    echo "- Build Command: npm install"
    echo "- Start Command: node server.js"
    
elif [ "$1" = "netlify" ]; then
    echo "Preparing for Netlify deployment..."
    echo "Creating netlify.toml configuration..."
    cat > netlify.toml << EOL
[build]
  command = "npm install"
  publish = "public"

[functions]
  directory = "functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
EOL
    
    # Create functions directory
    mkdir -p functions
    
    echo "For Netlify deployment, you will need to create serverless functions."
    echo "Please visit the Netlify dashboard to connect your repository."
    
else
    echo "No specific deployment target specified. Ready for generic deployment."
    echo "The application is ready to be deployed to any Node.js hosting service."
    echo "Make sure your hosting environment sets the PORT environment variable."
fi

echo ""
echo "Deployment preparation completed! Your dashboard is ready for deployment."
echo "To start the application locally, run: npm start" 