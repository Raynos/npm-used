var config = require("./config")

    , unix = [
        "substack"
        , "dominictarr"
        , "raynos"
        , "mikeal"
        , "maxogden"
        , "isaacs"
    ]
    , ruby = [
        "tjholowaychuk"
        , "jashkenas"
        , "rauchg"
        , "bnoguchi"
    ]
    , nodejitsu = [
        "marak"
        , "indexzero"
        , "avianflu"
        , "pgte"
        , "hij1nx"
        , "dscape"
        , "fedor.indutny"
        , "jesusabdullah"
        , "tmpvar"
    ]
    , categories = {
        unix: unix
        , ruby: ruby
        , nodejitsu: nodejitsu
    }


module.exports = getAuthors

function getAuthors(category, cb) {
    if (category in categories) {
        return cb(null, categories[category])
    }

    config.get(category, readAuthors)

    function readAuthors(err, authors) {
        if (err) {
            return cb(err)
        }

        cb(null, authors || [])
    }
}
