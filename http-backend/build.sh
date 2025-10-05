#!/bin/bash

# Build script for cpp_backend with OpenSSL support

echo "Building cpp_backend with OpenSSL support..."

# Check if OpenSSL is installed
if ! brew list | grep -q openssl; then
    echo "OpenSSL not found. Installing..."
    brew install openssl@3
fi

# Clean and build
make clean
make

if [ $? -eq 0 ]; then
    echo "Build successful! Executable: ./cpp_backend"
    echo "Usage: ./cpp_backend <host> <port> [GEMINI_API_KEY]"
    echo "Example: ./cpp_backend 0.0.0.0 8080 your_api_key"
else
    echo "Build failed!"
    exit 1
fi
