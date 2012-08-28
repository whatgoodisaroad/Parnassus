start = 
    branch:branch 
    changes:body
    fileEnd { 
        return { 
            branch:branch,
            changes:changes
        }; 
    }

body = 
    nothing { return { }; } / 
    staged:staged?
    unstaged:unstaged?
    untracked:untracked? {
        return {
            staged:staged,
            unstaged:unstaged,
            untracked:untracked
        };
    }

nothing = 
    "nothing to commit (working directory clean)" .+

branch = 
    lineStart 
    "On branch " 
    branch:[^\n]+ 
    lineEnd { 
        return branch.join(""); 
    }

staged = 
    stagedHeader 
    files:stagedFile+
    listSep { 
        return files; 
    }
stagedHeader = 
    lineStart 
    "Changes to be committed:" 
    lineEnd 
    parenthesis 
    listSep
stagedFile = 
    modifiedFile / 
    newFile / 
    deletedFile / 
    renamedFile

unstaged = 
    unstagedHeader 
    files:unstagedFile+ 
    listSep { 
        return files; 
    }
unstagedHeader = 
    lineStart 
    "Changes not staged for commit:" 
    lineEnd 
    parenthesis 
    parenthesis 
    listSep
unstagedFile = 
    modifiedFile / 
    newFile / 
    deletedFile / 
    renamedFile

untracked = 
    untrackedHeader 
    files:untrackedFile+ 
    listSep { 
        return files; 
    }
untrackedHeader = 
    lineStart 
    "Untracked files:" 
    lineEnd 
    parenthesis 
    listSep

untrackedFile = 
    lineStart 
    spaces
    file:[^\n]+ 
    lineEnd { 
        return { 
            type:"untracked", 
            file:file.join("") 
        }; 
    }
modifiedFile = 
    lineStart 
    spaces
    "modified:" 
    spaces
    file:[^\n]+ 
    lineEnd { 
        return { 
            type:"modified", 
            file:file.join("") 
        }; 
    }
newFile = 
    lineStart 
    spaces
    "new file:" 
    spaces
    file:[^\n]+ 
    lineEnd { 
        return { 
            type:"new", 
            file:file.join("") 
        }; 
    }
deletedFile = 
    lineStart 
    spaces
    "deleted:" 
    spaces
    file:[^\n]+ 
    lineEnd { 
        return { 
            type:"deleted", 
            file:file.join("") 
        }; 
    }
renamedFile = 
    lineStart 
    spaces
    "renamed:" 
    spaces
    oldName:[^ ]+ 
    " -> " 
    newName:[^\n]+ 
    lineEnd { 
        return { 
            type:"rename", 
            oldName:oldName.join(""), 
            newName:newName.join("") 
        }; 
    }

spaces = [ \t]+
parenthesis = 
    lineStart 
    spaces
    "(" 
    [^)]+ 
    ")" 
    lineEnd
listSep = lineStart lineEnd
lineStart = "#" " "?
lineEnd = "\n"
fileEnd = .*
