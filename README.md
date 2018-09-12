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

Streampush has been tested on Ubuntu running Docker, but it *should* work on any platform that supports Docker.

### Usage

An easy setup script is provided for installation. All that is required is for `docker` and `docker-compose` to be installed on your host machine. It is recommended that the following steps be performed within an empty directory. Run the command below to start the install process:

`wget https://raw.githubusercontent.com/streampush/docker/master/setup/streampush.sh && chmod +x streampush.sh && ./streampush.sh config`

You'll be asked if you'd like to use the default ports. This should work fine for the majority of installs, but if you have to change them - here's your chance.

**It is highly recommended to enable SSL while using Streampush.** The config process can automatically create an nginx server with an SSL certificate provided by Let's Encrypt. If you already have a webserver running on your host machine, you'll need to setup the SSL cert and reverse proxy yourself.

Finally, run `./streampush.sh start` to start the server.

Navigate to the URL of your Streampush server and finish the initial superuser setup. Login with your credentials and Streampush is ready to use.

#### Configuring

##### Creating a restream
1) Click the blue `+ Restream` button at the bottom left of the UI.
2) Provide a name for the restream - this will be used to reference this specific restream within the app.
3) If no endpoints have been configured, use the form in the popup window to provide a RTMP URL and name for an endpoint. These endpoints can be reused on multiple restreams.
4) Click the endpoints you'd like to have receive content from this restream - they'll be highlighted in green if they are selected.
5) Click the save button.

##### Pushing content
1) Click the blue key-shaped icon on the restream that you would like to receive your content.
2) Read the disclaimer.
3) Click the eye-shaped icon to make your restream URL appear. Paste this URL in your streaming software of choice.
4) Start your live stream via your streaming software. 

#### SSL

Currently, you'll have to reverse proxy the Streampush image through another web server to provide an SSL layer. In the future, the image will allow for SSL configuration of it's internal nginx server. Ideally, we'll use Let's Encrypt to make it easy.

#### DigitalOcean

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

Some IDE recommendations if you don't already have one: VS Code and/or PyCharm. PyCharm is great for Django development and supports Typescript so it works pretty well for developing both the front and backend.

### List of things that would be greatly appreciated
* Overall code-review from someone with more experience than myself (esp. w.r.t. RTMP & Docker).
* Unit tests
* Stream preview
* UI design and tips - I'm not a frontend dev.

## License
See [LICENSE](https://github.com/streampush/streampush/blob/master/LICENSE)

