var five = require("johnny-five");

var Twitter = require('twit');
var twit = new Twitter({
  consumer_key: 'tRhVkYhAotpBzrPZgJ9C0dGeA',
  consumer_secret: 'pZ1lOlKAIHVS1LT3ZlVfh4TGMj5cEbSJH7BFWknJE26EDsdl8B',
  access_token: '48478455-hQJ5ywjA3j8WnuoGR06tM1tEtFha5RDa4SfPPcwTA',
  access_token_secret: '8H89ppqzZobutOQW9tt2Y6vWkCItIq2wmUuTZvd7WtrGM'
});

var board = new five.Board({
//  port: "/dev/tty.LiveLP-DevB"
});

board.on("ready", function(){
//  (new five.Led(13)).strobe();

  //Setup the stepper motor
  var stepper = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 11,
      dir: 12
    },
    rpm: 208, //270
    accel: 1600,
    decel: 0,
    direction: 0
  });

  //Spin the stepper
  // stepper.step(1600, function(){
  //   console.log("Done Stepping!");
  // });

  // stepper.run = function(){
  //   console.log(stepper.speed());
  //   stepper.step(16000, function(){
  //     console.log(stepper.speed());
  //   });
  // }

  //setup long functions
  function convDate(date){
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    var dateString = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

    return dateString;
  }

  function spinner(spins){
    if(spins > 0){
      stepper.speed(3600);
      stepper.step(1600, function(err){
        if(err){
          console.log("Error: " + err);
        }
        else{
          stepper.run(spins-1)
        }
      });
    }
  }

  //Ping Twitter for new data
  function pinger(){
    var date = new Date();
    var timeCheck = date.setMinutes(date.getMinutes() - 20);
    date = convDate(date);
    var spins = 0;

    twit.get('search/tweets', {
      q: '#NowPlaying jay-z since:'+date, count: 100
    }, function(err, data, response){
//      console.log(date);
//      console.log(data);

      for(i = 0; i < data.statuses.length; i++)
      {
        var tweetTime = new Date(data.statuses[i].created_at);
        tweetTime = tweetTime.setMinutes(tweetTime.getMinutes());
        //console.log("Check: " + timeCheck + " " + "Tweet: " + tweetTime);
        if (timeCheck <= tweetTime)
        {
          //console.log("This is newer than 20 minutes");
          spins++;
        }
        else
        {
          //console.log("This is older than 20 minutes");
        }
      }

      //Here we pass the number of spins to the controler
      console.log(spins);
      spinner(60);

    });
  }

  pinger();


  //Setup functions for the LP
  stepper.run = function(spins){
    if(spins > 0){
      stepper.speed();
      stepper.step(1600, function(err){
        if(err){
          console.log("Error: " + err);
        }
        else{
          stepper.run(spins-1)
        }
      });
    }
  }

  //5530 seems to be the fastest speed
  stepper.plus = function(speed){
    if(!speed){
      speed = stepper.speed();
      speed += 10;
    }

    stepper.speed(speed);

    console.log(stepper.speed());
  }


  //Inject the REPL with the stepper controler and functions
  board.repl.inject({
    lp: stepper
  });

  console.log("LiveLP Ready!");

});
