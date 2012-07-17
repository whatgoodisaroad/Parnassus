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

    path.exists(
        req.params.path, 
        function(exists) {
            if (exists) {
                fs.readFile(
                    req.params.path, 
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
