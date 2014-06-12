var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
  //Test Led on pin 13 and strobe it
  (new five.Led(13)).strobe();
});
