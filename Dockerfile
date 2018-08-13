FROM buildpack-deps:stretch

ENV NGINX_VERSION nginx-1.10.3

# Install pip
RUN apt-get update && apt-get install -y python3-dev
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py

# Install dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates build-essential openssl libssl-dev libpcre3 libpcre3-dev sudo unzip && \
    rm -rf /var/lib/apt/lists/*

# Download and decompress Nginx
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

# Download and decompress RTMP module
# Apply patch for JSON stat output
RUN cd /tmp/build && \
    git clone git://github.com/arut/nginx-rtmp-module.git && \
    cd nginx-rtmp-module && \
    wget https://patch-diff.githubusercontent.com/raw/arut/nginx-rtmp-module/pull/815.patch && \
    patch < 815.patch

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
    ln -s /usr/local/nginx/sbin/nginx /sbin/nginx && \
    rm -rf /tmp/build

# # Forward logs to Docker
# #RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
# #    ln -sf /dev/stderr /var/log/nginx/error.log

# Install redis server
RUN echo "deb http://ftp.utexas.edu/dotdeb/ stable all \
deb-src http://ftp.utexas.edu/dotdeb/ stable all" > /etc/apt/sources.list.d/dotdeb.list && \
    wget https://www.dotdeb.org/dotdeb.gpg && apt-key add dotdeb.gpg && \
    apt-get update && apt-get install -y redis-server

# Build the frontend
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs build-essential
RUN npm i -g @angular/cli

# Copy streampush configs
COPY docker/nginx.conf /usr/local/nginx/conf/nginx.conf
RUN mkdir -p /etc/nginx/rtmp.conf.d/
RUN mkdir -p /var/log/nginx/

# Make link to code directory
RUN mkdir /opt/streampush
RUN mkdir /opt/streampush/app
RUN mkdir /opt/streampush/data
VOLUME /opt/streampush/data

# Move over the app code
COPY app /opt/streampush/app

RUN cd /opt/streampush/app/streampush/frontend/static-src/streampush && \
    npm i && \
    ng build

# Setup the supervisor script
COPY docker/supervisor.sh /opt/streampush/supervisor.sh
RUN chmod +x /opt/streampush/supervisor.sh

# Install requirements
RUN pip3 install -r /opt/streampush/app/requirements.txt

EXPOSE 80
EXPOSE 443
EXPOSE 1935
CMD ["/opt/streampush/supervisor.sh"]