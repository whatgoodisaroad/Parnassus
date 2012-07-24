if (!Backbone) {
    var Backbone = require("backbone");
}

var IdeTab = Backbone.Model.extend({ 
    path:"",
    repository:"",

    editorFrameUrl:function() {
        return "/edit/" + 
            encodeURIComponent([ 
                "workspace",
                this.get("repository"),
                this.get("repository"),
                this.get("path")
            ].join("/"));
     },

    name:function() {
        var cs = this.get("path").split("/");
        return cs[cs.length - 1];
    }
});
