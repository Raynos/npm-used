var used = require("./commands/used")
    , add = require("./commands/add")
    , rm = require("./commands/rm")
    , ls = require("./commands/ls")

used.add = add
used.rm = rm
used.ls = ls

module.exports = used
