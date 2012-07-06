#! /bin/bash
find $1 | grep ".git$" | sed -e 's/.git$//g'