import 'dart:convert';

import 'package:flutter/cupertino.dart';
import '../utils/globals.dart' as globals;

class SentMessagesProvider extends ChangeNotifier {
  late List sent_messages;
  get getsentMessages => sent_messages;
  set setSentMessages(value) {
    sent_messages = value;
    notifyListeners();
  }

  var sent_message;
  get getSentMessage => sent_message;
  set setSentMessage(value) {
    sent_message = value;
    notifyListeners();
  }

  var sent_messageCount;
  get getSentMessageCount => sent_messageCount;
  set setSentMessageCount(value) {
    sent_messageCount = value;
    notifyListeners();
  }

  void get_sentMessages() {
    setSentMessages = globals.objectBoxService.sent_getAllMessages();
  }

  void get_sentMessage(id) {
    setSentMessage = globals.objectBoxService.sent_getMessage(id);
  }

  void get_sentMessageCount() {
    if (globals.objectBoxService.sent_countMessages() == 0) {
      setSentMessageCount = 0;
    } else {
      setSentMessageCount = globals.objectBoxService.sent_countMessages();
    }
  }
}
