// import 'package:background_sms/background_sms.dart';
import 'dart:ffi';

import 'package:flutter_sms/flutter_sms.dart';

import 'dart:io';

Future<String> send_sms(String message, List<String> recipents) async {
  String result =
      await sendSMS(message: message, recipients: recipents, sendDirect: true);

  // bool canSend = await canSendSMS();

  return result;
}

Future<bool> check_canSend() async {
  bool canSend = await canSendSMS();

  return canSend;
}
