from studentapp import app
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import studentapp.models as models
import studentapp.message_receiver 
from datetime import datetime, timedelta
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

def show():
    f = open("studentapp\message_handler\msg.txt", "r")
    contents = f.read()
    if contents:
        msg_data = eval(contents)
        print(msg_data['text'])
        msg = msg_data['text']
        msg_type = msg_data['type']
        msg_id = msg_data['id']
        msg_channel = msg_data['channel']
        msg_timestamp = msg_data['timestamp']
        # print("Integer timestamp of current datetime: ", msg_timestamp)
        print(f'Student I.D: {msg_id}\nMessage payload: {msg}\nType: {msg_type}\nChannel: {msg_channel}\nTimestamp: {msg_timestamp}\n\n')
        db = models.students(
            id=msg_id,
            message_payload=msg,
            timestamp=msg_timestamp,
            msg_type = msg_type,
            channel = msg_channel
        )

        with app.app_context():
            db.store_notif()





def fileListener():
    observer = Observer()
    class MyHandler(FileSystemEventHandler):
        def __init__(self):
            self.observer = observer
        def on_modified(self, event):
            show()
            self.observer.stop()
    
    event_handler = MyHandler()
    observer.schedule(event_handler, path='studentapp\message_handler', recursive=False)
    observer.start()
   
   

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

        
        self.ch = 'my_channel'#######################
                              ############## KANING DUHA NEEDED DRI PARA MAGBALIK2 UG GAWAS ANG FLASH SA FRONTEND
        self.pubnub = PubNub(pnconfig)##############
        
        

    


        

    def get_timestamp(self):
        curr_dt = datetime.now()
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
        fileListener()
        self.pubnub.publish().channel(self.ch).message({'text': event, 'type': type, 'id': id, 'channel':self.ch, 'timestamp': timestamp}).pn_async(my_publish_callback)

    async def readAll_event(self):
        self.pubnub.publish().channel(self.ch).message({'text': 'readAll'}).pn_async(my_publish_callback)
    

    async def delete_event(self):
        id = self.verify_id(self.id, 'delete')
        event = f'Student {id} is Deleted'
        type = 'remove'
        timestamp = self.get_timestamp()
        fileListener()
        self.pubnub.publish().channel(self.ch).message({'text': event, 'type': type, 'id': id, 'channel':self.ch, 'timestamp': timestamp}).pn_async(my_publish_callback)
    

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
        fileListener()
        self.pubnub.publish().channel(self.ch).message({'text': event, 'type': type, 'id': id, 'channel':self.ch, 'timestamp': timestamp}).pn_async(my_publish_callback)
        