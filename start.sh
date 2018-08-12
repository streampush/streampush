#!/bin/bash

docker run -it -p 80:80 -p 1935:1935 --mount source=streampush-data,target=/opt/streampush/data streampush