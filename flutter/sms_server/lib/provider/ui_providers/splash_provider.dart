import 'package:flutter/cupertino.dart';
import 'package:flutter_sms/flutter_sms.dart';
import 'package:sms_server/utils/sms_sender.dart' as sms;

enum SplashStatus {
  splashIsLoaded,
  splashUninitialized,
  deviceCantSend,
  deviceCanSend
}

class SplashProvider extends ChangeNotifier {
  SplashStatus splashStatus = SplashStatus.splashUninitialized;
  SplashStatus get getSplashStatus => splashStatus;
  set setSplashStatus(SplashStatus value) {
    splashStatus = value;
    notifyListeners();
  }

  SplashStatus canSendStatus = SplashStatus.deviceCantSend;
  SplashStatus get getCanSendStatus => canSendStatus;
  set setCanSendStatus(SplashStatus value) {
    canSendStatus = value;
    notifyListeners();
  }

  void toLoadSplash() async {
    var canSend_status = await canSendSMS();
    if (canSend_status == true) {
      setCanSendStatus = SplashStatus.deviceCanSend;
    }
    await Future.delayed(Duration(seconds: 1), () {
      setSplashStatus = SplashStatus.splashIsLoaded;
    });
  }
}
