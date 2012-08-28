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

        return;



        rs.loadStatus(function() {
            
            var 
                ft = new FileTree(),
                changes = rs.changes(),
                change;

            ft.init();

            $("#stage-files").html("");

            for (var idx = 0; idx < changes.length; ++idx) {
                change = changes[idx];

                ft.setFileByPath(
                    change.get("path"),
                    change
                );
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

});


