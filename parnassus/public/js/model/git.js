// A command factory and parser for git.

var 
    Backbone = require("backbone"),
    cp = require("child_process"),
    gitStatusParser = require("../../../peg/git-status").parse,
    gitDiffParser = require("../../../peg/git-diff").parse;



var Git = exports.Git = Backbone.Model.extend({
    name:"",
    updateStatus:function(fn) {
        var 
            self = this,
            name = this.get("name");

        cp.exec(
            "git status",
            { cwd:"workspace/" + name + "/" + name },
            function(error, stdout, stderr) {

                var result = gitStatusParser(stdout);

                self.set(result);
                
                if (fn) { fn(); }
            }
        );
    },

    updateDiff:function(fn) {
        var 
            self = this,
            name = this.get("name");

        cp.exec(
            "git diff",
            { cwd:"workspace/" + name + "/" + name },
            function(error, stdout, stderr) {

                var result = gitDiffParser(stdout);

                for (var didx = 0; didx < result.length; ++didx) {
                    for (var hidx = 0; hidx < result[didx].hunks.length; ++hidx) {
                        annotateSegments(
                            result[didx].hunks[hidx]
                        );
                    }
                }

                self.set("diff", result);
                
                if (fn) { fn(); }
            }
        );
    },

    diffAdditionLines:function(file, fn) {
        var self = this;

        self.updateDiff(function() {
            var 
                result = [],
                diff,
                hunk,
                segment;

            for (var didx = 0; didx < self.get("diff").length; ++didx) {
                diff = self.get("diff")[didx];
                
                if (diff.head.toFile.replace(/^[a-z]\//, "") == file) {

                    for (var hidx = 0; hidx < diff.hunks.length; ++hidx) {
                        hunk = diff.hunks[hidx];

                        for (var sidx = 0; sidx < hunk.segments.length; ++sidx) {
                            segment = hunk.segments[sidx];

                            if (segment.type == "add") {
                                for (
                                    var lidx = segment.start;
                                    lidx < segment.lines.length + segment.start; 
                                    ++lidx
                                ) {
                                    result.push(lidx);
                                }
                            }
                        }
                    }

                    break;
                }
            }

            fn(result);
        });
    }

});

function annotateSegments(hunk) {
    var
        fromCtr = hunk.head.from.start,
        toCtr = hunk.head.to.start,
        segment;

    for (var idx = 0; idx < hunk.segments.length; ++idx) {
        segment = hunk.segments[idx];

        if (segment.type == "add") {
            segment.start = toCtr;
            toCtr += segment.lines.length;
        }
        else if (segment.type = "remove") {
            segment.start = fromCtr;
            fromCtr += segment.lines.length;
        }
    }
}









