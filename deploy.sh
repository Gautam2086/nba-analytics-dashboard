#!/bin/bash

# Simple deployment script for NBA Analytics Dashboard

echo "NBA Analytics Dashboard Deployment Script"
echo "----------------------------------------"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git could not be found. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js could not be found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm could not be found. Please install npm first."
    exit 1
fi

echo "1. Installing dependencies..."
npm install

echo "2. Building the project..."
# If you have a build step, uncomment the next line
# npm run build

echo "3. Setting up for deployment..."
read -p "Which platform do you want to deploy to? (render/heroku/railway): " platform

case $platform in
    render)
        echo "Follow these steps to deploy to Render:"
        echo "1. Create an account on render.com"
        echo "2. Create a new Web Service and connect to your GitHub repository"
        echo "3. Use the following settings:"
        echo "   - Build Command: npm install"
        echo "   - Start Command: node server.js"
        echo "4. Add environment variables from your .env file"
        ;;
    heroku)
        if ! command -v heroku &> /dev/null; then
            echo "Heroku CLI could not be found. Please install Heroku CLI first."
            exit 1
        fi
        
        echo "Deploying to Heroku..."
        read -p "Enter your Heroku app name: " app_name
        
        heroku create $app_name
        heroku addons:create heroku-postgresql:hobby-dev
        
        echo "Setting environment variables..."
        # Add your environment variables here
        # heroku config:set KEY=VALUE
        
        echo "Pushing to Heroku..."
        git push heroku main
        
        echo "Opening app..."
        heroku open
        ;;
    railway)
        echo "Follow these steps to deploy to Railway:"
        echo "1. Create an account on railway.app"
        echo "2. Create a new project and connect to your GitHub repository"
        echo "3. Add a PostgreSQL database service"
        echo "4. Add environment variables from your .env file"
        ;;
    *)
        echo "Invalid platform selected. Please choose render, heroku, or railway."
        exit 1
        ;;
esac

echo "Deployment preparation complete!"
echo "----------------------------------------" 