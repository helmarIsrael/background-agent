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
pubnub.unsubscribe().channels("my_channel").execute()

class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        # f = open('msg.txt', "r+")
        # f.read()
        # f.seek(0)
        # f.truncate()
        # with open('msg.txt', 'w') as convert_file:
        #     convert_file.write(json.dumps(message.message))
        print(message.message['text'])
        # unsub()

# The Python SDK doesn't currently support *Server Objects*,
# so it doesn't have any handlers for them.

class SubscribeHandler(SubscribeCallback):
  def message(self, pubnub, message):
      print("Message payload: %s" % message.message)
      print("Message publisher: %s" % message.publisher)
      unsub()



async def sub():
    await pubnub.add_listener(MySubscribeCallback())
    await pubnub.subscribe().channels("my_channel").execute()
    unsub()

def unsub():   
    pubnub.unsubscribe().channels("my_channel").execute()         
    
    pubnub.here_now()\
    .channels("my_channel")\
    .include_state(True)\
    .pn_async(here_now_callback)




def here_now_callback(result, status):
  if status.is_error():
    print("here_now error: %s" % status)
    return

  for channel_data in result.channels:
    print("channel: %s" % (channel_data.channel_name))
    print("occupancy: %s" % channel_data.occupancy)
    # if channel_data.occupancy != 0:
    #     print("unsubing")
# sub()        
# pubnub.unsubscribe().channels("my_channel").execute()     
# pubnub.here_now()\
#     .channels("my_channel")\
#     .include_state(True)\
#     .pn_async(here_now_callback)


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
        