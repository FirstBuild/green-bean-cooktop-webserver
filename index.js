
var express = require('express');
var app = express();
var greenBean = require("green-bean");

//simple way of caching all the data
var CACHE_greenbean_rightFront_status = {};
var CACHE_greenbean_rightRear_status = {};

//express stuff
app.get('/greenbean/right-front/status', function (req, res) {
  res.send(CACHE_greenbean_rightFront_status);
});

app.get('/greenbean/right-rear/status', function (req, res) {
  res.send(CACHE_greenbean_rightRear_status);
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

//green bean stuff
greenBean.connect("range", function(range){

    console.log("connected to range machine.");

    range.modelNumber.read(function(value) {
     console.log("connected to cooktop, the model is : ", value);
    });

    range.burnerStatus.read(function (value) {
        var rightFrontOn = (value.rightFront & 0x80)  !=0;
        var rightRearOn = (value.rightRear & 0x80)  !=0;
        var center = (value.center & 0x80)  !=0;
        var leftRearOn = (value.leftRear & 0x80)  !=0;
        var leftFrontOn = (value.leftFront & 0x80)  !=0;

        console.log("right front burner status:", rightFrontOn);
        console.log("right rear burner status:", rightRearOn);

        CACHE_greenbean_rightFront_status = {"rightFrontOn" : rightFrontOn};
        CACHE_greenbean_rightRear_status = {"rightRearOn" : rightFrontOn};

        // Bit 7: 0 - Off, 1 - On
        // Bit 6: Normal / Sous Vide
        // Bit 5: 0 - Cook, 1 - Preheat
        // Bits 4-0: Burner PwrLevel

        //Masks
        // // 1000 0000 = 0x80
        // // 0100 0000 = 0x40
        // // 0010 0000 = 0x20
        // // 0001 0000 = 0x10
        // // 0000 1000 = 0x08
        // // 0000 0100 = 0x04
        // // 0000 0010 = 0x02
        // // 0000 0001 = 0x01

    });
});
