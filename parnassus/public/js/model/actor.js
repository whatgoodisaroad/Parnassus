var ActorMessage = Backbone.Model.extend({ 
    key:"none",
    meta:{ }
});

var Actor = Backbone.Model.extend({
    messages:new Backbone.Collection({ 
        model:ActorMessage 
    }),
    
    processors:{ },

    post:function(key, meta) {
        console.log("Request made: " + key, meta);

        this.messages.add(
            new ActorMessage({
                key:key,
                meta:meta
            })
        );

        var proc = this.processors[key];
        if (proc) {
            proc(meta);
        }
    },

    attach:function(key, fn) {
        this.processors[key] = fn;
    }
});
