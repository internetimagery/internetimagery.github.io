// Generated by CoffeeScript 1.9.1
var downloader;

downloader = function() {
  return $("download").each(function(i, el) {
    var repo;
    repo = $(el).text();
    return $.get("https://api.github.com/repos/internetimagery/" + repo + "/releases/latest", function(data) {
      var link, name;
      console.log(data);
      if (data.assets[0]) {
        console.log("here");
        name = data.assets[0].name;
        link = data.assets[0].browser_download_url;
      } else {
        name = repo;
        link = data.zipball_url;
      }
      return $(el).html("<a href=\"" + link + "\">DOWNLOAD: " + name + "</a>");
    });
  });
};

InstantClick.on('change', downloader);
