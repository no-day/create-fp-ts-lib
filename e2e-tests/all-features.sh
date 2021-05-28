DIR=$($PWD)
TMP=$(mktemp -d)

cd $TMP

./$DIR/bin/index.js \
    --name
--
