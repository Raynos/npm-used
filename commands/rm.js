var config = require("../lib/config")
    , DEFAULT = config.DEFAULT

module.exports = rm

function rm(author, category) {
    if (!author) {
        throw new Error("`npm-used rm AUTHOR` requires an author")
    }

    if (!category) {
        category = DEFAULT
    }

    config.delete(category, author)
}
