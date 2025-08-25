#!/bin/bash

# Fullstack CI/CD Boilerplate Setup Script
echo "🚀 Setting up Fullstack CI/CD Boilerplate..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You can still run the project without Docker."
    echo "   Install Docker to use the containerized development environment."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Start the development environment:"
echo "   - With Docker: docker-compose up"
echo "   - Without Docker: npm run dev"
echo ""
echo "📚 Available commands:"
echo "   npm run dev          - Start both frontend and backend"
echo "   npm run build        - Build both applications"
echo "   npm test             - Run all tests"
echo "   docker-compose up    - Start with Docker"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
