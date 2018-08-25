FROM nginx:alpine

# Install pip
RUN apk add --update python3 redis curl alpine-sdk postgresql-libs python3-dev go
# RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
# RUN python3 get-pip.py

# Copy streampush configs
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Make link to code directory
RUN mkdir -p /opt/streampush
RUN mkdir -p /opt/streampush/app
RUN mkdir -p /opt/streampush/relay
RUN mkdir -p /opt/streampush/data
VOLUME /opt/streampush/data

# Move over the app code
COPY app /opt/streampush/app
RUN rm -rf /opt/streampush/app/streampush/frontend/static-src/

# Setup the supervisor script
COPY docker/supervisor.sh /opt/streampush/supervisor.sh
RUN chmod +x /opt/streampush/supervisor.sh

# Install requirements
RUN apk update && \
    apk add --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip3 install -r /opt/streampush/app/requirements.txt && \
    apk --purge del .build-deps

RUN go get -u github.com/streampush/relay && cp /root/go/bin/relay /usr/bin/relay

EXPOSE 80
EXPOSE 443
EXPOSE 1935
CMD ["/opt/streampush/supervisor.sh"]