import 'dart:collection';
import 'dart:convert';
import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:pubnub/pubnub.dart';

import 'package:sms_server/model/message_model.dart';

import 'package:sms_server/objectbox.g.dart';

import '../model_helper/helper.dart';
import '../utils/globals.dart' as globals;

class PubNubProvider extends ChangeNotifier {
  var message = {};
  get getMessage => message;
  set setMessage(value) {
    message = value;
    notifyListeners();
  }

  Future<dynamic> getDataFromPubNub(String channel) async {
    // Create PubNub instance with default keyset.
    var pubnub = PubNub(
        defaultKeyset: Keyset(
            subscribeKey: 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0',
            publishKey: 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056',
            userId: UserId('myUniqueUserId')));

    // Subscribe to a channel
    print('channel: ' + channel);
    // var channel = "test_chan";
    var subscription = pubnub.subscribe(channels: {channel});

    // Print every message
    subscription.messages.listen((message) async {
      Map<String, dynamic> payload = {
        'poster': String,
        'name': String,
        'ts': String,
        'type': String
      };

      if (message.content['type'] == 'deadline' ||
          message.content['type'] == 'reminder' &&
              message.content['action_initiator'][0] == 'A') {
        payload['poster'] = message.content['poster'];
        payload['name'] = message.content['name'];
        payload['ts'] = message.content['timestamp'];
        payload['type'] = message.content['type'];

        setMessage = payload;

        var msg = messageDetail(payload: json.encode(payload));

        int id = globals.objectBoxService.insertMessage(msg);

        // print('message added to local storage, id: $id');
        // var querriedMessage = globals.objectBoxService.getMessage(id);

        // print("Msg from local Storge: ${querriedMessage?.payload}");
        // int count = globals.objectBoxService.countMessages();
        // print("Number of messages in local storage: $count");
      }
    });

    // // Unsubscribe and quit
    // await subscription.dispose();
  }
}
