#! /bin/bash
clientjade ./views/templates/*.jade > ./public/js/templates.js
node ./app.js