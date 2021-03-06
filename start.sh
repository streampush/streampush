#!/bin/bash

topDir=$(pwd)

if [ $# -eq 0 ]; then
    docker run -it -p 80:80 -p 1935:1935 -e DJANGO_SECRET='IamAdeveloperAndIhAveABadSecret' --mount source=streampush-data,target=/opt/streampush/data streampush
else
    if [ "$1" == "adduser" ]; then
        docker run -it --mount source=streampush-data,target=/opt/streampush/data streampush /bin/ash -c "cd /opt/streampush/app/streampush; export DJANGO_SETTINGS_MODULE=streampush.settings-prod; python3 manage.py migrate; python3 manage.py createsuperuser"
    elif [ "$1" == "build" ]; then
        cd ./app/streampush/frontend/static-src/streampush && \
            npm i && \
            npm run-script build

        cd $topDir

        docker build . -t streampush
    else
        echo "$1 is not a valid command."
    fi
fi
