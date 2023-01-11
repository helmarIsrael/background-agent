import 'dart:collection';
import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:pubnub/pubnub.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class PubNubProvider extends ChangeNotifier {
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

  // var message2;
  // get getMessage2 => message;
  // set setMessage2(value) {
  //   message = value;
  //   notifyListeners();
  // }

  Queue<Map<String, dynamic>> messages = Queue<Map<String, dynamic>>();

  Future<dynamic> getDataFromPubNub(String channel) async {
    // Create PubNub instance with default keyset.
    var pubnub = PubNub(
        defaultKeyset: Keyset(

            // subscribeKey: 'sub-c-929f34e0-ac3c-4ac1-9203-662b20f90279',
            // publishKey: 'pub-c-b0c69ce9-13c4-4ee1-8995-c829d3f410c7',

            subscribeKey: 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0',
            publishKey: 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056',
            userId: UserId('myUniqueUserId')));

    // Subscribe to a channel
    print('channel: ' + channel);
    // var channel = "test_chan";
    var subscription = pubnub.subscribe(channels: {channel});

    // Print every message
    subscription.messages.listen((message) async {
      // print(message.content['poster']);
      // print(message.content.runtimeType);
      Map<String, dynamic> payload = {
        'poster': String,
        'name': String,
        'ts': String,
        'type': String
      };
      // var response = jsonDecode(message.content) as Map<String, dynamic>;
      // print(response['poster']);
      if (message.content['type'] == 'deadline' ||
          message.content['type'] == 'reminder' &&
              message.content['action_initiator'][0] == 'A') {
        payload['poster'] = message.content['poster'];
        payload['name'] = message.content['name'];
        payload['ts'] = message.content['timestamp'];
        payload['type'] = message.content['type'];
        // print(payload);
        setMessage = payload;

        messages.addFirst(payload);
      }
      print(messages);
      print(messages.length);

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

      // messages.forEach((element) async {
      //   await Future.delayed(Duration(seconds: 5));
      //   print(element);
      // });'

      // for (int i = 0; i < messages.length; i++) {
      //     await Future.delayed(Duration(seconds: 10));
      //     print(messages.first);
      //   }

      for (Map<String, dynamic> item in messages) {
        await Future.delayed(Duration(seconds: 2)).then((_) => print(item));
        // print(messages.first);
      }

      // while (messages.isEmpty == false) {
      //   await Future.delayed(Duration(seconds: 10));
      //   print(messages.first);
      // }
    });

    // // Unsubscribe and quit
    // await subscription.dispose();
  }
}
