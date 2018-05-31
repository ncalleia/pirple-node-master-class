#!/bin/bash
# bash generateSSL.sh
# Common Name: localhost

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem