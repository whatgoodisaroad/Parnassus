

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
        "workspace":"workspace",
        "workspace/:name":"openWorkspace",
        "workspace/:name/*file":"openFile"
    },
    
    index:function() {
        this.navigate(
            "workspace", 
            { trigger:true }
        );
    },
    
    workspace:function() {
        var 
            ws = new WorkspaceList(),
            router = this;

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

                $("ul.workspaces li")
                    .click(function() {
                        router.navigate(
                            "workspace/" + $("h1", this).text(), 
                            { trigger:true }
                        );
                    })
                    .each(function(idx, w) {
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

    openWorkspace:function(name, cont) {
        //var path = "/Users/allenwy/Dropbox/source/web/parnassus/";
        //var path = "/home/wyatt/Dropbox/source/web/parnassus/";
        var path = "workspace/" + name;

        var router = this;

        var rs = new RepositoryStatus({ name:name, path:path });
        rs.loadStatus(function() {

            var tabs = new Backbone.Collection({ model:IdeTab });
            
            $("body")
                .removeClassLike("route")
                .addClass("route-edit");

            jade.render(
                $("#main")[0],
                "workspace", { 
                    root:rs.get("path"),
                    name:name, 
                    repo:rs,
                    unstaged:{
                        modified:[],
                        deleted:rs
                            .get("unstaged")
                            .filter(function(elem) { 
                                return elem.get("changeType") == ChangeType.Delete;
                            })
                    }
                }
            );

            var ct = new ChangeTree();

            ct.init(rs.stagedModify());
            $(".staged.modified").html(ct.asUl());

            ct.init(rs.unstagedModify());
            $(".unstaged.modified").html(ct.asUl());

            $(".changeset ul li[data-path]").click(function() { 
                var item = this;

                App.confirm(
                    "Stage?", 
                    "Do you want to stage the file before editing?", 
                    function() {
                        router.navigate(
                            "workspace/" + rs.get("name") + "/" + $(item).data("path"), 
                            { trigger:true }
                        );
                    }
                );
            });

            $(".folder-toggle").click(function() {
                $(this)
                    .toggleClass("open")
                    .next()
                        .toggleClass("hidden");
            });

            $("#addFileButton").click(function() {
                App.confirm("Add File", "Add a file");
            });

            if ($.isFunction(cont)) { cont(); }
        });
    },

    openFile:function(name, file) {
        var router = this;

        if (!$("body").is(".route-edit")) {
            this.openWorkspace(name, cont);
        }
        else {
            cont();
        }

        function cont() {

            var 
                maybeTab = $("#ide-tabs li a[data-path='" + file + "']"),
                fileOpen = $.trim(file).length && maybeTab.length;

            if (fileOpen) {
                maybeTab.tab("show");
            }

            else {
                var tab = new IdeTab({
                    path:file,
                    repository:name
                });

                var displayTab = $("<li><a><span/><span/></li>")
                    .find("a")
                        .attr({ 
                            "data-target":"#ide-tab-" + tab.cid, 
                            "data-toggle":"tab",
                            "data-path":tab.get("path")
                        })
                        .click(function(evt) {
                            evt.preventDefault();
                            router.navigate(
                                "workspace/" + name + "/" + tab.get("path")
                            );
                        })
                        .find("span:first")
                            .text(tab.name())
                            .end()
                        .find("span:last")
                            .addClass("icon-remove")
                            .end()
                        .end()
                    .prependTo("#ide-tabs")

                $("<div/>")
                    .text(tab.name())
                    .attr("id", "ide-tab-" + tab.cid)
                    .appendTo("#tab-content");

                jade.render(
                    $("#ide-tab-" + tab.cid)[0],
                    "ide_tab",
                    { src:tab.editorFrameUrl() }
                );

                displayTab.find("a").tab("show");
            }
        }
    }
});

function updateBreadcrumbs() {
    setTimeout(
        function() {
            var 
                components = location.hash
                    .replace("#", "")
                    .replace(/^\//, "")
                    .split("/"),
                sub = "#",
                crumbs = [ { text:"home", link:"/" } ];

            for (var idx = 0; idx < components.length; ++idx) {
                sub += "/" + components[idx];
                crumbs.push({
                    text:components[idx],
                    link:sub
                });
            }

            $(".breadcrumbs").html("");
            $.each(crumbs, function() {
                $("<a/>")
                    .text(this.text)
                    .attr("href", this.link)
                    .appendTo(".breadcrumbs");
            });
            
        }, 
        100
    );
};

$(window).on("hashchange", updateBreadcrumbs);

var App;

$(function() {
    $('.dropdown-toggle').dropdown();

    App = {
        Views:{},
        Controllers:{},
        init:function() {
            new Router();
            Backbone.history.start();
        },

        confirm:function(title, msg, yfn, nfn) {
            $("#confirmModal")  
                .find(".modal-header")
                    .text(title)
                    .end()
                .find(".modal-body")
                    .html(msg)
                    .end()
                .find(".btn-primary")
                    .click(function(evt) {
                        evt.preventDefault();
                        $(this).unbind();
                        if ($.isFunction(yfn)) {
                            yfn();
                        }
                    })
                    .end()
                .find(".btn:not(.btn-primary)")
                    .click(function(evt) {
                        evt.preventDefault();
                        $(this).unbind();
                        if ($.isFunction(nfn)) {
                            nfn();
                        }
                    })
                    .end()
                .modal();
        }
    };

    App.init();
    
    updateBreadcrumbs();
});