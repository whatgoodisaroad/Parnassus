var 
    fs = require("fs"), 
    path = require("path");

exports.edit = function(req, res) {
    var fullPath = process.cwd() + "/" + req.params.path;

    var r = function(body) {
        res.render(
            "editor", { 
                layout:false, 
                body:body, 
                path:fullPath,
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
        "status", 
        { layout:false, repo:req.params.repo }
    );
};

