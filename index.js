var used = require("./commands/used")
    , communities = require("node-communities")

used.add = communities.add
used.rm = communities.rm
used.ls = communities.ls

module.exports = used
