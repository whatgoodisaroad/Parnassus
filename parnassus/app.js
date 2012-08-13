var 
    express = require("express"),
    routes = require("./routes"),
    json = require("./lib/parnassus/json"),
    files = require("./lib/parnassus/files"),

    app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(
        express.errorHandler({ 
            dumpExceptions:true, 
            showStack:true 
        })
    );
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.use(express.bodyParser());

// Routes

app.get('/',                    routes.index);

app.get("/edit/:path",          files.edit);

app.get("/json/workspaces",     json.ws);
app.get("/json/status/:path",   json.status);
app.get("/json/clone/:url",     json.clone);

app.get("/json/list/:repo",     json.list);

app.post("/json/checkout",      json.checkoutFile);
app.post("/json/reset",         json.resetFile);
app.post("/json/add",           json.addFile);
app.post("/json/save",          json.save);
app.post("/json/commit",        json.commit);




app.get("/status/:repo",        files.status);



app.listen(3000);
console.log(
    "Express server listening on port %d in %s mode", 
    app.address().port, 
    app.settings.env
);
