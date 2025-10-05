#include <string>
#include "include/json.hpp"

using namespace nlohmann;

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
    svr.Post("/send", [](const httplib::Request& req, httplib::Response& res) {
        std::cout << req.body << '\n';

        try {
          json params = json::parse(req.body);
          if (!params.contains("name")) {
              res.status = 400;
              res.set_content("Missing 'prompt' field", "text/plain");
              return;
          }
          std::cout << "Sent\n";
          Mailer mail(params["receiver"], params["subject"], params["message"]);
          int r = sendMessage(mail);
          std::cout << "Sent\n";
          res.set_content("Sent", "text/plain");

         } catch (const json::parse_error& e) {
           res.status = 400;
           res.set_content("Invalid JSON: " + std::string(e.what()), "text/plain");
         }
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