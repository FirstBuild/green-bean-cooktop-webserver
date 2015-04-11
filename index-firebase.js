var firebase_sandbox = 'https://hackathoninventory.firebaseio.com'

var Firebase = require('firebase');
var ref = new Firebase(firebase_sandbox);
var greenBean = require("green-bean");

greenBean.connect("range", function(range){

    console.log("connected to range machine.");

    range.modelNumber.read(function(value) {
     console.log("connected to cooktop, the model is : ", value);
    });

    var timer = setInterval( function() { 
        console.log('reading');
        range.burnerStatus.read(function (value) {
            var rightFrontOn = (value.rightFront & 0x80)  !=0;
            var rightRearOn = (value.rightRear & 0x80)  !=0;
            var center = (value.center & 0x80)  !=0;
            var leftRearOn = (value.leftRear & 0x80)  !=0;
            var leftFrontOn = (value.leftFront & 0x80)  !=0;

            console.log("right front burner status:", rightFrontOn);
            console.log("right rear burner status:", rightRearOn);

            rightRearOnRef = ref.child('/burners/rightRear');
            content = {'isOn': rightRearOn};
            rightRearOnRef.update(content, function(err) {});

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
    } , 2000);
});
