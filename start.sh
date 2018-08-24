#!/bin/bash

if [ $# -eq 0 ]; then
    docker run -it -p 80:80 -p 1935:1935 --mount source=streampush-data,target=/opt/streampush/data streampush
else
    if [ "$1" == "adduser" ]; then
        docker run -it --mount source=streampush-data,target=/opt/streampush/data streampush /bin/bash -c "cd /opt/streampush/app/streampush; export DJANGO_SETTINGS_MODULE=streampush.settings-prod; python3 manage.py migrate; python3 manage.py createsuperuser"
    elif [ "$1" == "build" ]; then
        docker build . -t streampush
    else
        echo "$1 is not a valid command."
    fi
fi