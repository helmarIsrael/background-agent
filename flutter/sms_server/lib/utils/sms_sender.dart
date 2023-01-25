// import 'package:background_sms/background_sms.dart';
import 'package:flutter_sms/flutter_sms.dart';
import 'dart:convert' show utf8;
import 'package:sms_advanced/sms_advanced.dart';

import 'dart:io';

// import 'package:sms_maintained/sms.dart';

// import 'package:url_launcher/url_launcher.dart';

// import 'package:sms/sms.dart';

// import 'package:url_launcher/url_launcher.dart';

void send_sms(String message, List<String> recipents) async {
  var _result =
      sendSMS(message: message, recipients: recipents, sendDirect: true);
  bool canSend = await canSendSMS();

  print('Device Status: $canSend');
  print(_result);

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

// void url_sendSms(String message, List recipients) async {
//   try {
//     if (Platform.isAndroid) {
//       String numbers = recipients.join(';');
//       // print(recipients[0]);
//       var paeng = '09953781651';
//       // print(numbers);

//       var url = Uri.parse('sms:${numbers}?body=${message}');

//       if (await canLaunchUrl(url)) {
//         await launchUrl(url);
//       } else {
//         throw 'Could not launc $url';
//       }
//       // final Uri url = Uri(
//       //     scheme: 'sms',
//       //     path: '+639050262036',
//       //     queryParameters: <String, String>{
//       //       'body': Uri.encodeComponent(message)
//       //     });
//       // var status = await launch(url);
//       // print(status);
//     }
//   } catch (e) {
//     print(e);
//   }

//   // final Uri smsLaunchUri = Uri(
//   //   scheme: 'sms',
//   //   path: recipients,
//   //   queryParameters: <String, String>{
//   //     'body': Uri.encodeComponent(message),
//   //   },
//   // );

//   // launchUrl(smsLaunchUri);
// }

// void tele_sendSMS(String message, List recipients) {
//   final Telephony telephony = Telephony.instance;
//   telephony.sendSms(to: recipients[0], message: message);
// }

void sms_smsSender(String message, List recipients) {
  SmsSender sender = new SmsSender();
  String numbers = recipients.join(';');
//       print(recipients[0]);
  String address = '${numbers}';
  print(numbers);
  SmsMessage sms = new SmsMessage(address, message);
  sms.onStateChanged.listen((state) {
    if (state == SmsMessageState.Sent) {
      print("SMS is sent!");
    } else if (state == SmsMessageState.Delivered) {
      print("SMS is delivered!");
    }
  });
  sender.sendSms(sms);
}

// Future<void> back_smsSender(String message, List recipients) async {
//   var result = await BackgroundSms.sendMessage(
//       phoneNumber: '09953781651', message: message, simSlot: 2);
//   if (result == SmsStatus.sent) {
//     print("Sent");
//   } else {
//     print("Failed");
//   }
// }

// void back_sendSms(String message, List recipients) async {
//   var result = await BackgroundSms.sendMessage(
//       phoneNumber: recipients[0], message: message);
//   if (result == SmsStatus.sent) {
//     print("Sent");
//   } else {
//     print("Failed");
//   }
// }

void ad_sendSms(String sms, List receipients) async {
  // SimCardsProvider provider =
  // new SimCardsProvider();
  // List<SimCard> card =
  // await provider.getSimCards();
  // print(card);

  SmsSender sender = SmsSender();

  SmsMessage message = SmsMessage(receipients[0], sms);
  // await Future.delayed(
  //     Duration(seconds: 3), () {});
  message.onStateChanged.listen((state) {
    print(state);
    if (state == SmsMessageState.Sent) {
      print("SMS is sent!");
    } else if (state == SmsMessageState.Delivered) {
      print("SMS is delivered!");
    }
  });
  sender.sendSms(message);
  // sender.onSmsDelivered.listen((event) {
  //   print(event);
  // });
}
