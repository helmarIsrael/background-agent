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
                receiver_id=None, channels=None, initiator_id = None,
                tstamp = None, name=None):
        self.username = username
        self.user_type = user_type
        self.msg_payload = msg_payload
        self.poster = poster
        self.type = type
        self.due_date = due_date
        self.section = section
        self.start_date = start_date
        self.receiver_id = receiver_id
        self.initiator_id = initiator_id
        self.name = name

        self.channels = channels
        self.tstamp = tstamp
        pnconfig = PNConfiguration()
        pnconfig.subscribe_key = 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0'
        pnconfig.publish_key = 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056'
        pnconfig.ssl = True
        pnconfig.uuid = "pythonista"

        
        # self.ch = 'myeskwela-testchan'
        self.pubnub = PubNub(pnconfig)


    def notify(self):
        poster = self.poster
        text = self.msg_payload
        type = self.type
        username = self.username
        user_type = self.user_type
        channels = self.channels
        initiatorid = self.initiator_id
        receiverid = self.receiver_id
        tstamp = self.tstamp
        duedate = self.due_date
        startdate = self.start_date
        section = self.section
        name = self.name
        
        if isinstance(channels, str) == False and len(channels) > 1:
            for item in channels:
                self.pubnub.publish()\
                    .channel(item)\
                    .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':item,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate,
                                'startdate': startdate, 'section':section,
                                'name': name})\
                    .pn_async(my_publish_callback)
                notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':item,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate,
                                'startdate': startdate, 'section':section,
                                'name': name}
                self.savetodb(notif_dict)

        elif isinstance(channels, str):
            self.pubnub.publish()\
                    .channel(channels)\
                     .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name})\
                    .pn_async(my_publish_callback)
            notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name}
            
            self.savetodb(notif_dict)
        else:
            self.pubnub.publish()\
                    .channel(channels[0])\
                    .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels[0],
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name})\
                    .pn_async(my_publish_callback)

            notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels[0],
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name}
            
            self.savetodb(notif_dict)
    
        
        
        
    def savetodb(self, data):
        notif_id = 'notifid'
        notif = 'notif'
        notif_type = 'type'
        username = 'username'
        user_type = 'usertype'
        channel = 'channel'
        initiatorid = 'initiatorid'
        receiverid = 'receiverid'
        duedate = 'duedate'
        startdate = 'startdate'

        pprint(data)