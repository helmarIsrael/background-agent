from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import studentapp.models as models
import studentapp.message_receiver 
import datetime
import time


        

def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Connection Good!")
        # show()
        pass

class notifications(object):
    def __init__(self, id=None, updated_items=None):
        self.id = id
        self.updated_items = updated_items
        pnconfig = PNConfiguration()
        pnconfig.subscribe_key = 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279'
        pnconfig.publish_key = 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7'
        pnconfig.ssl = True
        pnconfig.uuid = "myUUID"

        
        self.ch = 'chan-1'#######################
                              ############## KANING DUHA NEEDED DRI PARA MAGBALIK2 UG GAWAS ANG FLASH SA FRONTEND
        self.pubnub = PubNub(pnconfig)##############
        
        
        # self.pubnub.add_listener(MySubscribeCallback())
        # self.pubnub.subscribe().channels('my_channel').execute()

    def show(self):
        arr = []
        f = open("msg.txt", "r")
        contents = f.read()
        arr.append(contents)
        print(arr)
        arr.clear()
        

    def get_timestamp(self):
        curr_dt = datetime.datetime.now()
        msg_timestamp = int(round(curr_dt.timestamp()))
        return msg_timestamp


    def verify_id(self, id, type):
        student = models.students(id_number=id)
        if type == 'create':
            if student.validation(): #Existing ang id so mo error sya kung register
                return id
        elif type == 'update' or 'delete':
            if not student.validation(): #Existing ang id pero since update man so okay ra na existing
                return id

    async def add_event(self):
        id = self.verify_id(self.id, 'create')
        event = f'New Student Added - {id}'
        type = 'create'
        timestamp = self.get_timestamp()
        self.pubnub.publish().channel(self.ch).message({'text': event, 'type' : type, 'id': id, 'timestamp': timestamp}).pn_async(my_publish_callback)


    async def delete_event(self):
        id = self.verify_id(self.id, 'delete')
        event = f'Student {id} is Deleted'
        type = 'remove'
        timestamp = self.get_timestamp()
        self.pubnub.publish().channel(self.ch).message({'text': event, 'type' : type, 'id': id,'timestamp': timestamp}).pn_async(my_publish_callback)
    

    async def update_event(self):
        id = self.verify_id(self.id, 'update')
        # print(f'id: {id}')
        changed_items = len(self.updated_items)
        # print(len(self.updated_items))
        if changed_items > 2:
            event = f'Student {id} infos updated! {changed_items} infos changed'
        elif changed_items == 2:
            event = f'Student {id} updated its {self.updated_items[0]} and {self.updated_items[1]}'
        else:
            event = f'Student {id} updated its {self.updated_items[0]}'
        type = 'update'
        timestamp = self.get_timestamp()
        # event = f'Student {id} infos updated!'
        self.pubnub.publish().channel('my_channel').message({'text': event, 'type': type, 'id': id, 'timestamp': timestamp}).pn_async(my_publish_callback)