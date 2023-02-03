import 'dart:convert';
import 'package:sms_server/objectbox.g.dart';

import '../model/message_model.dart';
import '../model/sentSMS_model.dart';

import '../utils/globals.dart' as globals;
import 'message_queue.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

import '../utils/sms_sender.dart' as sms;

class msgHandler {
  Future<void> sendMsg(List<String> nums) async {
    int id = 0;
    // print('nums: ${nums}');
    var store = globals.objectBoxService;

    var msgs = store.getAllMessages();
    var sent_msgs = store.sent_getAllMessages();
    print('  ');
    print('Current Message Count: ${msgs.length}');
    if (msgs.length > 0) {
      int get_first = msgs[0].id;
      print('Message id: ${get_first}');
      // print('Message: ${store.getMessage(get_first)?.payload.runtimeType}');
      var raw_msg = store.getMessage(get_first)!.payload;
      Map msg = json.decode(raw_msg);
      print(msg);
      String message = msg['text'];
      try {
        String clean_msg = message.replaceAll(new RegExp(r'[^\w\s]+'), '');
        // print(clean_msg);
        // List<String> nums = ['09763189903', '09050262036'];

        var isSent = await sms.send_sms(clean_msg, nums);
        print(isSent);
        store.sent_insertMessage(sentSMSDetail(
            payload: raw_msg, timestamp: DateTime.now().toString()));
        store.deleteMessage(get_first);
        print('Remaining Messages Count: ${msgs.length}');
        print('Sent Messages Count: ${sent_msgs.length}');
      } catch (e) {
        print("Error $e");
      }
    } else {
      print('Sent Messages Count: ${sent_msgs.length}');
      print("no message to sent");
    }
  }
}
