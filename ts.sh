#!/bin/bash

function watch {
    echo "Watching for changes"
    tsc ./src/App.ts -out ./public/js/compiled.js --module amd --watch
}

function compile {
    echo "Compiling"
    tsc ./src/App.ts -out ./public/js/compiled.js --module amd
}

function serve {
    echo "Serving public"
    cd public
    python -m SimpleHTTPServer 3000
}

if [ $1 = "watch" ]; then watch; fi
if [ $1 = "compile" ]; then compile; fi
if [ $1 = "serve" ]; then serve; fi
