import 'dart:collection';
import 'dart:convert';
import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:pubnub/pubnub.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sms_server/model/message_model.dart';
import 'dart:io';

import 'package:sms_server/objectbox.g.dart';

import '../model_helper/helper.dart';
import '../utils/globals.dart' as globals;

class PubNubProvider extends ChangeNotifier {
  StreamController<Map> streamController = StreamController<Map>();
  StreamController<bool> sendMessagesControl = StreamController<bool>();
  // bool isTrue = false;
  // bool get getisTrue => isTrue;
  // set setIsTrue(bool value) {
  //     isTrue=value;
  //     notifyListeners();
  // }

  // void ambotlang() {
  //     setIsTrue = !getisTrue;
  // }

  var message = {};
  get getMessage => message;
  set setMessage(value) {
    message = value;
    notifyListeners();
  }

  final messages_queue = msg_queue<Map>();

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
        // print(payload);
        setMessage = payload;

        // messages_queue.push(payload);
        // messages_queue.showQueue();

        var msg = messageDetail(payload: json.encode(payload));
        // print(payload);
        // globals.objectBoxService.clearMessages();
        int id = globals.objectBoxService.insertMessage(msg);
        print('message added to local storage, id: $id');
        var querriedMessage = globals.objectBoxService.getMessage(id);

        print("Msg from local Storge: ${querriedMessage?.payload}");
        int count = globals.objectBoxService.countMessages();
        print("Number of messages in local storage: $count");
      }

      // _write(String text) async {
      //   final Directory directory = await getApplicationDocumentsDirectory();
      //   final File file = File('${directory.path}/my_file.txt');
      //   await Future.delayed(Duration(seconds: 20), () {
      //     file.writeAsString(text, mode: FileMode.append);
      //     messages.removeFirst();
      //     print(messages);
      //     print('message length: ${messages.length}');
      //   });
      // }
    });

    // // Unsubscribe and quit
    // await subscription.dispose();
  }

  Future<void> message_handler() async {
    Stream stream = streamController.stream;

    stream.listen((value) async {
      messages_queue.push(value);
      // print('Item Pushed To First: ${value}');
      print(messages_queue.queueSize());
      // messages_queue.sendItem();
    });
  }

  Future<void> send_messages() async {
    Stream stream = sendMessagesControl.stream;

    stream.listen((value) {
      print('sending...');
      // in background unta
      while (!messages_queue.queueStatus()) {
        messages_queue.sendItem();
      }
    });
  }
}

class msg_queue<T> {
  final queue = Queue<T>();

  void push(T t) {
    queue.add(t);
  }

  T pop() {
    final first = queue.first;
    queue.removeFirst();
    return first;
  }

  void showQueue() {
    print(queue);
  }

  int queueSize() {
    final size = queue.length;
    return size;
  }

  bool queueStatus() {
    final status = queue.isEmpty;
    return status;
  }

  void sendItem() async {
    // print(queueStatus());

    // print('Item Send: ${pop()}');
    // print(queueSize());

    Timer(const Duration(seconds: 9), () {
      print('Item Send: ${pop()}');
      print(queueSize());
    });
  }
}
