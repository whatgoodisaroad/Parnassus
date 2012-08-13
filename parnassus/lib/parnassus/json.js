var 
    parnassus = require("./"),
    cp = require("child_process"),
    fs = require("fs");

function gitVerbOnFile(verb, repo, path, res) {
    cp.exec(
        [ "git", verb, path ].join(" "),
        { cwd:[ "workspace", repo, repo ].join("/") },
        function(err, stdout, stderr) {
            res.end(JSON.stringify({
                success:!err,
                msg:err
            }));
        }
    );
}

exports.ws = function(req, res) {
	res.writeHead(200, { "Content-Type":"application/json" });
    parnassus.listWorkspaces(
		function(files) {
	        res.end(
	        	JSON.stringify(
	        		files
	    		)
			);
	    }
    );
};

exports.status = function(req, res) {
	parnassus.workspaceStatus(
		req.params.path,
		function(status) {
			res.end(
				JSON.stringify(
					status
				)
			);
		}
	);
};


exports.clone = function(req, res) {
	parnassus.cloneNew(
		req.params.url,
		function(err, stdout, stderr) {
			res.end(
				JSON.stringify({
					success:!err,
					stdout:stdout,
					stderr:stderr
				})
			);
		}
	);
};

exports.addFile = function(req, res) {
	parnassus.addFile(
		req.params.repo,
		req.params.path,
		function(err, stdout, stderr) {
			res.end(
				JSON.stringify({
					success:!err,
					stdout:stdout,
					stderr:stderr
				})
			);
		}
	);
};

exports.checkoutFile = function(req, res) {
    gitVerbOnFile(
        "checkout", 
        req.body.repo, 
        req.body.file, 
        res
    );
};

exports.addFile = function(req, res) {
    gitVerbOnFile(
        "add", 
        req.body.repo, 
        req.body.file, 
        res
    );
};

exports.resetFile = function(req, res) { 
    gitVerbOnFile(
        "reset", 
        req.body.repo, 
        req.body.path, 
        res
    );
};

exports.list = function(req, res) {
    var 
        repo = req.params.repo,
        path = "workspace/" + repo + "/" + repo;

    cp.exec(
        "find . -type f | grep -v '.git' | sed s/.\\\\///",
        { cwd:path },
        function(error, stdout, stderr) {
            res.end(
            	JSON.stringify(
            		stdout.replace(/\n$/m, "").split("\n")
            	)
        	);
        }
    );
}

exports.save = function(req, res) {
    var 
        file = req.body.path,
        data = req.body.body;

    fs.writeFile(
        file, 
        data, 
        function(err) {
            res.end(
                JSON.stringify({ 
                    success:!err,
                    msg:err
                })
            );
        }
    );
};

exports.commit = function(req, res) {
    var
        repo = req.body.repo,
        msg = req.body.message;

    parnassus.commit(
        repo,
        msg,
        function(err) {
            res.end(
                JSON.stringify({ 
                    success:!err,
                    msg:err
                })
            );
        }
    );
};

