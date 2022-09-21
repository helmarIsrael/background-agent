from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import time
import os
pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
pnconfig.ssl = True
pnconfig.uuid ="myuuid"
pubnub = PubNub(pnconfig)
def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        pass
class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        print("\nmsgL: " + message.message['text'] + "\n")


pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels("testChannel").execute()
## publish a message
while True:
    msg = input("Input a message to publish: ")
    if msg == 'exit': os._exit(1)
    pubnub.publish().channel("testChannel").message(str(msg)).pn_async(my_publish_callback)