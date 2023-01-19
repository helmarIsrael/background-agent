// import 'package:flutter_sms/flutter_sms.dart';
// import 'package:telephony/telephony.dart';
import 'dart:io';

import 'package:url_launcher/url_launcher.dart';
// import 'package:url_launcher/url_launcher_string.dart';

// void send_sms(String message, List<String> recipents) async {
//   var _result = sendSMS(message: message, recipients: recipents);
//   bool canSend = await canSendSMS();

//   print('Device Status: $canSend');
//   print(_result);
// }

void url_sendSms(String message, List recipients) async {
  // String get; separator => isCupertino() ? '&' : '?';
  try {
    if (Platform.isAndroid) {
      String numbers = recipients.join(';');
      print(recipients[0]);
      var paeng = '+639050262036';
      print(numbers);
      final _body = Uri.encodeComponent(message);
      var url = 'sms:${paeng}?body=${message}';
      // final Uri url = Uri(
      //     scheme: 'sms',
      //     path: '+639050262036',
      //     queryParameters: <String, String>{
      //       'body': Uri.encodeComponent(message)
      //     });
      var status = await launch(url);
      print(status);
    }
  } catch (e) {
    print(e);
  }
}

// void tele_sendSMS(String message, List recipients) {
//   final Telephony telephony = Telephony.instance;
//   telephony.sendSms(to: recipients[0], message: message);
// }
