#include <string>
#include <fstream>
#include <sstream>

class Gem_Cache {
  std::vector<std::string> cache;

  Gem_Cache(const char* file) {
    std::ifstream infile(file);


    std::string line;
    while (std::getline(infile, line))
    {
        std::istringstream iss(line);
        cache.push_back(line);
    } 

}


}