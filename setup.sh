#!/bin/bash

# Commercio Setup Script
# This script installs dependencies for both the server and client applications.
# It is idempotent and returns standard exit codes.

set -e

# Function to print messages
print_msg() {
    echo -e "\n\033[1;34m$1\033[0m"
}

print_error() {
    echo -e "\n\033[1;31mError: $1\033[0m" >&2
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm could not be found. Please install Node.js and npm."
    exit 1
fi

# Store the root directory
ROOT_DIR=$(pwd)

# --- Server Setup ---
print_msg "Setting up Server..."

if [ -d "$ROOT_DIR/server" ]; then
    cd "$ROOT_DIR/server"
    
    print_msg "Installing server dependencies..."
    npm install
    
    if [ ! -f .env ]; then
        echo -e "\033[1;33mWarning: .env file not found in /server. Please create one based on your configuration.\033[0m"
    else
        echo ".env file found."
    fi
else
    print_error "Server directory not found at $ROOT_DIR/server"
    exit 1
fi

# --- Client Setup ---
print_msg "Setting up Client..."

if [ -d "$ROOT_DIR/client" ]; then
    cd "$ROOT_DIR/client"
    
    print_msg "Installing client dependencies..."
    npm install
else
    print_error "Client directory not found at $ROOT_DIR/client"
    exit 1
fi

print_msg "Setup completed successfully!"
exit 0
