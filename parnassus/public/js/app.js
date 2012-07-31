



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

                                jade.render(
                                    $w.find(".status")[0],
                                    "mini_status",
                                    { repo:ws }
                                );

                                // var msg = (
                                //     "The branch is " + 
                                //     ws.get("branch") + 
                                //     ". There are " + 
                                //     ws.get("staged").length + 
                                //     " staged changes. There are " + 
                                //     ws.get("unstaged").length + 
                                //     " unstaged changes. " + 
                                //     "There are " + 
                                //     ws.get("untracked").length + 
                                //     " untracked files"
                                // );

                                // $w.find(".status").text(msg);
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

            updateStatus(rs);

            $(".changeset ul li[data-path]").click(function() { 
                var item = this;

                router.navigate(
                    "workspace/" + rs.get("name") + "/" + $(item).data("path"), 
                    { trigger:true }
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
                            .click(function() {
                                var 
                                    a = $(this).parents("a"),
                                    li = a.parents("li");

                                App.confirm(
                                    "Close Tab", 
                                    "Close \"" + a.find("span:first").text() + "\"?", 
                                    function() { 
                                        if (li.is(".active")) {
                                            li.siblings(":first").find("a").trigger("click");
                                        }

                                        $(a.data("target")).remove();
                                        li.remove();

                                        if (!$("#ide-tabs li").length) {
                                            router.navigate(
                                                "workspace/" + name
                                            );
                                        }
                                    }
                                );
                            })
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



function updateStatus(rs) {
    var ct = new ChangeTree();

    ct.init(rs.stagedModify());
    $(".staged.modified").html(ct.asUl());

    ct.init(rs.unstagedModify());
    $(".unstaged.modified").html(ct.asUl());
}

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
        

        router:new Router(),
        request:new Actor(),


        init:function() {
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

                        $("#confirmModal").modal("hide");
                    })
                    .end()
                .find(".btn:not(.btn-primary)")
                    .click(function(evt) {
                        evt.preventDefault();
                        $(this).unbind();
                        if ($.isFunction(nfn)) {
                            nfn();
                        }

                        $("#confirmModal").modal("hide");
                    })
                    .end()
                .modal();
        },

        prompt:function(title, prompt, fn) {
            $("#promptModal")
                .find(".modal-header")
                    .text(title)
                    .end()
                .find(".modal-body label")
                    .html(prompt)
                    .end()
                .find(".btn-primary")
                    .click(function(evt) {
                        evt.preventDefault();
                        $(this).unbind();
                        if ($.isFunction(fn)) {
                            fn($("#promptResponse").val());
                        }
                        $("#promptModal").modal("hide")
                    })
                    .end()
                .modal();
        },

        modal:function(title, content) {
            $("#blankModal")
                .find(".modal-header")
                    .text(title)
                    .end()
                .find(".modal-body")
                    .html(content)
                    .end()
                .modal();
        },

        hideModal:function() {
            $("#blankModal").modal("hide");
        }
    };

    App.init();
    
    updateBreadcrumbs();

    $(".menu-git-clone")
        .click(function(evt) {
            evt.preventDefault();
            App.prompt(
                "Clone Repository", 
                "Enter the git URL of the repository to clone", 
                function(url) { 
                    App.modal(
                        "Cloning", 
                        $("<h2/><h3/><img/>")
                            .filter("h2")
                                .text("Cloning in progress...")
                                .end()
                            .filter("h3")
                                .text(url)
                                .end()
                            .filter("img")
                                .attr("src", "/img/spinner.gif")
                                .css("margin", "0 auto")
                                .end()
                    );

                    $.getJSON(
                        "/json/clone/" + encodeURIComponent(url),
                        function(result) {
                            if (!result.success) {
                                alert("Clone failed for some reason");
                            }

                            setTimeout(
                                function() {
                                    App.hideModal();

                                    App.router.navigate(
                                        "/",
                                        { trigger:true }
                                    );
                                },
                                700
                            );
                        }
                    );
                }
            );
        }
    );

    App.request.attach("openFile", function(data) {
        App.router.navigate(
            "workspace/" + data.repo + "/" + data.path,
            { trigger:true }
        );
    });

    App.request.attach("showAddFileDialog", function(data) {
        $.getJSON(
            "/json/list/" + data.repo, 
            function(result) {
                var ul = $("<ul/>");

                $.each(
                    result, 
                    function(idx, elem) {
                        $("<li><a/></li>")
                            .find("a")
                                .text(elem)
                                .attr("href", "#")
                                .attr("data-dismiss", "modal")
                                .click(function(evt) {
                                    evt.preventDefault();
                                    App.router.navigate(
                                        "workspace/" + data.repo + "/" + elem,
                                        { trigger:true }
                                    );
                                })
                                .end()
                            .appendTo(ul);
                    }
                );

                App.modal(
                    "Add file", 
                    ul
                );
            }
        );
    });

    App.request.attach("saveFile", function(data) {
        $.post(
            "/json/save", 
            data,
            function(res) {
                //alert(res.success ? "Successfully saved" : ("Failed to save") + res.msg);
                App.request.post("refreshStatus");
            },
            "json"
        )
    });



});