// Generated by CoffeeScript 1.9.1
var printview;

printview = (function(_this) {
  return function() {
    alert("Entering Print View.\nReload page to exit.");
    $("body").children().hide();
    return $("#desktop").prependTo($("body")).show();
  };
})(this);
