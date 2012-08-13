if (!Backbone) {
    var Backbone = require("backbone");
}


var FileTree = Backbone.Model.extend({
    root:{
        children:{ },
        leaves:{ }
    },

    init:function() {
        this.root = {
            children:{ },
            leaves:{ }
        };
    },

    setFileByPath:function(path, file) {
        def_rec(
            this.root,
            path.replace(/^\//, "").split("/"),
            file
        );
        
        function def_rec(obj, props, val) {
            if (props.length - 1) {
                if (obj.children[props[0]] == undefined) {
                    obj.children[props[0]] = {
                        children:{ },
                        leaves:{ },
                        weight:0
                    };
                }

                ++obj.children[props[0]].weight;

                def_rec(
                    obj.children[props[0]],
                    props.slice(1),
                    val
                );
            }
            else {
                obj.leaves[props[0]] = val;
            }
        }
    },

    getFileByPath:function(path) {
        return get_rec(
            this.root,
            path.replace(/^\//, "").split("/")
        );

        function get_rec(obj, props) {
            if (!obj) { return null; }

            if (props.length - 1) {
                return get_rec(
                    obj.children[props[0]],
                    props.slice(1)
                );
            }
            else {
                return obj.leaves[props[0]];
            }
        }
    }
});
