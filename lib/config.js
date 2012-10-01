var path = require("path")

    , FileStore = require("./store")

    , HOME = process.env.HOME || process.env.USERPROFILE
    , config = FileStore(path.join(HOME, ".config", "npm-used", "config.json"))

config.DEFAULT = "DEFAULT"

module.exports = config
