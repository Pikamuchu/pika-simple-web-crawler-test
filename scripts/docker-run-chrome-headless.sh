#!/bin/bash
echo "*********** Starting chrome in headless mode ***********"
echo "*"

docker run -d -p 9222:9222 justinribeiro/chrome-headless
