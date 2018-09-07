# Streampush

## Features

* Stream your live content to viewers on numerous platforms.
* Hot-reload: modifying which platforms your content is going to while you are live doesn't require a restart of your stream. Streampush will automatically start/stop pushing where necessary.
* Web interface and statistics.
* Easy to deploy.
* Free.

## Installation

### Requirements

* A machine running [Docker](https://docs.docker.com/install/#supported-platforms). That's it.

Platforms that will run Docker: Linux / Mac / Windows

Streampush has been tested on Ubuntu 16.04 running Docker 18.06.1 CE, but it *should* work on any platform that supports Docker.

### Usage

Run the below command in a terminal:

```docker run -it -p 80:80 -p 1935:1935 -e DJANGO_SECRET='YourSecretHere' --mount source=streampush-data,target=/opt/streampush/data streampush``` 

**Note**: Replace `YourSecretHere` with a long random string of characters. See the [Django docs](https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-SECRET_KEY) for more info.  

This command will pull the Streampush image from Docker Hub and expose the Streampush web interface on port 80. Additionally, port 1935 will be exposed for receiving RTMP streams. Finally, a Docker volume will be created to store the database between container restarts. 

Navigate to the URL of your Streampush server and finish the initial superuser setup. Login with those credentials and Streampush is ready to use.

#### SSL

Currently, you'll have to reverse proxy the Streampush image through another web server to provide an SSL layer. In the future, the image will allow for SSL configuration of it's internal nginx server. Ideally, we'll use Let's Encrypt to make it easy.

#### DigitalOcean (DO)

DigitalOcean provides a [one-click app](https://www.digitalocean.com/products/one-click-apps/docker/) with Docker pre-installed. Simply follow the above steps after creating your Droplet and you'll be up and running in no time. Though do be aware: they seem to have some [bandwidth limits](https://www.digitalocean.com/docs/accounts/billing/bandwidth/) ($0.01/GB after 1000GB as of June 2018).

## Contributing

Pull requests are greatly appreciated. Please keep in mind a few things:
* Follow the coding style that is predominantly used within the file you are editing.
* Please only add one feature per PR so we can keep things easy to follow.

My current development process requires rebuilding the Docker image after every change - it's incredibly inconvenient. There's a script called `start.sh` that can be used to build and start the dev environment:

`./start.sh build && ./start.sh` - this will trigger a build and run of the Streampush docker image in the following order:
1) AngularJS frontend build.
2) Docker image build.

**Don't use `start.sh` for a production environment.** It doesn't properly set the `SECRET_KEY` for Django.

Some IDE recommendations if you don't already have one: VS Code and/or PyCharm. PyCharm supports Typescript so it works pretty well for the front-end stuff, too.

### List of things that would be greatly appreciated
* Overall code-review from someone with more experience than myself (esp. w.r.t. RTMP & Docker).
* Unit tests

## License
See LICENSE.md