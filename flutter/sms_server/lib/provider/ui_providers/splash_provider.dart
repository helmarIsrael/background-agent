import 'package:flutter/cupertino.dart';

enum SplashStatus { splashIsLoaded, splashUninitialized }

class SplashProvider extends ChangeNotifier {
  SplashStatus splashStatus = SplashStatus.splashUninitialized;
  SplashStatus get getSplashStatus => splashStatus;
  set setSplashStatus(SplashStatus value) {
    splashStatus = value;
    notifyListeners();
  }

  void toLoadSplash() async {
    await Future.delayed(Duration(seconds: 1), () {
      setSplashStatus = SplashStatus.splashIsLoaded;
    });
  }
}
