DIR=$PWD
TMP=$(mktemp -d)

cd $TMP

$DIR/bin/index.js \
    --name name \
    --homepage homepage \
    --projectVersion projectVersion \
    --license license \
    --prettier \
    --eslint \
    --jest \
    --fastCheck \
    --docsTs \
    --ghActions \
    --vscode \
    --markdownMagic
