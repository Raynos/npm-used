var getAuthors = require("../lib/getAuthors")
    , DEFAULT = require("../lib/config").DEFAULT

module.exports = ls

function ls(category) {
    if (!category) {
        category = DEFAULT
    }

    getAuthors(category, readAuthors)

    function readAuthors(err, authors) {
        if (err) {
            throw err
        }

        if (authors.length === 0) {
            return console.log("Category :-", category, "is empty")
        }

        console.log("Category :-", category, "contains: \n")
        for (var i = 0; i < authors.length; i++) {
            console.log(" - Author:", authors[i])
        }
    }
}
