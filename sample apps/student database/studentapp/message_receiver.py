from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from studentapp.messages import *
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

 
# pubnub.unsubscribe().channels("my_channel").execute()
pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels("my_channel").execute()





# publish a message
# while True:
#     msg = input('Listening...')
#     if msg == 'exit': os._exit(1)
#     # pubnub.publish().channel("my_channel").message(str(msg)).pn_async(my_publish_callback)











   # msg = message.message['text']
        # msg_type = message.message['type']
        # msg_id = message.message['id']
        # msg_channel = message.channel
        # curr_dt = datetime.now()
        # # print("Current datetime: ", curr_dt)
        # if message.message:
        #     print('asdasd')
        # msg_timestamp = int(round(curr_dt.timestamp()))
        # print("Integer timestamp of current datetime: ", msg_timestamp)
        # print(f'Student I.D: {msg_id}\nMessage payload: {msg}\nType: {msg_type}\nChannel: {msg_channel}\nTimestamp: {msg_timestamp}\n\n')
        # db = models.students(
        #     id=msg_id,
        #     message_payload=msg,
        #     timestamp=msg_timestamp,
        #     msg_type = msg_type,
        #     channel = msg_channel
        # )

        # with app.app_context():
        #     db.store_notif()
        