var semver = require("semver")
    , chain = require("chain-stream")
    , npm = require("npm")
    , DEFAULT = require("node-communities").DEFAULT

    , getPackages = require("../lib/getPackages")

module.exports = getDependenciesCount

function getDependenciesCount(category) {
    if (!category) {
        category = DEFAULT
    }

    return chain(getPackages(category))
        // Map to NPM document
        .map(function (item, cb) {
            npm.registry.get("/" + item.name, ignoreError)

            function ignoreError(err, value) {
                if (err) {
                    console.error("err", err)
                }

                cb(null, value)
            }
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
                , deps = Object.keys(dependencies).reduce(function (acc, name) {
                    var value = dependencies[name]

                    return acc.concat({
                        name: name
                    })
                }, [])
                , devDeps = Object.keys(devDependencies)
                    .reduce(function (acc, name) {
                        var value = devDependencies[name]

                        return acc.concat({
                            name: name
                            , isDev: true
                        })
                    }, [])

            return [item].concat(deps, devDeps)
        })
        // Map it to the docs from the registry
        .map(function (item, callback) {
            if (item.version) {
                return callback(null, item)
            }

            npm.registry.get("/" + item.name, returnVersion)

            function returnVersion(err, value) {
                if (err) {
                    console.error("err", err)
                }

                var versions = (value && value.versions) || {}
                    , latestVersion = findLatest(versions)

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
