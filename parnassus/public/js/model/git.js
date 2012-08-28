// A command factory and parser for git.

var 
    Backbone = require("backbone"),
    cp = require("child_process"),
    gitStatusParser = require("../../../peg/git-status").parse;

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
    }
});

