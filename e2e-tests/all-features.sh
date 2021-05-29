DIR=$($PWD)
TMP=$(mktemp -d)

cd $TMP

./$DIR/bin/index.js \
    --name name \
    --homepage homepage \
    --version version \
    --license license \
    --prettier \
    --eslint \
    --jest \
    --fastCheck \
    --docsTs \
    --ghActions \
    --vscode \
    --markdownMagic
