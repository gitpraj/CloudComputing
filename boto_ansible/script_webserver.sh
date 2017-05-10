#Created by COMP90024 Assignment 2 CCC Team 8, Semester 1 2017
#!/bin/bash
# setup environment
sudo apt-get update

# git setup
sudo apt-get install git
sudo apt install npm
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install nodejs-legacy
git clone https://github.com/gitpraj/CloudComputing.git
cd /home/ubuntu/CloudComputing/front-end
npm install
npm install cradle
sudo node app.js
