import 'dart:convert';
import 'package:sms_server/objectbox.g.dart';

import '../model/message_model.dart';
import '../utils/globals.dart' as globals;
import 'message_queue.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

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
    // while (!qstatus) {
    //   id++;
    //   qstatus = messages_queue.queueStatus();
    //   if (qstatus) {
    //     print("Queue Empty: All Messages Sent");
    //     break;
    //   }
    //   // await Future.delayed(Duration(seconds: 10), () {});
    //   print('Item Send: ${messages_queue.pop()}');
    //   // messages_queue.pop();
    //   store.remove(id);
    //   print(messages_queue.queueSize());

    //   // globals.objectBoxService.deleteMessage(id);
    // }
    var msgs = store.getAll();
    print('  ');
    print('Current Message Count: ${msgs.length}');
    if (msgs.length > 0) {
      int get_first = msgs[0].id;
      print('Message id: ${get_first}');
      print('Message: ${store.get(get_first)?.payload.runtimeType}');
      String msg = store.get(get_first)!.payload;

      // write(String text) async {
      //   final Directory directory = await getApplicationDocumentsDirectory();
      //   final File file = File('${directory.path}/my_file.txt');
      //   file.writeAsString(text, mode: FileMode.append);
      // }

      // write(msg);
      try {
        if (get_first % 2 == 0) {
          //error ni kunuhay
          // Simulation of an error on Sending
          // itry balik ug send
          await Future.delayed(Duration(seconds: 10), () {});
          store.remove(get_first);
        } else {
          store.remove(get_first);
          print('Remaining Messages Count: ${msgs.length}');
        }
      } catch (e) {
        print("Error $e");
      }
    } else {
      print("no message to sent");
    }
  }
}
