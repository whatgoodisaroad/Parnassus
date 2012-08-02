$(function() { 
    var 
        repoName = $("#repoName").val(),

        rs = new RepositoryStatus({ 
            name:encodeURIComponent(repoName), 
            path:"workspace/" + encodeURIComponent(repoName)
        }),

        request = parent.App.request;

    function loadStatus() {
        rs.loadStatus(function() {
            var ct = new ChangeTree();
            ct.init(rs.changes());

            $(".changes").html(ct.asUl());

            $(".change").each(function() { 
                var $t = $(this);

                var open = function() {
                    request.post(
                        "openFile", { 
                            path:$t.data("path"), 
                            repo:repoName
                        }
                    );
                };

                $t.find(".filename").click(open);

                $("<div><a><span/><span class='caret'></span></a><ul/></div>")
                    .addClass("btn-group change-actions")
                    .find("a:first")
                        .addClass("btn dropdown-toggle btn-mini")
                        .attr({ "data-toggle":"dropdown", href:"#" })
                        .find("span:first")
                            .text($t.data("commitment"))
                            .end()
                        .end()
                    .find("ul")
                        .addClass("dropdown-menu pull-right")
                        .end()
                    .insertBefore($t.find(".clearfix"))

                $t.find(".dropdown-toggle").dropdown();

                $t.find("ul").append(
                    $("<li><a/></li>")
                        .find("a")
                            .text("Open")
                            .click(open)
                            .end()
                );


                if ($t.data("commitment") == "unstaged") {
                    $t.find("ul").append(
                        $("<li><a/></li>")
                            .find("a")
                                .text("Undo Changes (Checkout)")
                                .click(function(evt) {
                                    evt.preventDefault();
                                    request.post(
                                        "confirm", {
                                            title:"Undo changes?",
                                            message:"Undo changes to " + $t.data("path") + "?",
                                            yfn:function() {
                                                request.post(
                                                    "checkoutFile", {
                                                        path:$t.data("path"),
                                                        repo:repoName
                                                    }
                                                );
                                            }
                                        }
                                    );
                                    
                                })
                                .end()
                    );
                }
                
            });
        });
    }

    loadStatus();

    request.attach("refreshStatus", loadStatus);

    $(document)
        .on(
            "click", 
            ".folder-toggle", 
            function() {
                $(this)
                    .toggleClass("open")
                    .next()
                        .toggleClass("hidden");
            }
        );

    $("#addFile").click(function(evt) {
        evt.preventDefault();
        request.post(
            "showAddFileDialog",
            { repo:repoName }
        );
    });
});


