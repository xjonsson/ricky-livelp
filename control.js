var five = require("johnny-five");

var board = new five.Board({
  port: "/dev/tty.LiveLP-DevB"
});

board.on("ready", function(){
//  (new five.Led(13)).strobe();

  //Setup the stepper motor
  var stepper = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: [11,12]
  });

  //Make 10 full revolutions counter-clockwise at 18rpm with acceleration and deceleration
  stepper.rpm(360).ccw().accel(1600).decel(1600).step(2000, function() {
    //console.log("Done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
  });
});
