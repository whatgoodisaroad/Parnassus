var 
    parnassus = require("./"),
    cp = require("child_process");

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

exports.resetFile = function(req, res) {

};

exports.list = function(req, res) {
    var 
        repo = req.params.repo,
        path = "workspace/" + repo + "/" + repo;

    cp.exec(
        "find . | grep -v '.git' | sed s/.\\\\///",
        { cwd:path },
        function(error, stdout, stderr) {
            res.end(
            	JSON.stringify(
            		stdout.split("\n")
            	)
        	);
        }
    );
}

exports.save = function(req, res) {
    var 
        file = req.params.path,
        data = req.params.body;

    console.log(file);

    res.end();
};



