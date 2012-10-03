var colors = require("colors")
    , communities = require("node-communities")
    , getAuthors = communities.get
    , DEFAULT = communities.DEFAULT
    , Ready = require("ready-signal")
    , prop = require("prop")
    , not = require("not")
    , reduce = require("reduce")

    , getDependenciesCount = require("../lib/getDependenciesCount")

module.exports = used

function used(category) {
    if (!category) {
        category = DEFAULT
    }

    var printReady = Ready()

    getAuthors(category, printAuthors)

    getDependenciesCount(category).toArray(function (list) {
        var items = reduce(list.reduce(function (acc, value) {
                var name = value.name
                if (value.isDev) {
                    name = "dev" + name
                }

                if (acc[name]) {
                    acc[name].count++
                } else {
                    acc[name] = value
                    value.count = 1
                }

                return acc
            }, {}), function (acc, value) {
                value.displayString = value.name.green + " : " +
                    value.count.toString().cyan

                return acc.concat(value)
            }, []).sort(byNumber)
            , dev = items
                .filter(prop("isDev"))
                .map(prop("displayString"))
                .slice(0, 15).join("\n\t")

            , notDev = items
                .filter(not(prop("isDev")))
                .map(prop("displayString"))
                .slice(0, 15).join("\n\t")

        printReady(printNumbers)

        function printNumbers() {
            console.log("\nA total of", items.length.toString().green
                , "dependencies were found\n")

            console.log("\nPopular Dependencies", "\n\n\t" + notDev, "\n")
            console.log("Popular DevDependencies", "\n\n\t" + dev, "\n")
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
