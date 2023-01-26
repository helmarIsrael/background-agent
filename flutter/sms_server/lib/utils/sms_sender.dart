// import 'package:background_sms/background_sms.dart';
import 'dart:ffi';

import 'package:flutter_sms/flutter_sms.dart';

import 'dart:io';

Future<String> send_sms(String message, List<String> recipents) async {
  String _result =
      await sendSMS(message: message, recipients: recipents, sendDirect: true)
          .catchError((onError) {
    print(onError);
  });

  // bool canSend = await canSendSMS();

  return _result;

  //Uint8List to String
  // var bytes = utf8.encode(message);

// //String to Uint8List
//   String s = utf8.decode(bytes.toList());
//   print(s);
//   var result = await sendSMS(message: bytes, recipients: recipents)
//       .catchError((onError) {
//     print(onError);
//   });
//   print(result);
}

bool check_canSend() {
  bool canSend = canSendSMS() as bool;
  return canSend;
}
