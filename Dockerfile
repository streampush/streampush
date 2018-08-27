FROM nginx:alpine

# Make link to code directory
RUN mkdir -p /opt/streampush
RUN mkdir -p /opt/streampush/app
RUN mkdir -p /opt/streampush/relay
RUN mkdir -p /opt/streampush/data
VOLUME /opt/streampush/data

# Install pip
RUN apk add --update python3 redis curl alpine-sdk postgresql-libs python3-dev

# Copy over requirements.txt
COPY app/requirements.txt /opt/streampush/app/requirements.txt

# Install requirements
RUN apk update && \
    apk add --virtual .build-deps gcc musl-dev postgresql-dev go && \
    pip3 install -r /opt/streampush/app/requirements.txt && \
    go get -u github.com/streampush/relay && cp /root/go/bin/relay /usr/bin/relay && \
    apk --purge del .build-deps

# Copy streampush configs
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Move over the app code
COPY app /opt/streampush/app

# Setup the supervisor script
COPY docker/supervisor.sh /opt/streampush/supervisor.sh
RUN chmod +x /opt/streampush/supervisor.sh

EXPOSE 80
EXPOSE 443
EXPOSE 1935
CMD ["/opt/streampush/supervisor.sh"]