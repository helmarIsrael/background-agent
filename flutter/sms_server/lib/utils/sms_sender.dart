// import 'package:flutter_sms/flutter_sms.dart';

import 'dart:isolate';
import 'package:sms/sms.dart';

void send_sms(String message, String recipents) async {
  // String _result =
  //     await sendSMS(message: message, recipients: recipents, sendDirect: true);
  // bool canSend = await canSendSMS();
  // final SmsSendStatusListener listener = (SendStatus status) {
  //   print(status);
  // };
  // telephony.sendSms(to: recipents, message: message, statusListener: listener);

  SmsSender sender = new SmsSender();
  String address = recipents;

  SmsMessage message = new SmsMessage(address, 'Hello flutter!');
  message.onStateChanged.listen((state) {
    if (state == SmsMessageState.Sent) {
      print("SMS is sent!");
    } else if (state == SmsMessageState.Delivered) {
      print("SMS is delivered!");
    }
  });

  sender.sendSms(message);

  // print('Device Status: $canSend');
  // print(_result);
}
