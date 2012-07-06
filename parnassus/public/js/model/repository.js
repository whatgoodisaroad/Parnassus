if (!Backbone) {
    var Backbone = require("backbone");
}

var ChangeType = {
    Rename:"Rename",
    Modify:"Modify",
    Delete:"Delete"
};

var Change = Backbone.Model.extend({ });

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
    exports.RepositoryStatus = RepositoryStatus;
}
catch(e) {}
