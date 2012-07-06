var 
    parnassus = require("./");

exports.ws = function(req, res) {
	res.writeHead(200, {"Content-Type": "application/json"});
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