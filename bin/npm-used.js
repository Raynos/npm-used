#! /usr/bin/env node

var argv = require("optimist").argv
    , commandList = argv._
    , command = commandList[0]

    , used = require("..")

if (used[command]) {
    used[command].apply(null, commandList.slice(1))
} else {
    used.apply(null, commandList)
}
