#define CPPHTTPLIB_OPENSSL_SUPPORT
#include <iostream>
#include <string>
#include "include/json.hpp"
#include "mailer.h"
#include "server.h"

int main(int argc, char* argv[]) {

    // Parse command line arguments for host and port
    // Usage: ./cpp_backend [host] [port]
    std::string host = "0.0.0.0";
    int port = 8080;
    std::string GEMINI_KEY;

    if (argc < 2) {
        std::cout << "cpp_backend <host> <port> [GEMINI_API_KEY]\n";
        return 0;
    }

    if (argc >= 2)
        host = argv[1];

    if (argc >= 3) {
        try {
            port = std::stoi(argv[2]);
        } catch (...) {
            std::cerr << "Invalid port argument, using default 8080\n";
            port = 8080;
        }
    }
    if (argc >= 4) {
        GEMINI_KEY = argv[3];
    }

    Backend_Server server(host, port, GEMINI_KEY);
    server.Init();
    server.Start();
    
    return 0;
}
