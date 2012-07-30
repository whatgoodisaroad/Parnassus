if (!Backbone) {
    var Backbone = require("backbone");
}

var PathTree = Backbone.Model.extend({
    init:function(paths) {
        var group = function rec(depth, paths) {
            return {
                folders:_.chain(paths)
                    .map(function(elem) {
                        return elem.split("/");
                    })
                    .filter(function(elem) {
                        return elem.pathComponents().length - 1 > depth;
                    })
                    .groupBy(function(elem) {
                        return elem.pathComponents()[depth]
                    })
                    .map(function(elem, key) {
                        return { key:key, children:rec(depth + 1, elem) };
                    })
                    .value(),
                leaves:_.chain(changes)
                    .filter(function(elem) {
                        return elem.pathComponents().length - 1 == depth;
                    })
                    .value()
            };
        };
        this.set(
            "root",
            group(
                0, 
                changes
            )
        );
    },

    asUl:function() {
        if (!$) {
            throw "No jQuery";
        }

        var convert = function rec(node) {
            var 
                res = $("<h3/><ul/>"), 
                ul = res.filter("ul"),
                idx,
                leaf,
                comps;

            res.filter("h3")
                .addClass("folder-toggle open")
                .attr("for", node.key)
                .text(node.key);

            ul.attr("for", node.key);

            for (idx = 0; idx < node.children.folders.length; ++idx) {
                $("<li/>")
                    .addClass("folder")
                    .html(
                        rec(
                            node.children.folders[idx]
                        )
                    )
                    .appendTo(ul);
            }
            
            for (idx = 0; idx < node.children.leaves.length; ++idx) {
                leaf = node.children.leaves[idx];
                comps = leaf.pathComponents();

                $("<li><div/><div/></li>")
                    .addClass("change")
                    .attr("data-commitment", leaf.get("commitment"))
                    .attr(
                        "data-path", 
                        leaf.get("path")
                    )
                    .find("div:first")
                        .addClass("filename")
                        .text(comps[comps.length - 1])
                        .end()
                    .find("div:last")
                        .addClass("clearfix")
                        .end()
                    .appendTo(ul);
            }

            return res;
        };

        return convert({ 
                key:"Root", 
                children:this.get("root") 
            })
            .filter("ul");
    }
});

try {
    exports.PathTree = PathTree;
}
catch (exc) { }
