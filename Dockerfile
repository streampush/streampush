FROM buildpack-deps:stretch

# Versions of Nginx and nginx-rtmp-module to use
ENV NGINX_VERSION nginx-1.10.3
ENV NGINX_RTMP_MODULE_VERSION 1.2.1

# Install dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates build-essential openssl libssl-dev libpcre3 libpcre3-dev && \
    rm -rf /var/lib/apt/lists/*

# Download and decompress Nginx
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

# Download and decompress RTMP module
RUN cd /tmp/build && \
    git clone git://github.com/arut/nginx-rtmp-module.git

# Build and install Nginx
# The default puts everything under /usr/local/nginx, so it's needed to change
# it explicitly. Not just for order but to have it in the PATH
RUN cd /tmp/build/nginx/${NGINX_VERSION} && \
    ./configure \
        --with-http_ssl_module \
        --add-module=/tmp/build/nginx-rtmp-module && \
    make -j $(getconf _NPROCESSORS_ONLN) && \
    make install && \
    mkdir /var/lock/nginx && \
    cp /tmp/build/nginx-rtmp-module/stat.xsl /usr/local/nginx/html/stat.xsl && \
    rm -rf /tmp/build

# Forward logs to Docker
#RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
#    ln -sf /dev/stderr /var/log/nginx/error.log

# Install redis server
RUN echo "deb http://ftp.utexas.edu/dotdeb/ stable all \
deb-src http://ftp.utexas.edu/dotdeb/ stable all" > /etc/apt/sources.list.d/dotdeb.list && \
    wget https://www.dotdeb.org/dotdeb.gpg && apt-key add dotdeb.gpg && \
    apt-get update && apt-get install -y redis-server

# Copy streampush configs
COPY docker/nginx.conf /usr/local/nginx/conf/nginx.conf
RUN mkdir -p /etc/nginx/rtmp.conf.d/
RUN mkdir -p /var/log/nginx/

# Make link to code directory
RUN mkdir /opt/streampush
RUN mkdir /opt/streampush/app

# Move over the app code
COPY app /opt/streampush/app

# Build the frontend
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs build-essential && \
    npm i -g @angular/cli

RUN cd /opt/streampush/app/streampush/frontend/static-src/streampush && \
    npm i && \
    ng build

# Setup the supervisor script
COPY docker/supervisor.sh /opt/streampush/supervisor.sh
RUN chmod +x /opt/streampush/supervisor.sh

# Install requirements
RUN apt-get update && apt-get install -y python3-dev
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py
RUN pip3 install -r /opt/streampush/app/requirements.txt

EXPOSE 80
EXPOSE 443
EXPOSE 1935
CMD ["/opt/streampush/supervisor.sh"]

#FROM python:3
#ENV PYTHONUNBUFFERED 1
#RUN mkdir /opt/streampush
#WORKDIR /app
#ADD requirements.txt /opt/streampush/
#RUN pip install -r requirements.txt
#ADD . /opt/streampush/
