import os, datetime, uuid
from backend.models import Restream, StreamEndpoint
from subprocess import call

# Config generation stuff

'''
worker_processes auto;
rtmp_auto_push on;
events {}
rtmp {
    server {
        listen 1935;
        listen [::]:1935 ipv6only=on;     

        include /etc/nginx/rtmp.conf.d/*.conf; 
    }
}
'''

CONFIG_LOCATION = '/etc/nginx/rtmp.conf.d/'

def del_orphan_configs():
    if not os.path.exists(CONFIG_LOCATION):
        return

    for file in os.scandir(CONFIG_LOCATION):
        try:
            rUuid = uuid.UUID(file.name.replace(".conf", "")).hex
        except:
            print("Deleted invalid config: ", file.name)
            os.unlink(os.path.join(CONFIG_LOCATION, file.name))
            continue

        restream = Restream.objects.filter(id=rUuid)

        if len(restream) == 0:
            print("Deleted orphan config: ", file.name)
            os.unlink(os.path.join(CONFIG_LOCATION, file.name))

def gen_configs_for_restream(restream): 
    if not os.path.exists(CONFIG_LOCATION):
        print("Generating initial config dir at {0}".format(CONFIG_LOCATION))
        os.makedirs(CONFIG_LOCATION)

    config_path = os.path.join(CONFIG_LOCATION, "{0}.conf".format(restream.id))
    if os.path.exists(config_path):
        os.unlink(config_path)

    # Get list of endpoints that are associated with this restream
    endpoints = StreamEndpoint.objects.filter(restream=restream)
    push_points = ""
    for endpoint in endpoints:
        push_points += "    push {0};\n".format(endpoint.url)

    conf_contents = """
# Restream ID: {0}
# Restream Name: {4}
# Owner: {2}
# Generated at: {3}
application {0} {{
    live on;
    meta copy;

{1}
}}""".format(restream.id, push_points, restream.owner.user.username, datetime.datetime.now(), restream.name)

    with open(config_path, "w") as conf_fd:
        conf_fd.write(conf_contents)

    retcode = call(["service", "nginx", "reload"])
    if retcode != 0:
        print("Error reloading nginx configs!")

    del_orphan_configs()