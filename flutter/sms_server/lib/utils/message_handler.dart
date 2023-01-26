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

  Future<void> sendMsg(Box<messageDetail> store) async {
    bool qstatus = messages_queue.queueStatus();
    int id = 0;

    var msgs = store.getAll();
    print('  ');
    print('Current Message Count: ${msgs.length}');
    if (msgs.length > 0) {
      int get_first = msgs[0].id;
      print('Message id: ${get_first}');
      print('Message: ${store.get(get_first)?.payload.runtimeType}');
      String msg = store.get(get_first)!.payload;
      try {
        if (get_first % 2 == 0) {
          //error ni kunuhay
          // Simulation of an error on Sending
          // itry balik ug send
          await Future.delayed(Duration(seconds: 10), () {});
          store.remove(get_first);
        } else {
          store.remove(get_first);
        }

        // String clean_msg = msg.replaceAll(new RegExp(r'[^\w\s]+'), '');
        // List<String> nums = ['09763189903', '09050262036'];
        // var isSent = sms.send_sms(clean_msg, nums);
        // if (isSent == 'SMS Sent!') {
        //   store.remove(get_first);
        // } else {
        //   await Future.delayed(Duration(seconds: 10), () {});
        //   var isSent = sms.send_sms(clean_msg, nums);
        //   store.remove(get_first);
        // }

        print('Remaining Messages Count: ${msgs.length}');
        // }
      } catch (e) {
        print("Error $e");
      }
    } else {
      print("no message to sent");
    }
  }
}
