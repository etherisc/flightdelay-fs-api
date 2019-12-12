#!/usr/bin/env bash

ssh $REMOTE "
    cd $HOST_DIR/releases; ls -t | sed -e '1,2d' | xargs -d '\n' rm -rf &&
    mkdir $HOST_DIR/releases/$BITBUCKET_COMMIT"
scp -r ./* $REMOTE:$HOST_DIR/releases/$BITBUCKET_COMMIT
ssh $REMOTE "
    cd $HOST_DIR/releases/$BITBUCKET_COMMIT &&
    cp $HOST_DIR/env/.env $HOST_DIR/releases/$BITBUCKET_COMMIT/.env &&
    npm ci &&
    npm run migrate &&
    ln -sfn $HOST_DIR/releases/$BITBUCKET_COMMIT $HOST_DIR/current &&
    cd $HOST_DIR; pm2 startOrGracefulReload current/$APP.json --env production --cwd $HOST_DIR/current"
