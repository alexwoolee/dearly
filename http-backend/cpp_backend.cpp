#define CPPHTTPLIB_OPENSSL_SUPPORT
#include <iostream>
#include <string>
#include "httplib.h" // Assume cpp-httplib is available
#include "json.hpp"

// nodemailer port 465
// subject: string, name: string, file: Blob,
httplib::Server svr;
int port = 8080;
std::string host = "0.0.0.0";
std::string GEMINI_KEY;

struct Mailer {
    std::string subject;
    std::string name;
    void* fileData;
};

using namespace nlohmann;

std::string sendGeminiPrompt(std::string prompt) {
    // NOTE: Port 465 is typically used for SMTPS (email sending), not HTTP.
    // Here, we'll send a simple HTTP POST request to localhost:465 as an example.
    // In real use, you would use an SMTP library for email, but per instructions, we use HTTP.

    /*
    
    curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'
    
    */

    httplib::SSLClient cli("generativelanguage.googleapis.com", 443);
    cli.set_connection_timeout(5); // seconds
   // cli.enable_server_certificate_verification(false); // Disable SSL verification for testing

    cli.set_default_headers({{"x-goog-api-key", GEMINI_KEY}});
    // Prepare a simple JSON payload with subject and name
    std::string json = R"({
      "contents": [
        {
          "parts": [
            {
              "text": ")" + prompt + R"("
            }
          ]
        }
      ]
    })";

    auto res = cli.Post("/v1beta/models/gemini-2.5-flash:generateContent", json, "application/json");
    
    if (!res) {
        std::cerr << "Failed to connect to Gemini API - res is null" << std::endl;
        return "Error: Connection failed";
    }
    
    std::cout << "Response status: " << res->status << std::endl;
    std::cout << "Response body: " << res->body << std::endl;
    
    if (res->status == 200) {
        std::cout << "Message sent successfully: " << res->body << std::endl;
        return res->body;
    } else {
        std::cerr << "Failed to send message to Gemini API. Status: " << res->status << std::endl;
        return res->body;
    }
    

    return "Error";
}

int sendMessage(Mailer mail) {
    // NOTE: Port 465 is typically used for SMTPS (email sending), not HTTP.
    // Here, we'll send a simple HTTP POST request to localhost:465 as an example.
    // In real use, you would use an SMTP library for email, but per instructions, we use HTTP.

    httplib::Client cli("localhost", 465);
    cli.set_connection_timeout(5); // seconds

    // Prepare a simple JSON payload with subject and name
    std::string json = "{\"subject\":\"" + mail.subject + "\",\"name\":\"" + mail.name + "\"}";

    auto res = cli.Post("/send", json, "application/json");
    if (res && res->status == 200) {
        std::cout << "Message sent successfully: " << res->body << std::endl;
        return 0;
    } else {
        std::cerr << "Failed to send message to port 465" << std::endl;
        return -1;
    }
    

    return 1;
}

int main(int argc, char* argv[]) {

    // Parse command line arguments for host and port
    // Usage: ./cpp_backend [host] [port]

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
        try {
            GEMINI_KEY = argv[3];
        } catch (...) {
            std::cerr << "Invalid port argument, using default 8080\n";
            port = 8080;
        }
    }
    // Add CORS header to all responses
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"}
    });

    // Handle preflight OPTIONS requests for CORS
    svr.Options(".*", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_header("Access-Control-Max-Age", "86400");
        res.status = 204;
    });

    // Define a simple GET endpoint
    svr.Get("/hello", [](const httplib::Request& req, httplib::Response& res) {
        res.set_content("Hello, World!", "text/plain");
    });

    // Define a POST endpoint
    svr.Post("/echo", [](const httplib::Request& req, httplib::Response& res) {
        std::cout << req.body << '\n';
        res.set_content(req.body, "text/plain");
    });

    svr.Post("/gemini", [](const httplib::Request& req, httplib::Response& res) {
        std::cout << req.body << '\n';
        json params = json::parse(req.body);

        std::string resp = sendGeminiPrompt(params["prompt"]);
        res.set_content(resp, "text/plain");
    });

    std::cout << "Server started at http://" << host << ":" << port << std::endl;
    svr.listen(host.c_str(), port);

    return 0;
}
