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