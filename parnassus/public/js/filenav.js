$(function() { 
    var 
        repoName = $("#repo-name").val(),

        rs = new RepositoryStatus({ 
            name:encodeURIComponent(repoName), 
            path:"workspace/" + encodeURIComponent(repoName)
        }),

        request = parent.App.request;

    function loadStatus() {
        $.getJSON("/json/status/" + repoName, function(status) {
            
            var 
                ft = new FileTree(),
                lists = [ "staged", "unstaged", "untracked" ],
                listName,
                changes,
                change;

            ft.init();

            $("#stage-files").html("");

            for (var lidx = 0; lidx < lists.length; ++lidx) {
                listName = lists[lidx];
                changes = status.changes[listName];

                for (var idx = 0; idx < changes.length; ++idx) {
                    change = changes[idx];
                    change.commitment = listName;

                    var split = change.path.split("/");
                    change.name = split[split.length - 1];

                    ft.setFileByPath(
                        change.path,
                        change
                    );
                }
            }

            jade.render(
                $("#stage-files")[0],
                "filetree_status",
                { root:ft.root, closeAll:false }
            );

            $("#stage-files .dropdown-toggle").dropdown();

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

    $("#openFileButton").on("click", function() {
        $.getJSON(
            "/json/list/" + data.repo, 
            function(files) {
                
                var ft = new FileTree();
                for (var idx = 0; idx < files.length; ++idx) {
                    ft.setFileByPath(
                        files[idx],
                        "<a href=\"" 
                            + [ "#workspace", data.repo, files[idx] ].join("/") 
                            + "\">" 
                            + files[idx] 
                            + "</a>"
                    );
                }

                
            }
        );
    });

});






