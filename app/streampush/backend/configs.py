import os, datetime, uuid, subprocess, json
from backend.models import Restream, StreamEndpoint
from backend.endpoints import StreamEndpointSerializer
from subprocess import call

# Config generation stuff

CONFIG_LOCATION = '/opt/streampush/relay/configs'

def del_orphan_configs():
    if not os.path.exists(CONFIG_LOCATION):
        return

    for file in os.scandir(CONFIG_LOCATION):
        try:
            rUuid = uuid.UUID(file.name.replace(".json", "")).hex
        except:
            os.unlink(os.path.join(CONFIG_LOCATION, file.name))
            continue

        restream = Restream.objects.filter(id=rUuid)

        if len(restream) == 0:
            os.unlink(os.path.join(CONFIG_LOCATION, file.name))

def gen_configs_for_restream(restream): 
    if not os.path.exists(CONFIG_LOCATION):
        print("Generating initial config dir at {0}".format(CONFIG_LOCATION))
        os.makedirs(CONFIG_LOCATION)

    config_path = os.path.join(CONFIG_LOCATION, "{0}.json".format(restream.id))
    if os.path.exists(config_path):
        os.unlink(config_path)

    # Get list of endpoints that are associated with this restream
    endpoints = StreamEndpointSerializer(StreamEndpoint.objects.filter(restream=restream), many=True).data
    endpointsObj = {}
    for endpoint in endpoints:
        endpointsObj[str(endpoint["id"])] = endpoint

    newConfig = {
        "id": restream.id,
        "name": restream.name,
        "_owner": restream.owner.user.username,
        # "endpoints": StreamEndpointSerializer(endpoints, many=True).data
        "endpoints": endpointsObj
    }

    conf_contents = json.dumps(newConfig)

    with open(config_path, "w") as conf_fd:
        conf_fd.write(conf_contents)

    del_orphan_configs()

def gen_all_configs():
    for restream in Restream.objects.all():
        gen_configs_for_restream(restream)
    # TODO: Make relay reload config request