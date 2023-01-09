import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:pubnub/pubnub.dart';

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

    String message = '';
    String get getMessage => message;
    set setMessage(String value) {
      message = value;
      notifyListeners();
    }

    var message2;
    get getMessage2 => message;
    set setMessage2(value) {
      message = value;
      notifyListeners();
    }

    Future<dynamic> getDataFromPubNub() async {  
  
    // Create PubNub instance with default keyset.
    var pubnub = PubNub(
      defaultKeyset: Keyset(
      subscribeKey: 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0',
      publishKey: 'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056',
      userId: UserId('myUniqueUserId')));

    // Subscribe to a channel
    var channel = "XXX";
    var subscription = pubnub.subscribe(channels: {channel});

    // Print every message
    subscription.messages.listen((message) {
      // print(message.content["poster"]);
      print(message.content.runtimeType);
      Map<String, dynamic> qweqwe = {
        'poster': String,

      };
      var response = jsonDecode(message.content);
      qweqwe['poster'] = response['poster'];
      // print(response['poster']);
      // setMessage = 'msgr';
      // setMessage2 = response;
      // print('SLJWRLK;HJWRLKHJWRHJWRLHJWRKLH$getMessage2');
    });

    // // Unsubscribe and quit
    // await subscription.dispose();
  }
}