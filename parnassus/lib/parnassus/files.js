var 
    fs = require("fs"), 
    path = require("path");

exports.edit = function(req, res) {
    var 
        fullPath = process.cwd() + "/" + req.params.path,
        matches = req.params.path.match(/workspace\/([^\/]+)\/[^\/]+\/(.+)$/),

        repo = matches[1],
        relativeFile = matches[2];

    var r = function(body) {
        res.render(
            "editor", { 
                layout:false, 
                body:body, 
                path:fullPath,
                
                repo:repo,
                relativeFile:relativeFile,
                
                file:req.params.path
            }
        );
    };

    path.exists(
        fullPath, 
        function(exists) {
            if (exists) {
                fs.readFile(
                    fullPath, 
                    function (err, data) {
                        if (err) {
                            r(err);
                        }
                        else {
                            r(data);
                        }
                    }
                );
            }
            else {
                r("404: File (to edit) not found");
            }
        }
    );
};

exports.status = function(req, res) {
    res.render(
        "filenav", 
        { layout:false, repo:req.params.repo }
    );
};

