#! /bin/bash

echo "Compiling templates..."
clientjade ./views/templates/*.jade > ./public/js/templates.js

echo "Compiling parsers..."
pegjs --track-line-and-column peg/*.pegjs

echo "Running Parnassus..."
node ./app.js