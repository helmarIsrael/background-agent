import 'package:sms_server/utils/message_handler.dart';
import '../utils/globals.dart' as globals;

class msg_sender {
  final handle = msgHandler();
  Future<void> send_messages(int finalNum) async {
    while (true) {
      var msgs = globals.objectBoxService.getAllMessages();
      if (msgs.length < 0) {
        final handle = msgHandler();
        for (var element in msgs) {
          var msg = element?.payload;
          handle.addtoQueue(msg);
        }
      }
      handle.sendMsg();
    }
    // int _count = 0;
    // print("isolate (send_messages) runnning....");
    // for (var i = 0; i < finalNum; i++) {
    //   await Future.delayed(Duration(seconds: 3), () {});
    //   _count++;
    //   print("in isolate: ${_count.toString()}");
    // }
  }
}
