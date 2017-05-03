/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

/****************************************************************
 *  Dependency                                                  *
 ***************************************************************/
const http = require('http');
const express = require('express');
var args = require('commander');

var RuntimeConf = require('./config/runtime.conf.js');

var roleAction = require('./core/roleAction.js');
var sceneAction = require('./core/sceneAction.js');

var app = express();

/****************************************************************
 *  Parse Arguments                                             *
 ***************************************************************/
args
    .version(RuntimeConf.Version)
    .option('-r, --role [name]', 'Give the name of the role.')
    .option('-a, --action [act]', 'The action to act.')
    .option('-s, --scene [name]', 'Give the name of the scene.')
    .option('-l, --list [name]', 'List the sub device of the role')
    //.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);


if (args.role) {
  roleAction.prcsRoleAction(args.role, args.action, function(retVal) {
    if (retVal) {
      console.error(retVal);  
      throw retVal;
    }
  });

  return;
}
else if (args.scene) {
  sceneAction.prcsSceneAction(RuntimeConf.SceneRole, args.scene, function(retVal) {
    if (retVal) {
      console.error(retVal);  
      throw retVal;
    }
  });

  return;
}
else if (args.list)
{
    
}

/****************************************************************
 *  Constants                                                   *
 ***************************************************************/
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


/****************************************************************
 *  Main Function                                               *
 ***************************************************************/
app.get(RuntimeConf.MsgPreFix, function (req, res) {

	// Parse the input intent to get the role and intent information 
  var instruction = parseIntent(req.params.intent);

  var role = instruction.role;
  var intent = instruction.intent;  

  if (role == RuntimeConf.SceneRole) {
    sceneAction.prcsSceneAction(role, intent, function(retVal) {
      if (retVal) {
        console.error(retVal);  
        throw retVal;
      }
    });
  }
  else {
    roleAction.prcsRoleAction(role, intent, function(retVal) {
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