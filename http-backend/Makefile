# Compiler
CXX = clang++

# Compiler flags
CXXFLAGS = -std=c++17 -Wall -Wextra -O2

# OpenSSL paths (adjust if needed)
OPENSSL_ROOT = /usr/local/opt/openssl@3
OPENSSL_INCLUDE = $(OPENSSL_ROOT)/include
OPENSSL_LIB = $(OPENSSL_ROOT)/lib

# Include directories
INCLUDES = -I$(OPENSSL_INCLUDE)

# Library directories
LIBDIRS = -L$(OPENSSL_LIB)

# Libraries to link
LIBS = -lssl -lcrypto -lpthread

# Source files
SOURCES = cpp_backend.cpp

# Target executable
TARGET = cpp_backend

# Default target
all: $(TARGET)

# Build the executable
$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $(TARGET) $(SOURCES) $(LIBDIRS) $(LIBS)

# Clean build artifacts
clean:
	rm -f $(TARGET)

# Install dependencies (if needed)
install-deps:
	brew install openssl@3

# Run the server
run: $(TARGET)
	./$(TARGET) 0.0.0.0 8080

# Debug build
debug: CXXFLAGS += -g -DDEBUG
debug: $(TARGET)

.PHONY: all clean install-deps run debug
