# Pika simple web crawler test 

## Introduction

Simple web crawler test script for web testing with snapshop comparison.

## Installing / Getting started 

TODO

## Developing 
 
### Built With
* [Headless Chrome Automation tool](https://github.com/graphcool/chromeless)

### Prerequisites
The following software must be installed
* [Node >= v8](https://nodejs.org/en/)
* [Chrome >= v60](https://www.google.com.mx/chrome/)
* [Git](https://git-scm.com/downloads) - optional

### Folder structure
* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration file.
* processes: Contains the scripts to start/stop Chrome in headless mode or any other system script required to run the tests.
* src: Contains the simple crawler test script.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code
```
git clone https://github.com/pikamachu/pika-simple-crawler-test.git
cd pika-simple-crawler-test
```

Install dependencies
```
npm install
```
This will start the chrome headless process
```
npm run start-chrome
```

Run simple crawler test.
Parameters:
- chunks: Number of concurrent url calls.
- data-file: File that contains url test data.
```
npm run crawler-test [chunks] [data-file]
```

This will stop the chrome headless process
```
npm run stop-chrome
```

### Pika commands

All previous command can be executed using pika script

```shell
Usage: pika [command]

where [command] is one of:
   crawler-test [chunks] [data-file] - run the crawler test - also starts and stops chrome
     - initial-url: Initial Url to open and parse links.
     - chunks: Number of concurrent url calls. Default 2
   crawler-test-docker - run test using a chrome headless docker
   start-chrome - start chrome in headless mode
   stop-chrome - stop chrome
   format - auto format project code using prettier
```

## Environment
* The project should be ran in a Windows environment an use the .bat files to start and stop chrome.
* Chrome should be installed in **c:\Program Files (x86)\Google\Chrome\Application**, if it is not the case update the path in **processes/start-chrome-headless.bat**.

