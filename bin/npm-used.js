#! /usr/bin/env node

var argv = require("optimist").argv
    , path = require("path")
    , filed = require("filed")
    , commandList = argv._
    , command = commandList[0]

    , used = require("..")

if (argv.help || argv.h) {
    filed(path.join(__dirname, "usage.txt")).pipe(process.stdout)
} else if (used[command]) {
    used[command].apply(null, commandList.slice(1))
} else {
    used.apply(null, commandList)
}
