

var Workspace = Backbone.Model.extend({ });

var WorkspaceList = Backbone.Collection.extend({ 
    url:"/json/workspaces"
});

$.fn.removeClassLike = function(sub) {
    return this
        .removeClass(function(idx, classes) {
            return classes
                .replace(
                    new RegExp(
                        "\b" + sub + "-(\S)+\b", 
                        "g"
                    ),
                    ""
                )
                .replace(/\s+/g, " ");
        });
};

var Router = Backbone.Router.extend({
    routes:{
        "":"index",
        "edit":"edit",
        "workspace":"workspace"
    },
    
    index:function() {
        this.navigate(
            "workspace", 
            { trigger:true }
        );
    },
    
    workspace:function() {
        var ws = new WorkspaceList();
        ws.fetch({ 
            success:function() {
                $("body")
                    .removeClassLike("route")
                    .addClass("route-index");

                jade.render(
                    $("#main")[0],
                    "workspaces",
                    { workspaces:ws.toArray() }
                );

                $("ul.workspaces li").each(function(idx, w) {
                     var $w = $(w);
                     $.getJSON(
                         "/json/status/" + 
                            encodeURIComponent(
                                $w.attr("data-path")
                            ), 
                         function(status) {
                            var ws = new RepositoryStatus();
                            ws.parseStatus(status);

                            var msg = (
                                "The branch is " + 
                                ws.get("branch") + 
                                ". There are " + 
                                ws.get("staged").length + 
                                " staged changes. There are " + 
                                ws.get("unstaged").length + 
                                " unstaged changes" + 
                                "There are " + 
                                ws.get("untracked").length + 
                                " untracked files"
                            );

                            $w.find(".status").text(msg);
                         }
                     );
                });

                $("<div/>")
                    .addClass("clearfix")
                    .appendTo("#main");

                $(".main-topbar .btn.view-control").on(
                    "click",
                    function(evt) {
                        var t = $(this);
                        if (t.find(".icon-list-ul").length) {
                            $("#main")
                                .removeClassLike("view-list")
                                .addClass("view-list-ul");
                        }
                        else if (t.find(".icon-th").length) {
                            $("#main")
                                .removeClassLike("view-list")
                                .addClass("view-list-th");
                        }

                        $(".main-topbar .btn.view-control").removeClass("active");
                        t.addClass("active");


                    }
                );
            }
        });
    },

    edit:function(id) { },
});


$(function() {
    $('.dropdown-toggle').dropdown();
    
    //var editor = ace.edit("editor");

    


    var App = {
        Views: {},
        Controllers: {},
        init: function() {
            new Router();
            Backbone.history.start();
        }  
    };

    App.init();


    

});