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

        var procs = this.processors[key];
        if (procs) {
            for (var idx = 0; idx < procs.length; ++idx) {
                procs[idx](meta);
            }
        }
    },

    attach:function(key, fn) {
        if (!this.processors[key]) {
            this.processors[key] = [];
        }

        this.processors[key].push(fn);
    }
});
