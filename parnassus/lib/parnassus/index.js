var 
    fs = require("fs"),
    cp = require("child_process"),
    repo = require("../../public/js/model/repository");

var root = process.cwd() + "/workspace";
// var root = process.platform == "darwin" ?
//     "/Users/allenwy/Dropbox/source" :
//     "/home/wyatt/Dropbox/source";

if (process.platform == "win32") {
    root = root.replace(/\//g, "\\");
}

exports.cloneNew = function(url, fn) {
    cp.execFile(
        "./clone.sh",
        [ url.match(/\/([^\/]+)\.git$/)[1], url ],
        fn
    );
};

exports.listWorkspaces = function(fn) {
    cp.execFile(
        "./find.sh",
        [ root ],
        function(err, stdout, stderr) {
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

exports.addFile = function(repo, path, fn) {
    cp.exec(
        "git add " + path,
        { cwd:"workspace/" + repo + "/" + repo },
        fn
    );
};

exports.commit = function(repo, msg, fn) {
    cp.exec(
        "git commit -m \"" + msg + "\"",
        { cwd:"workspace/" + repo + "/" + repo },
        fn
    );
}
