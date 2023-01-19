import 'package:flutter_sms/flutter_sms.dart';

void send_sms(String message, List<String> recipents) async {
  var _result = sendSMS(message: message, recipients: recipents);
  bool canSend = await canSendSMS();

  print('Device Status: $canSend');
  print(_result);
}

// import 'dart:io';

// import 'package:url_launcher/url_launcher.dart';

// void send_sms(String message, List recipients) async {
//   // String get; separator => isCupertino() ? '&' : '?';
//   try {
//     if (Platform.isAndroid) {
//       String numbers = recipients.join(';');
//       print(numbers);
//       var url = 'sms:/open?addresses=${recipients}?body=$message';
//       var status = await launch(url);
//       print(status);
//     }
//   } catch (e) {
//     print(e);
//   }
// }
