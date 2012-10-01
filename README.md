# npm-used

See with modules are used the most

## Example unix

`npm-used` is like the most depended on list except you can limit the
search to certain authors grouped by named categories.

This is useful for module discovery.

For example you may want to find out what the popular modules are among
the unix-style nodesters.

After looking at the list you can clearly see you should check out
tap.

```
$ npm-used unix

<snip>
# Lots of NPM HTTP noise
</snip>

------------------------------------
------------------------------------

Most used dependencies in unix

A total of 787 dependencies were found

Based on the following authors:

     - substack
     - dominictarr
     - raynos
     - mikeal
     - maxogden
     - isaacs

Popular Dependencies

    optimist : 35
    request : 31
    through : 30
    event-stream : 30
    inherits : 23
    mkdirp : 21
    ap : 16
    xtend : 15
    traverse : 13
    iterators : 12
    node-uuid : 12
    semver : 11
    seq : 11
    hashish : 11
    lru-cache : 10

Popular DevDependencies

    tap : 204
    expresso : 24
    browserify-server : 18
    browserify : 18
    it-is : 16
    sinon : 16
    request : 16
    testem : 15
    testling : 15
    test-server : 13
    read-stream : 12
    mocha : 11
    write-stream : 10
    event-stream : 10
    assertions : 8
```

## Default categories

`npm-used` comes with the following preloaded categories

 - unix (people like substack)
 - ruby (people like TJ)
 - nodejitsu (nodejitsu folk)
 - top (the top 10)

I could use help finding [better default categories][1]. PR Welcome

## Docs

`$ npm-used --help`

## Installation

`npm install npm-used`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://github.com/Raynos/npm-used/blob/master/lib/getAuthors.js#L3
