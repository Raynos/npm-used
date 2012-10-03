var semver = require("semver")
    , chain = require("chain-stream")
    , npm = require("npm")
    , DEFAULT = require("node-communities").DEFAULT
    , cachedOperation = require("cached-operation")
    , extend = require("xtend")
    , reduce = require("reduce")

    , getPackages = require("../lib/getPackages")
    , cachedRegistryGet = cachedOperation(getFromRegistry, {
        maxListeners: 300
    })

module.exports = getDependenciesCount

function getDependenciesCount(category) {
    if (!category) {
        category = DEFAULT
    }

    return chain(getPackages(category))
        // Map to NPM document
        .map(function (item, cb) {
            //console.log("first registry hit")
            cachedRegistryGet("/" + item.name, cb)
        })
        // Find the latest package.json
        .map(function (item) {
            var versions = item && item.versions || {}
            return findLatest(versions)
        })
        // Remove empty projects
        .filter(function (item) {
            return item.name
        })
        // God damn hoarders
        .filter(function (item) {
            return item.name !== "hoarders"
        })
        // Map it to a list of deps & devDeps
        .concatMap(function (item) {
            var dependencies = item.dependencies || {}
                , devDependencies = item.devDependencies || {}
                , deps = reduce(dependencies, function (acc, value, name) {
                    return acc.concat({
                        name: name
                    })
                }, [])
                , devDeps = reduce(devDependencies
                    , function (acc, value, name) {
                        return acc.concat({
                            name: name
                            , isDev: true
                        })
                    }, [])

            return [item].concat(deps, devDeps)
        })
        // Map it to the docs from the registry
        .map(function (item, callback) {
            //console.log("second registry hit")
            if (item.version) {
                return callback(null, item)
            }

            cachedRegistryGet("/" + item.name, returnVersion)

            function returnVersion(err, value) {
                var versions = (value && value.versions) || {}
                    , latestVersion = extend({}, findLatest(versions))

                if (item.isDev) {
                    latestVersion.isDev = true
                }

                callback(null, latestVersion)
            }
        })
        // Filter out noise
        .filter(function (item) {
            return item && item.name
        })
}

function getFromRegistry(key, callback) {
    npm.registry.get(key, 600, false, true, ignoreError)

    function ignoreError(err, value) {
        // if (err) {
        //     console.error("err", err)
        // }

        callback(null, value)
    }
}

function findLatest(versions) {
    return reduce(versions, function (acc, version, name) {
        var otherVersion = acc.version || "0.0.0"

        if (semver.gt(otherVersion, name)) {
            return acc
        }
        return version
    }, {})
}
