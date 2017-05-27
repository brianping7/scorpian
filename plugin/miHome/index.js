var miio = require('./lib');  

const crypto = require('crypto');
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
        if (this.device.type == 'light') {
          this.device.setPower(false)
            .then(res => console.log(this.name + " PowerOff result : " + res))
            .catch(err => console.error(this.name + " PowerOff error: " + err));
        }
        else {
          this.powerSet(false);         
        }
        

        break;
      case 'PowerOn':
        
        if (this.device.type == 'light') {
          this.device.setPower(true)
            .then(res => console.log(this.name + " PowerOn result : " + res))
            .catch(err => console.error(this.name + " PowerOn error: " + err));
        }
        else {
          this.powerSet(true);       
        }
        break;

      case 'PowerStatus':
        this.powerStatus();
        break;

      case 'LightStatus':
        if (this.device.type == 'light') {
          console.log(this.name + " Color Temp: " + this.device.colorTemperature);
        }
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

  _deviecPowerSet(inputDevice, cmd) {
    var that = this;

    for (var i=0; i<inputDevice.powerChannels.length; i++) {
      console.log("Chan " + i);
      inputDevice.setPower(i, cmd)
      .then(power => console.log(inputDevice.type + " Power " + power))
      .catch(err => console.error(inputDevice.type + " Failed: " + err));
    }           
  }

  _deviecPowerStatus(inputDevice) {
    var that = this;

    for (var i=0; i<inputDevice.powerChannels.length; i++) {
      console.log(inputDevice.type + " power " + inputDevice.power(JSON.stringify(i)));
    }           
  }


  powerSet(cmd) {
    var that = this;

    if(that.device.type == 'gateway') {
      that.device.on('deviceAvailable', subDevice => {
        if (subDevice.type == 'power-plug') {

          that._deviecPowerSet(subDevice,cmd);          
        }
        
        return;
      });
    }
    else {
      that._deviecPowerSet(that.device,cmd);   
    }
  }

  powerStatus() {
    var that = this;

    if(that.device.type == 'gateway') {
      that.device.on('deviceAvailable', subDevice => {
        if (subDevice.type == 'power-plug') {

          that._deviecPowerStatus(subDevice);          
        }
        
        return;
      });
    }
    else {
      that._deviecPowerStatus(that.device);   
    }
  }


  encryption (key, iv, data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

    var cipherChunks = [];
    cipherChunks.push(cipher.update(data, 'utf8', 'hex'));
    cipherChunks.push(cipher.final('hex'));
    return new Buffer(cipherChunks.join(''), 'hex');

    // var crypted = cipher.update(data, 'utf8', 'binary');
    // crypted += cipher.final('binary');
    // crypted = new Buffer(crypted, 'binary');
    // return crypted;
  }


  list() {
    var that = this;
    console.log('All SubDevice:'); 

    that.device.on('deviceAvailable', subDevice => {
      //console.log('ID: ' + subDevice.id + ' Model:' + subDevice.model + ' Type:' + subDevice.type );
      
      if (subDevice.model == 'lumi.switch') {
          console.log('Actions: ' + subDevice.actions );
          debugger;

          var key = that.device._developerKey;
          //var token = that.device._lastToken;
          var token = that.device.devApi.token;
  
          console.log('key ' + key + ' token ' + token );

          // var temp = that.device.packet._tokenKey.toString('hex');
          //  console.log('tokenkey ' + temp );

          //  var temp = that.device.packet._tokenIV.toString('hex');
          //  console.log('tokenIV ' + temp );

           var tempIV = Buffer.alloc(16);
           tempIV[0] = 0x17;
           tempIV[1] = 0x99;
           tempIV[2] = 0x6d;
           tempIV[3] = 0x09;
           tempIV[4] = 0x3d;
           tempIV[5] = 0x28;
           tempIV[6] = 0xdd;
           tempIV[7] = 0xb3;
           tempIV[8] = 0xba;
           tempIV[9] = 0x69;
           tempIV[10] = 0x5a;
           tempIV[11] = 0x2e;
           tempIV[12] = 0x6f;
           tempIV[13] = 0x58;
           tempIV[14] = 0x56;
           tempIV[15] = 0x2e;

          //key = '830c9710b71b14519e778ab5bec03465';
          //var tempIV = new Buffer([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e})
           //var tempbuffer= new Buffer(key.toString());

          //console.log('tokenkey ' + that.device.packet._tokenKey + ' IV ' + that.device.packet._tokenIV)

          var base64str = that.encryption(key.toString(), tempIV, token.toString());

          console.log(' ciphertext: ' + base64str.toString('hex'));

          var finalKey = base64str.toString('hex');

          var data = {"cmd":"write",
                "model":"switch",
                "sid":subDevice.id,
                "short_id":2014, 
                "data":"{\"status\":\"click\",\"key\":\"" + finalKey + "\"}" }
          console.log('send data' +  JSON.stringify(data));
          that.device.devApi.send(data);        
                 // 0: data = {"cmd":"read_ack","model":"switch","sid":"158d000155e11d","short_id":2014,"data":"{\"voltage\":3062}"}


        }

       

      return;

    });

    function myfunc(){
      console.log("myfunc");
    };
    var mytimeout=setTimeout(myfunc,60000);

    console.log('End of function');
    if(that.device.devices) {

      that.device.devices.forEach(function(item){  
        console.log('-' + item); 
      })  
    }

  }

};


module.exports = MiHome;