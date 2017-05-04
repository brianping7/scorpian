/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

/****************************************************************
 *  Dependency                                                  *
 ***************************************************************/
var TvSony = require('../plugin/tvSony');
var MiHome = require('../plugin/miHome');

var DeviceConf = require('../config/device.conf.js')
var RuntimeConf = require('../config/runtime.conf.js')


/****************************************************************
 *  Function Implementation                                     *
 ***************************************************************/
exports.prcsRoleAction = function (role, intent) {
  
  console.log(role + ' will ' + intent );  

  var device = DeviceConf[role];

  if (device == undefined) {
    return new Error('Undefined role: ' + role);
  }

  console.log('Type: ' + device.type  );  

  if (device.type == RuntimeConf.DeviceType.Televison.Type) {
    
    if (device.brand == RuntimeConf.DeviceType.Televison.BrandType.Sony) {
      TvSony(device.ip, device.token, function(tvDevice) {
        // Call a command
        tvDevice.exec(intent);
      });

    }
    else {
      return new Error('Invalid brand: ' + device.brand + ' of ' + device.type);
    }
    
  } 
  else if ( device.type == RuntimeConf.DeviceType.MiHome.Type) {

    var miDevice = new MiHome(role, device.ip, '0000', device.token, device.subType);

    miDevice.load()
    .then(function(obj){
      obj.exec(intent);
    })
    .catch(function(err){
      console.error(role + " load error: " + err);
    });
    //var device = MiHome(role, device.ip, '0000', device.token, device.subType);

    //device.exec(intent);
  }
  else {
    return new Error('Invalid type: ' + device.type);
  }

  return;
}

exports.prcsSubDeviceList = function (role) {
  var device = DeviceConf[role];

  if (device == undefined ) {
    return new Error('Invalid role: ' + role + ' with type ' + device.type);
  }

  var miDevice = new MiHome(role, device.ip, '0000', device.token, device.subType);

  miDevice.load()
  .then(function(obj){
    obj.list();
  })
  .catch(function(err){
    console.error(role + " load error: " + err);
  });


}
  