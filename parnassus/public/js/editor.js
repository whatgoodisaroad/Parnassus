$(function() { 
    var 
        JavaScriptMode = require("ace/mode/javascript").Mode,
        editor = ace.edit("main-edit"),
        request = parent.App.request,

        fullPath = $("#fullPath").val(),
        file = $("#file").val();

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode(new JavaScriptMode());

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
});
