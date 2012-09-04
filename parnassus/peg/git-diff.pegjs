start = diff+


diff =
    head:diffHead 
    images:images
    line 
    line
    hunks:hunk+ { 
        return { 
            head:head,
            images:images,
            hunks:hunks
        }; 
    }


diffHead = 
    "diff --git " 
    fromFile:file 
    tsep
    toFile:file 
    lend { 
        return { 
            fromFile:fromFile,
            toFile:toFile
        }; 
    }

images =
    "index "
    preImage:hash
    ".."
    postImage:hash
    tsep
    mode:mode
    lend { 
        return {
            preImage:preImage,
            postImage:postImage,
            mode:mode
        };
    }

hunk = 
    head:hunkHead 
    segments:hunkSegment+ { 
        return { head:head, segments:segments }; 
    }

hunkHead = 
    "@@ -"
    from:hunkPos
    " +"
    to:hunkPos
    " @@"
    lend? {
        return {
            from:from,
            to:to
        };
    }
    
hunkPos =
    start:uint
    ","
    len:uint {
        return {
            start:start,
            len:len
        };
    }

hunkSegment = 
      anchorLines
    / addLines
    / removeLines
    / newlineMsg

anchorLines = 
    ls:anchorLine+ { 
        return { 
            type:"anchor", 
            lines:ls 
        }; 
    }

addLines =
    ls:addLine+ {
        return {
            type:"add",
            lines:ls
        };
    }

removeLines = 
    ls:removeLine+ {
        return {
            type:"remove",
            lines:ls
        };
    }

anchorLine = 
    " " l:line { return l; }

addLine = 
    "+" l:line { return l; }

removeLine = 
    "-" l:line { return l; }

newlineMsg = 
    "\\ No newline at end of file" 
    lend { 
        return "newline message";
    }

hash = 
    h:[0-9a-f]+ { 
        return h.join(""); 
    }

file = 
    path:[^ \n]+ { 
        return path.join(""); 
    }

mode = 
    m:[0-9]+ { 
        return m.join(""); 
    }


uint = cs:[0-9]+ { return parseInt(cs.join(""), 10); }

lend = "\n"
tsep = " "
line = l:[^\n]* "\n" { return l.join(""); }