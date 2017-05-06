var miio = require('./lib');  

// var vacuum = python.import('mirobot/protocol');


class MiHome {
  
  constructor (name, ip, port, token, model) {
    this.ip = ip;
    this.port = port
    this.token = token;
    this.name = name
    this.model = model
    this.device = null;
  }


  load () {
    var that = this;

    return that.loading = new Promise(function(resolve, reject){
        
      if (that.model == 'vacuum') {
        that.device = miio.createDevice({
          address: that.ip,
          token: that.token,
          model: 'rockrobo.vacuum.v1'
        });

        that.device.init()
        .then(() => {
          console.log(that.model + " init success");
          resolve(that);
        })
        .catch(err => {
          console.error(that.model + " init error: " + err);
          reject(err);
        });
      }
      else {

        if (that.token == null) {
          var para = { address: that.ip };
        }
        else {
          var para = { address: that.ip, token: that.token };
        };

        miio.device(para)
          .then(device => {
              that.device = device;       
              console.log(that.name + " " + that.device.type + " init success");
              resolve(that);
            })
          .catch(err => {
          console.error(that.name + " init error: " + err);
          reject(err);
        });
      }
    });
  }

  exec(cmd) {
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
          this.list();
        }

        break;

      case 'PowerOff':
          this.powerOff();

        break;

      default:
        console.log('Invalid type:' + cmd);
    }

    return;

  }

  powerOn() {
    var that = this;

    if(this.device.hasCapability('power')) {
      this.device.setPower(true)
        .then(console.log(this.name + ":Power On"))
        .catch(console.error(this.name + "Failed to Power On"));
    }

  }

  powerOff() {
    var that = this;

    if(this.device.type == 'gateway') {
      that.device.on('deviceAvailable', subDevice => {
        if (subDevice.type == 'power-plug') {
            subDevice.setPower(1, false)
            .then(power => console.log(subDevice.type + " Power " + power))
            .catch(err => console.error(subDevice.type + " Failed: " + err));
        }
        
        return;
      });
    }
    else {

    }

    // if(this.device.hasCapability('power')) {
    //   this.device.setPower(true)
    //     .then(console.log(this.name + ":Power On"))
    //     .catch(console.error(this.name + "Failed to Power On"));
    // }

  }


  list() {
    var that = this;
    console.log('All SubDevice:'); 

    that.device.on('deviceAvailable', subDevice => {
      console.log('ID: ' + subDevice.id + ' Model:' + subDevice.model + ' Type:' + subDevice.type );
      return;

    });

    if(that.device.devices) {

      that.device.devices.forEach(function(item){  
        console.log('-' + item); 
      })  
    }

  }

};


module.exports = MiHome;