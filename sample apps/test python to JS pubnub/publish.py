from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import time
import os
pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056'
pnconfig.subscribe_key = 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0'
pnconfig.ssl = True
pnconfig.uuid ="myuuid"
pubnub = PubNub(pnconfig)
def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        pass
# class MySubscribeCallback(SubscribeCallback):
#     def presence(self, pubnub, presence):
#         pass
#     def status(self, pubnub, status):
#         pass
#     def message(self, pubnub, message):
#         print("\nmsgL: " + message.message['text'] + "\n")


# pubnub.add_listener(MySubscribeCallback())
# pubnub.subscribe().channels("testChannel").execute()
## publish a message
while True:
    msg = input("Input a message to publish: ")
    if msg == 'exit': os._exit(1)
    pubnub.publish().channel("myeskwela-testchan").message(str(msg)).pn_async(my_publish_callback)