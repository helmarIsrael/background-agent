// import 'package:background_sms/background_sms.dart';
import 'dart:ffi';

import 'package:flutter/services.dart';
import 'package:flutter_sms/flutter_sms.dart';

import 'dart:io';

// import 'package:sms_maintained/sms.dart';

import 'package:sms_advanced/sms_advanced.dart';
// import 'package:sms_autofill/sms_autofill.dart';

Future<String> send_sms(String message, List<String> recipents) async {
  String result =
      await sendSMS(message: message, recipients: recipents, sendDirect: true);

  // bool canSend = await canSendSMS();

  return result;
}

// getPhoneNumber() async {
//   try {
//     final autoFill = SmsAutoFill();
//     final phone = await autoFill.hint;
//     if (phone == null) return;
//     print(phone);
//   } on PlatformException catch (e) {
//     print('Failed to get mobile number because of: ${e.message}');
//   }
// }

// send_sms(String msg, List<String> recipents) {
//   // bool status = false;
//   // print('asd');
//   SmsSender sender = new SmsSender();
//   String address = recipents.join(';');
//   print(address);
//   SmsMessage message = new SmsMessage(address, msg);
//   message.onStateChanged.listen((state) async {
//     if (state == SmsMessageState.Sending) {
//       print('Sending');
//     } else if (state == SmsMessageState.Sent) {
//       print("SMS is sent!");
//     } else if (state == SmsMessageState.Delivered) {
//       print("SMS is delivered!");
//       // status = true;
//     }
//   });
//   sender.sendSms(message);

//   // return status;
// }

Future<bool> check_canSend() async {
  bool canSend = await canSendSMS();

  return canSend;
}
