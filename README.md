# Welcome to Scorpian Project

This project is aim to integarte the home smart devices with other voice control solution. The project is still in initial phase, your comments and advices are fully welcomed.
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
The folder **config** includes all the config file you may want to change.
- Runtime Config
	File _runtime.conf.js_ includes all the runtime config like port, device type and etc.
```markdown
"Port": 7007,				// The port the program will listen in order to get the instruction
  "Delimiter": '_',			// You may want to use _"Action_Role"_ to make the _Role_ to do the _Action_
  "MsgPreFix": "/:intent",
  "SceneRole": "Jarvis",	// The Role who will run the scene (a serial actions)
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
