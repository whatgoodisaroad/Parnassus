if (!Backbone) {
    var Backbone = require("backbone");
}

var ChangeType = {
    Rename:"Rename",
    Modify:"Modify",
    Delete:"Delete"
};

var Change = Backbone.Model.extend({ 
    pathComponents:function() {
        return this.get("path").split("/");
    }
});

Change.Rename = function(oldPath, newPath) {
    return new Change({
        changeType:ChangeType.Rename,
        oldPath:oldPath,
        newPath:newPath
    });
};

Change.Modify = function(path) {
    return new Change({
        changeType:ChangeType.Modify,
        path:path
    });
};

Change.Delete = function(path) {
    return new Change({
        changeType:ChangeType.Delete,
        path:path
    });
};

var ChangeTree = Backbone.Model.extend({
    init:function(changes) {
        var group = function rec(depth, changes) {
            return {
                folders:_.chain(changes)
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

                $("<li/>")
                    .addClass("change")
                    .text(comps[comps.length - 1])
                    .attr("data-path", leaf.get("path"))
                    .appendTo(ul);
            }

            return res;
        };

        return convert({ 
            key:"Root", 
            children:this.get("root") 
        });
    }
});

var RepositoryStatus = Backbone.Model.extend({
	init:function(name, path) {
		this.set({
			name:name, 
			path:path,

            staged:[],
            unstaged:[],
            untracked:[],
            ignoring:[]
		});
	},
    
    loadStatus:function(fn) {
        var self = this;
        if ($) {
            $.getJSON(
                "/json/status/" + 
                    encodeURIComponent(
                        this.get("path")
                    ),
                function(data) {
                    self.parseStatus(data);
                    if ($.isFunction(fn)) {
                        fn();
                    }
                }
            );
        }
    },
    
    parseStatus:function(src) {
        var lines = src
            .replace(/^#\s*/mg, "")
            .split(/\n/g);

        this.set(
            "branch", 
            lines[0].replace(
                /^On branch (.+)$/, 
                "$1"
            )
        );

        this.set({
            staged:[],
            unstaged:[],
            untracked:[]
        });

        var 
            mode = "none", 
            l,
            verb = /^((renamed:)|(modified:)|(deleted:))(\s+)/;

        for (var idx = 1; idx < lines.length; ++idx) {
            l = lines[idx];

            if (l == "Changes to be committed:") {
                mode = "staged";
            }
            else if (l == "Changes not staged for commit:") {
                mode = "unstaged";
            }
            else if (l == "Untracked files:") {
                mode = "untracked";
            }

            if (mode != "none") {
                if (l.indexOf("renamed:") == 0) {
                    var 
                        sp = l.replace(verb, "").split(" -> "),
                        oldPath = sp[0],
                        newPath = sp[1];

                    this.get(mode).push(
                        Change.Rename(
                            oldPath,
                            newPath
                        )
                    );
                    
                }
                if (l.indexOf("modified:") == 0) {
                    this.get(mode).push(
                        Change.Modify(
                            l.replace(verb, "")
                        )
                    );
                }
                if (l.indexOf("deleted:") == 0) {
                    this.get(mode).push(
                        Change.Delete(
                            l.replace(verb, "")
                        )
                    );
                }

                else if (mode == "untracked" && l.length) {
                    this.get(mode).push(l);
                }
            }
        }
    }
});

try {
	exports.ChangeType = ChangeType;
    exports.Change = Change;
    exports.ChangeTree = ChangeTree;
    exports.RepositoryStatus = RepositoryStatus;
}
catch(e) {}
