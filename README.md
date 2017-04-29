# Welcome to Scorpian Project

This project is aim to integrate the home smart devices with voice control solution. The project is still in initial phase, your comments and advices are fully welcomed.
Current Scorpian Project supports the following devices:

	- Smart Televison
	    - Sony
	- Smart Home Device
	    - MiHome (Xiao Mi)
	      - Vacuum

Scorpian Project has been tested with Amazon Alexa.

## Installation
Use _npm_ to install the project.

```markdown
cd ./scorpius
npm install
```

## Configure
The folder **config** includes all the config file you may want to change. It will help you to config the device or the serial actions you want the device to act. 

- Runtime Config: File _runtime.conf.js_ includes all the runtime config like port, device type and etc.
```markdown
"Port": 7007,              // The port the program will listen in order to get instruction
  "Delimiter": '=',        // You may want to use **"Action=Role"** to make **Role** to do **Action**
  "MsgPreFix": "/:intent", // The prefix of your request string
  "SceneRole": "Jarvis",   // The Role who will run the scene (a serial actions)
```

- Device Config: File _device.conf.js_ includes the device information like IP, type and etc.
```markdown
"Friday": {                // You may want give your device a nick name.
    "ip": "192.168.1.2", // The IP address
    "token": "12345",       // The token of the device if any
    "type" : "tv",         // The device type
    "brand": "sony"        // The brand of the device
  },
```

- Scene Config: File _scene.conf.js_ includes all scene you want to support.
```markdown
"leave": {                 // The scene name, like you are leaving home
    "actions": [           
      {
        "device": "dummy", // The device nick name
        "action": "stop"   // The action you want the device to act.
      },
      {
        "device": "friday",
        "action": "stop"
      }
    ],
  }

```

## Usage
Use _node_ or _nodejs_ to run the program.

```markdown
node index.js
```
You should see the program is listening the PORT you set in config file.


### Thanks
alanreid/bravia - For the Sony Smart TV support.

aholstenson/miio - For the MiHome plugin support.


### Support or Contact
Having trouble with project? Check out our [Issues Support](https://github.com/brianping7/scorpian/issues) and we’ll help you sort it out.
