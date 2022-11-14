from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pprint import pprint
from datetime import datetime, timedelta

# class MySubscribeCallback(SubscribeCallback):
#     def status(self, pubnub, status):
#         pass

#     def presence(self, pubnub, presence):
#         pprint(presence.__dict__)

#     def message(self, pubnub, message):
#         pprint(message.__dict__)

# def my_publish_callback(envelope, status):
#     print(envelope, status)

# pnconfig = PNConfiguration()
# pnconfig.subscribe_key = "sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0"
# pnconfig.publish_key = "pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056"
# pnconfig.uuid = 'pythonista'

# pubnub = PubNub(pnconfig)

# pubnub.add_listener(MySubscribeCallback())

# pubnub.subscribe()\
#     .channels("myeskwela-testchan")\
#     .with_presence()\
#     .execute()\



def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Connection Good!")
        # show()
        pass


class notifications(object):
    def __init__(self, msg_payload=None, user_type=None, 
                username=None, poster=None, type=None,
                due_date=None, section=None, start_date=None,
                receiver_id=None, channels=None):
        self.username = username
        self.user_type = user_type
        self.msg_payload = msg_payload
        self.poster = poster
        self.type = type
        self.due_date = due_date
        self.section = section
        self.start_date = start_date
        self.receiver_id = receiver_id

        self.channels = channels
        pnconfig = PNConfiguration()
        pnconfig.subscribe_key = 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0'
        pnconfig.publish_key = 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056'
        pnconfig.ssl = True
        pnconfig.uuid = "pythonista"

        
        # self.ch = 'myeskwela-testchan'
        self.pubnub = PubNub(pnconfig)

    def get_timestamp(self):
        curr_dt = datetime.now()
        msg_timestamp = int(round(curr_dt.timestamp()))
        return msg_timestamp

    def notify(self):
        username = self.username
        user_type = self.user_type
        msg_payload = self.msg_payload
        type = self.type
        channels = self.channels
        timestamp = self.get_timestamp()
        if type == 'Bulletin Board':
            poster = f'{self.poster} has posted!'
            if len(channels) > 1:
                for item in channels:
                    self.pubnub.publish()\
                        .channel(item)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':item, 'timestamp': timestamp})\
                        .pn_async(my_publish_callback)
            elif isinstance(channels, str):
                self.pubnub.publish()\
                        .channel(channels)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels, 'timestamp': timestamp})\
                        .pn_async(my_publish_callback)
            else:
                self.pubnub.publish()\
                        .channel(channels[0])\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels[0], 'timestamp': timestamp})\
                        .pn_async(my_publish_callback)
        elif type == 'assignment':
            duedate = self.due_date
            section = self.section
            poster = f'{self.poster} has posted An Assignment!'
            channels = self.channels
            if len(channels) > 1:
                for item in channels:
                    self.pubnub.publish()\
                        .channel(item)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':item, 'timestamp': timestamp, 
                                'due_date':duedate, 'section': section})\
                        .pn_async(my_publish_callback)
            elif isinstance(channels, str):
                self.pubnub.publish()\
                        .channel(channels)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':channels, 'timestamp': timestamp, 
                                'due_date':duedate, 'section': section})\
                        .pn_async(my_publish_callback)
            else:
                self.pubnub.publish()\
                        .channel(channels[0])\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':channels[0], 'timestamp': timestamp, 
                                'due_date':duedate, 'section': section})\
                        .pn_async(my_publish_callback)

        elif type == 'event':
            start_date = self.start_date
            duedate = self.due_date
            poster = f'{self.poster} has posted an Event!'
            channels = self.channels
            if len(channels) > 1:
                for item in channels:
                    self.pubnub.publish()\
                        .channel(item)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':item, 'timestamp': timestamp, 
                                'due_date':duedate, 
                                'start_date': start_date})\
                        .pn_async(my_publish_callback)
            elif isinstance(channels, str):
                self.pubnub.publish()\
                        .channel(channels)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':channels, 'timestamp': timestamp, 
                                'due_date':duedate, 
                                'start_date': start_date})\
                        .pn_async(my_publish_callback)
            else:
                self.pubnub.publish()\
                        .channel(channels[0])\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 
                                'username': username, 'user_type': user_type, 
                                'channel':channels[0], 'timestamp': timestamp, 
                                'due_date':duedate, 
                                'start_date': start_date})\
                        .pn_async(my_publish_callback)

        elif type == 'comment':
            receiver_id = self.receiver_id
            poster = f'''{self.poster} has commented on a class Post!'''
            channels = self.channels
            if len(channels) > 1:
                for item in channels:
                    self.pubnub.publish()\
                        .channel(item)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':item, 'timestamp': timestamp})\
                        .pn_async(my_publish_callback)
            elif isinstance(channels, str):
                self.pubnub.publish()\
                    .channel(channels)\
                    .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels, 'timestamp': timestamp})\
                    .pn_async(my_publish_callback)
            else:
                self.pubnub.publish()\
                    .channel(channels[0])\
                    .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels[0], 'timestamp': timestamp})\
                    .pn_async(my_publish_callback)
        elif type == 'reaction':
            poster = f'{self.poster} has reacted!'
            msg_payload = f'{self.poster} has reacted with {msg_payload} on a post'
            if len(channels) > 1:
                for item in channels:
                    self.pubnub.publish()\
                        .channel(item)\
                        .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':item, 'timestamp': timestamp})\
                        .pn_async(my_publish_callback)           
            elif isinstance(channels, str):
                self.pubnub.publish()\
                    .channel(channels)\
                    .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels, 'timestamp': timestamp})\
                    .pn_async(my_publish_callback)
            else:
                self.pubnub.publish()\
                    .channel(channels[0])\
                    .message({'poster':poster,'text': msg_payload, 'type': type, 'username': username, 'user_type': user_type, 'channel':channels[0], 'timestamp': timestamp})\
                    .pn_async(my_publish_callback)

            
       