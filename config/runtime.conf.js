/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

var runtimeConf = {
  "Version": "0.0.1",
  "Port": 7007,
  "Delimiter": '_',
  "SceneRole": "Jarvis",
  "MsgPreFix": "/:intent",


  "DeviceType": {
    "Televison": {
      "Type": "tv",
      "BrandType": {
        "Sony": "sony"
      }
    },
    "MiHome": {
      "Type": "mi",
      "SubyType": {
        "Vacuum": "vacuum"
      }
    }
  }

}

module.exports = runtimeConf;
