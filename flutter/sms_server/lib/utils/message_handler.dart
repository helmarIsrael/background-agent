import 'dart:convert';
import '../utils/globals.dart' as globals;
import 'message_queue.dart';

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

  void sendMsg() async {
    bool qstatus = messages_queue.queueStatus();
    int id = 0;
    while (!qstatus) {
      id++;
      qstatus = messages_queue.queueStatus();
      if (qstatus) {
        print("Queue Empty: All Messages Sent");
        break;
      }
      await Future.delayed(Duration(seconds: 10), () {});
      print('Item Send: ${messages_queue.pop()}');
      globals.objectBoxService.deleteMessage(id);
      print(messages_queue.queueSize());

      // globals.objectBoxService.deleteMessage(id);
    }
    ;
  }
}
