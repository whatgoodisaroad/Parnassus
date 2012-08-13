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
            
            var 
                ft = new FileTree(),
                changes = rs.changes(),
                change;

            ft.init();

            $(".changes").html("");

            for (var idx = 0; idx < changes.length; ++idx) {
                change = changes[idx];

                ft.setFileByPath(
                    change.get("path"),
                    change
                );
            }

            jade.render(
                $(".changes")[0],
                "filetree_status",
                { root:ft.root, closeAll:false }
            );

            $(".changes .dropdown-toggle").dropdown();
        });
    }

    loadStatus();
    request.attach("refreshStatus", loadStatus);

    // Dropdown links:
    $(document).on("click", ".filename, .open-link", function(evt) {
        evt.preventDefault();

        var path = $(evt.target)
            .parents(".change:first")
            .data("path");

        request.post(
            "openFile", 
            { path:path, repo:repoName }
        );
    });

    $(document).on("click", ".undo-link", function(evt) {
        evt.preventDefault();

        var path = $(evt.target)
            .parents(".change:first")
            .data("path");

        request.post(
            "confirm", {
                title:"Undo changes?",
                message:"Undo changes to " + path + "?",
                yfn:function() {
                    request.post(
                        "checkoutFile", 
                        { path:path, repo:repoName }
                    );
                }
            }
        );
    });

    $(document).on("click", ".stage-link", function(evt) {
        evt.preventDefault();

        var path = $(evt.target)
            .parents(".change:first")
            .data("path");

        request.post(
            "confirm", {
                title:"Stage changes?",
                message:"Stage changes in " + path + "?",
                yfn:function() {
                    request.post(
                        "addFile", 
                        { path:path, repo:repoName }
                    );
                }
            }
        );
    });

    $(document).on("click", ".unstage-link", function(evt) {
        evt.preventDefault();

        var path = $(evt.target)
            .parents(".change:first")
            .data("path");

        request.post(
            "confirm", {
                title:"Unstage changes?",
                message:"Unstage changes to " + path + "?",
                yfn:function() {
                    request.post(
                        "resetFile", 
                        { path:path, repo:repoName }
                    );
                }
            }
        );
    });







    $("#addFile").click(function(evt) {
        evt.preventDefault();
        request.post(
            "showAddFileDialog",
            { repo:repoName }
        );
    });

    $("#commit").click(function(evt) {
        evt.preventDefault();
        request.post(
            "commit",
            { repo:repoName }
        );
    });
});


