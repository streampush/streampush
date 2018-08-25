#!/bin/ash

/usr/sbin/nginx
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start nginx: $status"
  exit $status
fi
echo "started nginx"

/usr/bin/redis-server &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start redis-server: $status"
  exit $status
fi
echo "started redis-server"

cd /opt/streampush/app/streampush

export DJANGO_SETTINGS_MODULE=streampush.settings-prod
python3 manage.py migrate

# python3 /opt/streampush/app/streampush/manage.py runserver &
daphne -b 0.0.0.0 -p 8000 --proxy-headers streampush.asgi:application &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start Streampush: $status"
  exit $status
fi

cd /opt/streampush/relay/ && /usr/bin/relay
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start relay: $status"
  exit $status
fi
echo "started relay"

echo "started streampush"

while sleep 60; do
  ps aux |grep nginx |grep -q -v grep
  NGINX_STATUS=$?
  ps aux |grep daphne |grep -q -v grep
  DAPHNE_STATUS=$?
  ps aux |grep redis-server |grep -q -v grep
  REDIS_STATUS=$?
  ps aux |grep relay |grep -q -v grep
  RELAY_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $NGINX_STATUS -ne 0 -o $DAPHNE_STATUS -ne 0 -o $REDIS_STATUS -ne 0 -o $RELAY_STATUS -ne 0 ]; then
    echo "Something died."
    exit 1
  fi
done