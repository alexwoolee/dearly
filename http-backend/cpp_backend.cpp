#define CPPHTTPLIB_OPENSSL_SUPPORT
#include <iostream>
#include <string>
#include "httplib.h" // Assume cpp-httplib is available
#include "json.hpp"

using namespace nlohmann;
// nodemailer port 465
// subject: string, name: string, file: Blob,

struct Mailer {
  std::string subject;
  std::string name;
  std::vector<std::byte> file_data;  // Use std::byte instead of void*
  
  Mailer(std::string subj, std::string n, std::vector<std::byte> data)
      : subject(std::move(subj)), name(std::move(n)), file_data(std::move(data)) {}
};


std::string sendGeminiPrompt(const std::string& prompt, const std::string& GEMINI_KEY) {
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
  }
  

  return -1;
}

class Backend_Server {
    httplib::Server svr;
    int port = 8080;
    std::string host = "0.0.0.0";
    std::string GEMINI_K;
    
public:
    Backend_Server(std::string IP, int PORT, std::string& GEMINI_KEY) {
      port = PORT;
      host = IP;
      GEMINI_K = GEMINI_KEY;
      // Add CORS header to all responseS
    }

    void Init() {
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
  
      svr.Post("/gemini", [gemini_key = GEMINI_K](const httplib::Request& req, httplib::Response& res) {
          std::cout << req.body << '\n';
  
      try {
         json params = json::parse(req.body);
         if (!params.contains("prompt")) {
             res.status = 400;
             res.set_content("Missing 'prompt' field", "text/plain");
             return;
         }
         std::string resp = sendGeminiPrompt(params["prompt"], gemini_key);
         res.set_content(resp, "text/plain");
        } catch (const json::parse_error& e) {
          res.status = 400;
          res.set_content("Invalid JSON: " + std::string(e.what()), "text/plain");
        }
  
  
      });

    }
    
    void Start() {
      std::cout << "Server started at http://" << host << ":" << port << std::endl;
      svr.listen(host.c_str(), port);
    }

};


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
