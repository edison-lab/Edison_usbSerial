var m = require('mraa');

var pwm = new m.Pwm(3);
var analogPin0 = new m.Aio(0);
pwm.enable(true);
pwm.period_us(2000);

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort('/dev/ttyGS0', {
  baudrate: 115200
}, false);

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+ error);
  } else {
    console.log('port open');
    serialPort.on('data', function(data) {
      var value = parseFloat(data);
      console.log('recivedVal: ' + value);
      pwm.write(value);
    });
    setInterval(function() {
      var analogValueFloat = analogPin0.readFloat();
      var sendVal =  String(analogValueFloat.toFixed(5));
      serialPort.write(sendVal);
      console.log('sendVal: ' + sendVal + '\n');
    }, 10);
  }
});

serialPort.on('close', function(err) {
    console.log('port closed');
});