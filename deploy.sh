#!/bin/bash

npm run build

tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./build/*

caprover deploy -t ./deploy.tar