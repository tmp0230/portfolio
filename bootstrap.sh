#!/usr/bin/env bash

apt-get update
apt-get install -y python-software-properties=0.82.7.7
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs=0.10.28-1chl1~precise1
apt-get install -y npm=1.1.4~dfsg-1

npm config set registry http://registry.npmjs.org/
