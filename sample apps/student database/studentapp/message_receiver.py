from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import json

pnconfig = PNConfiguration()
pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
pnconfig.ssl = True
pnconfig.uuid = "myUUID"
pubnub = PubNub(pnconfig)

class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        with open('studentapp\message_handler\msg.txt', 'w') as convert_file:
            convert_file.write(json.dumps(message.message))

 
pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels("my_channel").execute()





