def getBrand(string):
    brand = "none"
    if "twitch.tv" in string:
        brand = "twitch"
    elif "facebook.com" in string:
        brand = "facebook"
    elif "youtube.com" in string:
        brand = "youtube"
    return brand