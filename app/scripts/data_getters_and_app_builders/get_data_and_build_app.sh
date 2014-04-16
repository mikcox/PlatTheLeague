#!/bin/bash

python get_all_champs.py
grunt build
rm -rf /var/www/public_html/app
cp -r ../../dist /var/www/public_html/app
