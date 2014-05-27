#!/usr/bin/env bash

apt-get update
apt-get install -y python-software-properties=0.82.7.7
add-apt-repository ppa:chris-lea/node.js

apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list

apt-get update
apt-get install -y build-essential=11.5ubuntu2.1
apt-get install -y nodejs=0.10.28-1chl1~precise1

apt-get install -y mongodb-org=2.6.1
/etc/init.d/mongod start
