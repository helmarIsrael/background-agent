from pubnub.callbacks import SubscribeCallback
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub, SubscribeListener
from pubnub.pubnub import PubNub
from .for_valid import notifs

import studentapp.models as models




def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Connection OK")
        pass

class MySubscribeCallback(SubscribeCallback):

    def message(self, pubnub, message):
        print(message.message)
        notifs.append(message.message['text'])




   
    
    



class notifications(object):
    def __init__(self, id=None):
        self.id = id
        pnconfig = PNConfiguration()
        pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
        pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
        pnconfig.user_id = "my_user_id"
        pnconfig.uuid = "myUUID"
        pnconfig.ssl = True
        self.ch = 'my_channel'
        self.pubnub = PubNub(pnconfig)

    def verify_id(self, id):
        student = models.students(id_number=id)
        if student.validation():
            return id

    async def sent_event(self):
        
        id = self.verify_id(self.id)
        event = f'New Student Added - {id}'
        self.pubnub.publish().channel(self.ch).message({'text': event}).pn_async(my_publish_callback)
        self.pubnub.subscribe().channels('my_channel').execute()
        self.pubnub.add_listener(MySubscribeCallback())



