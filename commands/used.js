var colors = require("colors")
    , communities = require("node-communities")
    , getAuthors = communities.get
    , DEFAULT = communities.DEFAULT
    , Ready = require("ready-signal")
    , toList = require("alists").toList
    , forEach = require("for-each")
    , prop = require("prop")
    , not = require("not")

    , getDependenciesCount = require("../lib/getDependenciesCount")

module.exports = used

function used(category) {
    if (!category) {
        category = DEFAULT
    }

    var printReady = Ready()

    getAuthors(category, printAuthors)

    getDependenciesCount(category).toArray(function (list) {
        console.log("entire list", list.length)

        var values = list.reduce(function (acc, value) {
            var name = value.name
            if (acc[name]) {
                if (value.isDev) {
                    acc[name].isDev = true
                }

                acc[name].count++
            } else {
                acc[name] = value
                value.count = 1
            }

            return acc
        }, {})

        forEach(values, function (value) {
            value.displayString = value.name.green + " : " +
                value.count.toString().cyan
        })

        var items = Object.keys(values).map(function (key) {
                return values[key]
            }).sort(byNumber)
            , dev = items
                .filter(prop("isDev"))
                .map(function (item) {
                    return item.displayString
                })

            , notDev = items
                .filter(not(prop("isDev")))
                .map(function (item) {
                    return item.displayString
                })

        printReady(printNumbers)

        function printNumbers() {
            console.log("\nA total of", items.length.toString().green
                , "dependencies were found\n")

            console.log("\nPopular Dependencies"
                , "\n\n\t" + notDev.slice(0, 15).join("\n\t"), "\n")
            console.log("Popular DevDependencies"
                , "\n\n\t" + dev.slice(0, 15).join("\n\t"), "\n")
        }
    })

    function printAuthors(err, authors) {
        console.log("\nMost used dependencies in"
            , category.green, "\n")

        console.log("Based on the following authors:\n")

        for (var i = 0; i < authors.length; i++) {
            console.log("\t -", authors[i].cyan)
        }

        printReady()
    }
}

function byNumber(a, b) {
    return a.count > b.count ? -1 : 1
}
