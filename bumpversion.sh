#!/bin/bash

get_current_branch () {
    local CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    local EMPTY_STR=""
    local RELEASE_NAME=${CUR_BRANCH//release\//$EMPTY_STR}

    echo $RELEASE_NAME
}

store_version_to_file () {
    local VERSION=$(get_current_branch)

    echo "{ \"version\": \"$VERSION\" }" > ./src/version.json

    echo $VERSION
}

bump_version () {
    local VERSION=$(store_version_to_file)

    git config --global user.email "admin@etherisk.com"
    git config --global user.name "Bitbucket Pipeline"

    git add ./src/version.json && git commit -m "Bump version \"$VERSION\"" && git push
}

bump_version
exit 0
