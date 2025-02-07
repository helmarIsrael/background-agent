from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pprint import pprint
from datetime import datetime, timedelta
from __init__ import spcall




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
                tstamp = None, name=None, action_initiator = None, phone_number = None):
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
        self.action_initiator = action_initiator
        self.phone_number = phone_number

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
        action_initiator = self.action_initiator
        phone_number = self.phone_number

        
        
        if isinstance(channels, str) == False and len(channels) > 1:
            for item in channels:
                self.pubnub.publish()\
                    .channel(item)\
                    .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':item,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate,
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator, 'phone_number': phone_number})\
                    .pn_async(my_publish_callback)
                notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':item,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate,
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator}
                self.savetodb(notif_dict)

        elif isinstance(channels, str):
            print(channels)
            self.pubnub.publish()\
                    .channel(channels)\
                     .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator, 'phone_number': phone_number})\
                    .pn_async(my_publish_callback)
            notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels,
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator}
            
            self.savetodb(notif_dict)
        else:
            self.pubnub.publish()\
                    .channel(channels[0])\
                    .message({'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels[0],
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator, 'phone_number': phone_number})\
                    .pn_async(my_publish_callback)

            notif_dict = {'poster':poster,'text': text, 'type': type, 'username': username,
                                'user_type': user_type, 'channel':channels[0],
                                'initiatorid': initiatorid, 'receiverid': receiverid,
                                'timestamp': tstamp, 'duedate': duedate, 
                                'startdate': startdate, 'section':section,
                                'name': name, 'action_initiator': action_initiator}
            
            self.savetodb(notif_dict)
    
        
        
        
    def savetodb(self, data):
        notif = data['poster']
        notif_type = data['type']
        username = data['username']
        user_type = data['user_type']
        channel = data['channel']
        initiatorid = data['initiatorid']
        receiverid = data['receiverid']
        ts = data['timestamp']
        duedate = data['duedate']
        startdate = data['startdate']
        poster = data['name']
        action_initiator = data['action_initiator']
        

        for item in receiverid:
            print(f"""\n
notif: {notif} {type(notif)}
notif_type: {notif_type} {type(notif_type)}
username: {username} {type(username)}
user_type: {user_type} {type(user_type)}
channel: {channel} {type(channel)}
initiator_id: {initiatorid} {type(initiatorid)}
receiver_id: {item} {type(item)}
timeline_ts: {ts} {type(ts)}
due_date: {duedate} {type(duedate)}
start_date: {startdate} {type(startdate)}
poster: {poster} {type(poster)}
action_initiator: {action_initiator} {type(action_initiator)}
\n""") 
            ## SIMULATES ADDING TO DB
            res = spcall("insert2notification",
                 (notif, 
                 notif_type, 
                 username,
                 user_type,
                 channel,
                 initiatorid,
                 item,
                 ts,
                 duedate,
                 startdate,
                 poster,
                 action_initiator
                  ), user_type, True)
            print(res)
        # res =  spcall("getvirtualroomidbysection",('AERO',),)[0][0]
        # print(res)