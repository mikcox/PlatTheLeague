#!/bin/bash

cd /home/mico2178/git_projects/PlatTheLeague/app/scripts/data_getters_and_app_builders
python get_all_champs.py
grunt build
rm -rf /home/mico2178/public_html/app/*
cp -r ../../../dist/* /home/mico2178/public_html/app
