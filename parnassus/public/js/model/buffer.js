if (!Backbone) {
    var Backbone = require("backbone");
}

var BufferType = { 
    File:"File", 
    Command:"Command" 
};

var Buffer = Backbone.Model.extend({ 
    
});

Buffer.BufferType = BufferType;
