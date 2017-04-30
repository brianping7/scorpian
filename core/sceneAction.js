/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

/****************************************************************
 *  Dependency                                                  *
 ***************************************************************/

var RuntimeConf = require('../config/runtime.conf.js')
var SceneConf = require('../config/scene.conf.js')

var roleAction = require('./roleAction.js')
/****************************************************************
 *  Function Implementation                                     *
 ***************************************************************/
exports.prcsSceneAction = function (role, intent) {
  
  console.log('Scene ' + intent + ' will run.' );  

  var scene = SceneConf[intent];

  if (scene == undefined) {
    return new Error('Undefined scene: ' + intent);
  }


  for(var idx in scene.actions) {  
    
    var act = scene.actions[idx];
    
    roleAction.prcsRoleAction(act.device, act.action, function(retVal) {
      if (retVal) {
        console.error(retVal); 
      } 
    });
  }  

  return;
}
