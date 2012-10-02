var forEach = require("for-each")
    , npm = require("npm")
    , fromSource = require("from-source")

module.exports = PackageStream

function PackageStream() {
    return fromSource(loadNpm)
}

function loadNpm(write, callback) {
    npm.load({
        loglevel: "silent"
    }, ready)

    function ready(err) {
        if (err) {
            return callback(err)
        }

        npm.registry.get("/-/all", 600, false, true, handlePackages)
    }

    function handlePackages(err, packages) {
        if (err) {
            return callback(err)
        }

        forEach(packages, write)
        callback()
    }
}
