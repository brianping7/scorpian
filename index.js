/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

/****************************************************************
 *  Dependency                                                  *
 ***************************************************************/
var http = require('http');
var express = require('express');

var TvSony = require('./plugin/tvSony');
var MiHome = require('./plugin/miHome');

var DeviceConf = require('./config/device.conf.js')
var RuntimeConf = require('./config/runtime.conf.js')
var SceneConf = require('./config/scene.conf.js')

var app = express();

/****************************************************************
 *  Constants                                                   *
 ***************************************************************/

const DEVICE_TYPE_TV = 'tv'
const DEVICE_TYPE_MIHOME= 'miHome'

const DEVICE_BRAND_SONY = 'sony'


const ROLE_IDX = 1
const INTENT_IDX = 0

/****************************************************************
 *  Function Implementation                                     *
 ***************************************************************/
function parseIntent(inputStr) {
  
  console.log('Getting input ' + inputStr);

  var items = new Array();
  items = inputStr.split(RuntimeConf.Delimiter);

  return {"role": items[ROLE_IDX], 
    "intent": items[INTENT_IDX] };
}


function prcsRoleAction(role, intent) {
  
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

    var device = MiHome(role, device.ip, '0000', device.token, device.subType);

    device.exec(intent);
  }
  else {
    return new Error('Invalid type: ' + device.type);
  }

  return;
}


function prcsSceneAction(role, intent) {
  
  console.log('Scene ' + intent + ' will run.' );  

  var scene = SceneConf[intent];

  if (scene == undefined) {
    return new Error('Undefined scene: ' + intent);
  }


  for(var idx in scene.actions) {  
    
    var act = scene.actions[idx];
    
    prcsRoleAction(act.device, act.action, function(retVal) {
      if (retVal) {
        console.error(retVal); 
      } 
    });
  }  

  return;
}

/****************************************************************
 *  Main Function                                               *
 ***************************************************************/
app.get(RuntimeConf.MsgPreFix, function (req, res) {

	// Parse the input intent to get the role and intent information 
  var instruction = parseIntent(req.params.intent);

  var role = instruction.role;
  var intent = instruction.intent;  

  if (role == RuntimeConf.SceneRole) {
    prcsSceneAction(role, intent, function(retVal) {
      if (retVal) {
        console.error(retVal);  
        throw retVal;
      }
    });
  }
  else {
    prcsRoleAction(role, intent, function(retVal) {
      if (retVal) {
        console.error(retVal);  
        throw retVal;
      }
    });
  }

  // Send back the ok status.
  res.sendStatus(200);

});

// Set up the port listener
app.listen(RuntimeConf.Port, function () {
  console.log(RuntimeConf.SceneRole + ' is listening on port ' + RuntimeConf.Port + '!');
});