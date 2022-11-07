from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pprint import pprint

class MySubscribeCallback(SubscribeCallback):
    def status(self, pubnub, status):
        pass

    def presence(self, pubnub, presence):
        pprint(presence.__dict__)

    def message(self, pubnub, message):
        pprint(message.__dict__)

def my_publish_callback(envelope, status):
    print(envelope, status)

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "sub-c-ad6501d2-b149-11ea-875a-ceb74ea8e96a"
pnconfig.publish_key = "pub-c-23141792-fb90-4143-a952-d7ddcf7fc647"
pnconfig.uuid = 'pythonista'

pubnub = PubNub(pnconfig)

pubnub.add_listener(MySubscribeCallback())

pubnub.subscribe()\
    .channels("pubnub_onboarding_channel")\
    .with_presence()\
    .execute()\


def talk(msg, channel):
    #"pubnub_onboarding_channel"
    pubnub.publish()\
        .channel(channel)\
        .message({"sender": pnconfig.uuid, "content": msg})\
    .pn_async(my_publish_callback)


ans = 'y'

while (ans == 'y'):
    mesg = input("Message:")
    channel = input("Channel:")
    talk(mesg, channel)
    ans = input("Continue?")

