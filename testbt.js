var five = require("johnny-five");

var board = new five.Board({
  port: "/dev/tty.LiveLP-DevB"
});

board.on("ready", function(){
  //Test Led on pin 13 and strobe it over bluetooth
  (new five.Led(13)).strobe();
  
});
