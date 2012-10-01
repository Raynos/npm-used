var config = require("../lib/config")
    , DEFAULT = config.DEFAULT

module.exports = add

function add(author, category) {
    if (!author) {
        throw new Error("`npm-used add AUTHOR` requires an author")
    }

    if (!category) {
        category = DEFAULT
    }

    config.push(category, author)
}
