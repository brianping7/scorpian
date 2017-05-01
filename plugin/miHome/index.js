var miio = require('./lib');  

// var vacuum = python.import('mirobot/protocol');

var MiHome = function(name, ip, port, token, model) {

  var that = this;

  this.ip = ip;
  this.port = port
  this.token = token;
  this.name = name
  this.model = model
  this.device = null;

  
// initialize the vacuum independently, and general device will create ether with token or without token
  if (model == 'vacuum') {
    this.device = miio.createDevice({
      address: this.ip,
      token: this.token,
      model: 'rockrobo.vacuum.v1'
    });

    this.device.init()
    .then(() => {
        console.log(this.model + " init success");
        return this;
    })
    .catch(err => console.error(this.model + " init error: " + err));
  }
  else {

    if (token == null) {
      var para = { address: ip };
    }
    else {
      var para = { address: ip, token: token };
    };

    miio.device(para)
      .then(device => {
          this.device = device;       
          console.log(this.name + " " + this.device.type + " init success");
          return this;
        })
      .catch(err => console.error(this.name + " init error: " + err));
  }
  
};


MiHome.prototype.exec = function(cmd) {

  var that = this;

  if (cmd == 'Stop') {
    cmd = 'Charge';
  } 

  switch (cmd) {
    case 'Start':
      
      if (this.device.type == 'vacuum') {
        this.device.start()
          .then(res => console.log(this.name + " start result : " + res))
          .catch(err => console.error(this.name + " start error: " + err));
      }

      break;

    case 'Charge':
      
      if (this.device.type == 'vacuum') {
        this.device.charge()
          .then(res => console.log(this.name + " charge result : " + res))
          .catch(err => console.error(this.name + " charge error: " + err));
      }

      break;

    case 'Pause':
      
      if (this.device.type == 'vacuum') {
        this.device.pause()
          .then(res => console.log(this.name + " pause result : " + res))
          .catch(err => console.error(this.name + " pause error: " + err));
      }

      break;
    
    case 'List':
      if (this.device.type == 'gateway') {
        console.log(this.device.devices);
      }

      break;

    default:
      console.log('Invalid type:' + cmd);
  }

  return;

};

MiHome.prototype.powerOn = function() {

  var that = this;

  if(this.device.hasCapability('power')) {
    this.device.setPower(true)
      .then(console.log(this.name + ":Power On"))
      .catch(console.error(this.name + "Failed to Power On"));
  }

};

module.exports = function(name, ip, port, token, model) {
  return new MiHome(name, ip, port, token, model);
};

