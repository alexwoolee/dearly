#include <string>
#include "apis.h"

using namespace nlohmann;

std::string sendGeminiPrompt(const std::string& prompt, const std::string& GEMINI_KEY) {

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
      std::cout << "API sent successfully: " << res->body << std::endl;
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

  httplib::Client cli("localhost", 8000);
  cli.set_connection_timeout(5); // seconds

  // Prepare a simple JSON payload with subject and name
  json payload = {
    {"subject",    mail.subject},
    {"receiver",   mail.receiver},
    {"message",    mail.message},
    {"assetsDir",  mail.assetDir},         
    {"signoffName",mail.signoffName},
    {"files",      json::array()}           
  };

  if (!mail.files.empty())
    payload["files"].push_back(mail.files);

  const std::string body = payload.dump();

  auto res = cli.Post("/send", body, "application/json");
  if (res && res->status == 200) {
      std::cout << "Message sent successfully: " << res->body << std::endl;
      return 0;
  } else {
      std::cerr << "Failed to send message to port 465" << std::endl;
  }
  

  return -1;
}
