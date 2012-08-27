$(function() { 
    var 
        repoName = $("#repo-name").val(),

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


