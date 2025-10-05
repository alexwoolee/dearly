#include <string>
#include "include/httplib.h" // Assume cpp-httplib is available

struct Mailer {
  std::string receiver;
  std::string subject;
  std::string message;
  std::string files;
  std::string assetDir;
  std::string signoffName;

  // Minimum constructor: receiver, subject, message
  Mailer(const std::string& recvm, const std::string& subj, const std::string& msg)
      : receiver(recvm), subject(subj), message(msg) {}

  // 4-argument constructor
  Mailer(const std::string& recvm, const std::string& subj, const std::string& msg, const std::string& files_)
      : receiver(recvm), subject(subj), message(msg), files(files_) {}

  // 5-argument constructor
  Mailer(const std::string& recvm, const std::string& subj, const std::string& msg, const std::string& files_, const std::string& assetDir_)
      : receiver(recvm), subject(subj), message(msg), files(files_), assetDir(assetDir_) {}

  // 6-argument constructor
  Mailer(const std::string& recvm, const std::string& subj, const std::string& msg, const std::string& files_, const std::string& assetDir_, const std::string& signoffName_)
      : receiver(recvm), subject(subj), message(msg), files(files_), assetDir(assetDir_), signoffName(signoffName_) {}
};
