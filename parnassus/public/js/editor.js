$(function() { 
    var 
        JavaScriptMode = require("ace/mode/javascript").Mode,
        editor = ace.edit("main-edit"),
        session = editor.getSession(),

        request = parent.App.request,

        fullPath = $("#fullPath").val(),
        file = $("#file").val(),

        repo = $("#repo").val(),
        relative = $("#relative").val();

    editor.setTheme("ace/theme/twilight");
    session.setMode(new JavaScriptMode());

    parent.session = session;

    request.attach("gutter", function(data) {
        editor.getSession().setAnnotations([{
            row:10,
            column:7,
            text:"WTF",
            type:"warning",
            lint:" e"
        }]);
    });

    function save() {
        request.post(
            "saveFile", { 
                path:fullPath,
                body:editor.getSession().getValue()
            }
        );
    }

    shortcut.add("Ctrl+S", save);

    request.attach("fileChanged", function(data) {
        if ([ "workspace", data.repo, data.repo, data.path ].join("/") == file) {
            request.post(
                "confirm", {
                    title:"Reload?",
                    message:data.path + " has changed. Do you want to reload it?",
                    yfn:function() {
                        location.reload();
                    }
                }
            );
        }
    });

    function updateAdditionLines() {
        $.getJSON(
            "/json/diffAdditionLines/" +
                encodeURIComponent(repo) + "/" +
                encodeURIComponent(relative),
            function(lines) {
                for (var idx = 0; idx < lines.length; ++idx) {
                    session.addGutterDecoration(
                        lines[idx],
                        "git-diff-addition"
                    );
                }
            }
        );
    }
    updateAdditionLines();


});
