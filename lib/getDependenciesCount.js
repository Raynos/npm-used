var chain = require("chain-stream")
    , npm = require("npm")
    , semver = require("semver")
    , forEach = require("for-each")
    , toList = require("alists").toList

    , getPackages = require("../lib/getPackages")
    , DEFAULT = require("../lib/config").DEFAULT

module.exports = getDependenciesCount

function getDependenciesCount(category) {
    if (!category) {
        category = DEFAULT
    }

    return chain(getPackages(category))
        .map(function (item, cb) {
            npm.registry.get("/" + item.name, ignoreError)

            function ignoreError(err, value) {
                cb(null, value)
            }
        })
        .filter(function (item) {
            var time = item.time || {}
                , latest = findLatest(time)

            return (new Date(latest)).getYear() === 112
        })
        .map(function (item) {
            var versions = item.versions || {}
            return findLatest(versions)
        })
        .filter(function (item) {
            return item.name
        })
        // God damn hoarders
        .filter(function (item) {
            return item.name !== "hoarders"
        })
        .reductions(function (acc, item) {
            var name = item.name
                , dependencies = item.dependencies || {}
                , devDependencies = item.devDependencies || {}

            increment(acc, name)

            forEach(dependencies, function (v, key) {
                increment(acc, key)
            })

            forEach(devDependencies, function (v, key) {
                increment(acc, "**dev**:" + key)
            })

            return acc
        }, {})
        .map(function (item) {
            return toList(item).sort(byNumber)
        })
}

function byNumber(a, b) {
    return a[1] > b[1] ? -1 : 1
}

function increment(object, name) {
    if (!object[name]) {
        object[name] = 1
    } else {
        object[name]++
    }
}
function findLatest(versions) {
    return Object.keys(versions).reduce(function (acc, name) {
        var version = versions[name]
            , otherVersion = acc.version || "0.0.0"

        if (semver.gt(otherVersion, name)) {
            return acc
        }
        return version
    }, {})
}
