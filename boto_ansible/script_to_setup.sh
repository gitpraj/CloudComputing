#Created by COMP90024 Assignment 2 CCC Team 8, Semester 1 2017
# script to set up the system

python create_key.py
python create_vms.py

ansible_playbook ansible_web_server.yml
