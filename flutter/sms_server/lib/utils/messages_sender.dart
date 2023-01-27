import 'package:sms_server/utils/message_handler.dart';
import '../objectbox.g.dart';
import '../utils/globals.dart' as globals;
import '../model/message_model.dart';

// class msg_sender {
//   final handle = msgHandler();
//   void send_messages(Box<messageDetail> store) {
//     var msgs = store.getAll();
//     print(msgs.length);
//     if (msgs.length > 0) {
//       for (var element in msgs) {
//         var msg = element.payload;
//         handle.addtoQueue(msg);
//         handle.showQueueSize();
//       }
//     }
//     handle.sendMsg();

//     // int _count = 0;
//     // print("isolate (send_messages) runnning....");
//     // for (var i = 0; i < finalNum; i++) {
//     //   await Future.delayed(Duration(seconds: 3), () {});
//     //   _count++;
//     //   print("in isolate: ${_count.toString()}");
//     // }
//   }
// }
