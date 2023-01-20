// import 'package:flutter_sms/flutter_sms.dart';
// import 'package:telephony/telephony.dart';
import 'dart:io';
import 'package:background_sms/background_sms.dart';
// import 'package:sms/sms.dart';

// import 'package:url_launcher/url_launcher.dart';
// import 'package:url_launcher/url_launcher_string.dart';

// void send_sms(String message, List<String> recipents) async {
//   var _result = sendSMS(message: message, recipients: recipents);
//   bool canSend = await canSendSMS();

//   print('Device Status: $canSend');
//   print(_result);
// }

// void url_sendSms(String message, List recipients) async {
//   // String get; separator => isCupertino() ? '&' : '?';
//   try {
//     if (Platform.isAndroid) {
//       String numbers = recipients.join(';');
//       print(recipients[0]);
//       var paeng = '09050262036';
//       print(numbers);
//       final _body = Uri.encodeComponent(message);
//       var url = 'sms:${paeng}?body=${message}';
//       // final Uri url = Uri(
//       //     scheme: 'sms',
//       //     path: '+639050262036',
//       //     queryParameters: <String, String>{
//       //       'body': Uri.encodeComponent(message)
//       //     });
//       var status = await launch(url);
//       print(status);
//     }
//   } catch (e) {
//     print(e);
//   }
// }

// void tele_sendSMS(String message, List recipients) {
//   final Telephony telephony = Telephony.instance;
//   telephony.sendSms(to: recipients[0], message: message);
// }

// void sms_smsSender(String message, List recipients) {
//   final SmsSender sender = new SmsSender();
//   SmsMessage sms = new SmsMessage('09953781651', 'Hello flutter!');
//   sms.onStateChanged.listen((state) {
//     if (state == SmsMessageState.Sent) {
//       print("SMS is sent!");
//     } else if (state == SmsMessageState.Delivered) {
//       print("SMS is delivered!");
//     }
//   });
//   sender.sendSms(sms);
// }

Future<void> back_smsSender(String message, List recipients) async {
  var result = await BackgroundSms.sendMessage(
      phoneNumber: '09953781651', message: message, simSlot: 2);
  if (result == SmsStatus.sent) {
    print("Sent");
  } else {
    print("Failed");
  }
}
