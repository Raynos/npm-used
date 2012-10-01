var map = require("map-async")
    , ap = require("ap")
    , partial = ap.partial
    , npm = require("npm")
    , prop = require("prop")
    , ReadStream = require("read-stream")

    , getAuthors = require("./getAuthors")

module.exports = getPackages

function getPackages(category) {
    var queue = ReadStream()
        , stream = queue.stream

    map({
        authors: partial(getAuthors, category)
        , packages: findPackages
    }, callFn, filterData)

    return stream

    function findPackages(callback) {
        npm.load({
            silent: true
        }, ready)

        function ready(err) {
            if (err) {
                return stream.emit("error", err)
            }

            npm.registry

            npm.registry.get("/-/all", 600, false, true, callback)
        }
    }

    function filterData(err, data) {
        if (err) {
            return stream.emit("error", err)
        }

        if (data.authors.length === 0) {
            throw new Error("There are no authors for category", category)
        }

        var packages = data.packages
            , authors = data.authors

        var list = Object.keys(packages)
            .map(toItem, packages)
            .filter(containsAuthor, authors)

        for (var i = 0; i < list.length; i++) {
            queue.push(list[i])
        }
        queue.end()
    }
}

function callFn(item, cb) {
    item(cb)
}

function toItem(name) {
    return this[name]
}

function containsAuthor(item) {
    var maintainers = (item.maintainers || []).map(prop("name"))
        , authors = this

    return maintainers.some(inOther, authors)
}

function inOther(item) {
    var other = this

    return other.indexOf(item) > -1
}
