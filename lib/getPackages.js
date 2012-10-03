var prop = require("prop")
    , getAuthors = require("node-communities").get
    , chain = require("chain-stream")
    , Eventual = require("eventual-stream")

    , PackageStream = require("./packageStream")

module.exports = getPackages

function getPackages(category) {
    var promise = Eventual()
        , stream = promise.stream

    getAuthors(category, getPackage)

    return stream

    function getPackage(err, authors) {
        if (err) {
            return stream.emit("error", err)
        }

        var ps = chain(PackageStream())
            .filter(containsAuthor)

        promise(ps)

        function containsAuthor(item) {
            var maintainers = item.maintainers || []

            return maintainers
                .map(prop("name"))
                .some(inOther, authors)
        }

        function inOther(item) {
            var other = this

            return other.indexOf(item) > -1
        }
    }
}
