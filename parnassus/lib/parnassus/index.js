var 
    fs = require("fs"),
    cp = require("child_process"),
    repo = require("../../public/js/model/repository");

//var root = process.cwd() + "/../../..";
var root = process.platform == "darwin" ?
    "/Users/allenwy/Dropbox/source" :
    "/home/wyatt/Dropbox/source";

if (process.platform == "win32") {
    root = root.replace(/\//g, "\\");
}

exports.listWorkspaces = function(fn) {
    cp.execFile(
        "./find.sh",
        [ root ],
        function (err, stdout, stderr) {
            fn(
                stdout
                    .replace(/\n\s*$/m, "")
                    .split("\n")
                    .map(function(path) {
                        var name = path.replace(/.+\/(.+)\/$/, "$1")

                        return new repo.RepositoryStatus({
                            id:name,
                            name:name,
                            path:path
                        });
                    })
            )
        }
    );
}

exports.workspaceStatus = function(path, fn) {
    cp.exec(
        "git status",
        { cwd:path },
        function (error, stdout, stderr) {
            fn(stdout);
        }
    );
}
