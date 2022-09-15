from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub, SubscribeListener
from pubnub.pubnub import PubNub
import os

from .for_valid import notifs

import studentapp.models as models

pnconfig = PNConfiguration()
pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
pnconfig.user_id = "my_user_id"
pnconfig.uuid = "myUUID"
pnconfig.ssl = True
ch = 'my_channel'

pubnub = PubNub(pnconfig)


def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Connection OK")
        pass

class MySubscribeCallback(SubscribeCallback):

    def message(self, pubnub, message):
        notifs.append(message.message['text'])


pubnub.subscribe().channels('my_channel').execute()
pubnub.add_listener(MySubscribeCallback())

   
    
    



class notifications(object):
    def __init__(self, id=None):
        self.id = id

    def verify_id(self, id):
        student = models.students(id_number=id)
        if student.validation():
            return id

    def sent_event(self):
        id = self.verify_id(self.id)
        event = f'New Student Added - {id}'
        pubnub.publish().channel(ch).message({'text': event}).pn_async(my_publish_callback)

    def getMsg(self):
        result = None
        subscribe_listener = SubscribeListener()
        pubnub.add_listener(subscribe_listener) 
        result = subscribe_listener.wait_for_message_on(ch)
        
        notifs.append(result.message['text'])

        print(notifs)
    

