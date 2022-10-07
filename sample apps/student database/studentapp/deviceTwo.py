from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import time
import os
pnconfig = PNConfiguration()
pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
pnconfig.ssl = True
pnconfig.uuid = "myUUID"
pubnub = PubNub(pnconfig)

# pubnub = PubNub(pnconfig)
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
        print ("\nmessage: " + message.message+"\n")


pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels("chan-1").execute()
## publish a message

class notif(object):
    def __init__(self, msg=None):
        self.msg = msg
        # self.ch = 'my_channel'
        # self.pubnub = PubNub(pnconfig)
        # self.pubnub.add_listener(MySubscribeCallback())
        # self.pubnub.subscribe().channels("chan-1").execute()


    def sendmsg(self):
        self.pubnub.publish().channel("chan-1").message(str(self.msg)).pn_async(my_publish_callback)






while True:
    message = input('input: ')
    if message == 'exit': os._exit(1)
    send = notif(msg=message)
    send.sendmsg()