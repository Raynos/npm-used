var colors = require("colors")

    , getDependenciesCount = require("../lib/getDependenciesCount")
    , getAuthors = require("../lib/getAuthors")
    , DEFAULT = require("../lib/config").DEFAULT

module.exports = used

function used(category) {
    if (!category) {
        category = DEFAULT
    }

    getDependenciesCount(category).toArray(function (list) {
        var last = list[list.length - 1]

        var items = last.map(function (tuple) {
            return tuple[0].toString().green + " : " +
                tuple[1].toString().cyan
        })

        var dev = items
            .filter(function (str) {
                return str.indexOf("**dev**") > -1
            })
            .map(function (str) {
                return str.replace("**dev**:", "")
            })

        var notDev = items
            .filter(function (str) {
                return str.indexOf("**dev**") === -1
            })

        getAuthors(category, function (err, authors) {
            console.log("\n------------------------------------".cyan)
            console.log("------------------------------------\n".cyan)

            console.log("Most used dependencies in"
                , category.green, "\n")
            console.log("A total of", last.length.toString().green
                , "dependencies were found\n")

            console.log("Based on the following authors:\n")

            for (var i = 0; i < authors.length; i++) {
                console.log("\t -", authors[i].cyan)
            }

            console.log("\nPopular Dependencies"
                , "\n\n\t" + notDev.slice(0, 15).join("\n\t"), "\n")
            console.log("Popular DevDependencies"
                , "\n\n\t" + dev.slice(0, 15).join("\n\t"), "\n")
        })
    })
}
