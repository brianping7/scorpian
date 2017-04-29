/*!
 * Brica Project
 * Copyright(c) 2017-2017 Brian Ping
 */

'use strict';

var runtimeConf = {
  "Port": 7007,
  "Delimiter": '_',
  "MsgPreFix": "/:intent",
  "SceneRole": "Jarvis",

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
