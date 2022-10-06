from pubnub.callbacks import SubscribeCallback
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
# import studentapp.models as models
# from studentapp import app
from datetime import datetime
import os



pnconfig = PNConfiguration()
pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
pnconfig.user_id = "my_user_id"
pnconfig.uuid = "myUUID"
pnconfig.ssl = True
ch = 'my_channel'
pubnub = PubNub(pnconfig)
pubnub.subscribe().channels('my_channel').execute()


class MySubscribeCallback(SubscribeCallback):

    def message(self, pubnub, message):
        # pubnub.unsubscribe().channels(ch).execute()
        msg = message.message['text']
        msg_type = message.message['type']
        msg_id = message.message['id']
        msg_channel = message.channel
        curr_dt = datetime.now()
        # print("Current datetime: ", curr_dt)
        msg_timestamp = int(round(curr_dt.timestamp()))
        print('message received')


pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels('my_channel').execute()


while True:
    msg = input("Input a message to publish: ")
    if msg == 'exit': os._exit(1)