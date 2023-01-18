import 'package:flutter_sms/flutter_sms.dart';

void send_sms(String message, List<String> recipents) async {
  String _result =
      await sendSMS(message: message, recipients: recipents, sendDirect: false);
  bool canSend = await canSendSMS();

  print('Device Status: $canSend');
  print(_result);
}
