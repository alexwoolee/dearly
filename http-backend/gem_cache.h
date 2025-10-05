#include <string>
#include "apis.h"
#include <fstream>

class Gem_Cache {
  Gem_Cache(const char* file) {
  std::ifstream infile(file);
  }

  std::string GetCache() {

  }
}