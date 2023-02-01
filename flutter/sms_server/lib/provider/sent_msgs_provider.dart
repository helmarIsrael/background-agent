import 'dart:async';
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

  var sent_oldMessageCount;
  get getSent_oldMessageCount => sent_oldMessageCount;
  set setSent_oldMessageCount(value) {
    sent_oldMessageCount = value;
    notifyListeners();
  }

  var loading = true;
  get getLoadingStatus => loading;
  set setLoadStatus(value) {
    loading = value;
    notifyListeners();
  }

  var msgLoading = true;
  get getMsgLoadingStatus => msgLoading;
  set setMsgLoadStatus(value) {
    msgLoading = value;
    notifyListeners();
  }

  var msgsLoading = true;
  get getMsgsLoadingStatus => msgsLoading;
  set setMsgsLoadingStatus(value) {
    msgsLoading = value;
    notifyListeners();
  }

  void get_sentMessages() {
    // Timer(const Duration(seconds: 10), () {});
    setMsgsLoadingStatus = false;
    setSentMessages =
        globals.objectBoxService.sent_getAllMessages().reversed.toList();
  }

  void get_sentMessage(id) {
    setMsgLoadStatus = false;
    setSentMessage = globals.objectBoxService.sent_getMessage(id);
  }

  void get_oldSentMessageCount() {
    if (globals.objectBoxService.sent_countMessages() == 0) {
      setLoadStatus = false;
      setSent_oldMessageCount = 0;
    } else {
      setLoadStatus = false;
      setSent_oldMessageCount = globals.objectBoxService.sent_countMessages();
    }
  }

  void get_sentMessageCount() {
    int count = 0;
    var msgs = globals.objectBoxService.sent_getAllMessages();

    for (int i = 0; i < msgs.length; i++) {
      if (msgs[i].timestamp.toString() == DateTime.now().toString()) {
        count++;
      }
    }

    setLoadStatus = false;
    setSentMessageCount = count;
    ;
  }
}
