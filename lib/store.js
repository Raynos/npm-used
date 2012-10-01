var map = require("mapping-stream")
    , dirname = require("path").dirname
    , mkdirp = require("mkdirp")
    , fs = require("fs")
    , stat = fs.stat
    , readFile = fs.readFile
    , writeFile = fs.writeFile

module.exports = FileStore

function FileStore(uri) {
    return {
        get: get
        , set: set
        , push: push
        , delete: $delete
    }

    function get(key, cb) {
        statAndRead(uri, returnResult)

        function returnResult(err, json) {
            if (err) {
                return cb(err)
            }

            cb(null, json[key])
        }
    }

    function set(key, value, cb) {
        cb = cb || thrower

        mkdirAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return cb(err)
            }

            json[key] = value

            save(uri, json, cb)
        }
    }

    function push(key, value, cb) {
        cb = cb || thrower

        mkdirAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return cb(err)
            }

            var list = json[key] || (json[key] = [])
            if (list.indexOf(value) === -1) {
                list.push(value)
            }

            writeFile(uri, JSON.stringify(json))
        }
    }

    function $delete(key, value, cb) {
        cb = cb || thrower

        statAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return cb(err)
            }

            var arr = json[key]

            if (Array.isArray(arr)) {
                arr.splice(arr.indexOf(value), 1)
            }

            save(uri, json, cb)
        }
    }

    function mkdirAndRead(uri, cb) {
        mkdirp(dirname(uri), getFile)

        function getFile(err) {
            if (err) {
                return cb(err)
            }

            statAndRead(uri, cb)
        }
    }

    function statAndRead(uri, cb) {
        stat(uri, readIt)

        function readIt(err) {
            if (err) {
                return cb(null, {})
            }

            readFile(uri, readResult)
        }

        function readResult(err, buffer) {
            if (err) {
                return cb(err)
            }

            cb(null, readBuffer(buffer))
        }
    }

    function readBuffer(buffer) {
        var json

        if (buffer.length) {
            json = JSON.parse(buffer.toString())
        } else {
            json = {}
        }

        return json
    }

    function save(uri, json, cb) {
        writeFile(uri, JSON.stringify(json), cb)
    }
}

function thrower(err) {
    if (err) {
        throw err
    }
}
