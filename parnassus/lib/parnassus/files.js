var 
    fs = require("fs"), 
    path = require("path");

exports.edit = function(req, res) {
    var r = function(body) {
        res.render(
            "editor", 
            { layout:false, body:body }
        );
    };

    var fullPath = process.cwd() + "/" + req.params.path;

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
