import 'dart:convert';
import 'package:sms_server/objectbox.g.dart';

import '../model/message_model.dart';
import '../utils/globals.dart' as globals;
import 'message_queue.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

import '../utils/sms_sender.dart' as sms;

class msgHandler {
  final messages_queue = msg_queue<Map>();

  void addtoQueue(msg) {
    Map decoded = json.decode(msg);
    messages_queue.push(decoded);
    // print('Message Queue Size: ${messages_queue.queueSize()}');
  }

  void showMsgQueue() {
    messages_queue.showQueue();
  }

  int showQueueSize() {
    return messages_queue.queueSize();
  }

  Future<void> sendMsg() async {
    bool qstatus = messages_queue.queueStatus();
    int id = 0;

    var store = globals.objectBoxService;

    var msgs = store.getAllMessages();
    print('  ');
    print('Current Message Count: ${msgs.length}');
    if (msgs.length > 0) {
      int get_first = msgs[0].id;
      print('Message id: ${get_first}');
      print('Message: ${store.getMessage(get_first)?.payload.runtimeType}');
      Map msg = json.decode(store.getMessage(get_first)!.payload);
      String message = msg['poster'];
      try {
        // store.remove(get_first);
        // print('Remaining Messages Count: ${msgs.length}');

        String clean_msg = message.replaceAll(new RegExp(r'[^\w\s]+'), '');
        // print(clean_msg);
        List<String> nums = ['09763189903', '09050262036'];
        var isSent = sms.send_sms(clean_msg, nums);
        print(isSent);
        store.deleteMessage(get_first);
        print('Remaining Messages Count: ${msgs.length}');
        //else {
        //   await Future.delayed(Duration(seconds: 10), () {});
        //   var isSent = sms.send_sms(clean_msg, nums);
        //   store.remove(get_first);
        // }

        // }
      } catch (e) {
        print("Error $e");
      }
    } else {
      print("no message to sent");
    }
  }
}
