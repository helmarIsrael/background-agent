import 'dart:async';
// import 'dart:js_util';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

class ConnectionProvider extends ChangeNotifier {
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription _streamSubscription;

  String status = 'waiting...';
  String get getStatus => status;
  set setStatus(String value) {
    status = value;
    notifyListeners();
  }

  bool _wasJustOffline = false;
  bool get getWasJustOffline => _wasJustOffline;
  set setWasJustOffline(bool value) {
    _wasJustOffline = value;
    notifyListeners();
  }

  bool _isConnectedToEthernet = false;
  bool get getIsConnectedToEthernet => _isConnectedToEthernet;
  set setIsconnectedToEthernet(bool value) {
    _isConnectedToEthernet = value;

    notifyListeners();
  }

  bool _isConnectedToWifi = false;
  bool get getIsConnectedToWifi => _isConnectedToWifi;
  set setIsconnectedToWifi(bool value) {
    _isConnectedToWifi = value;

    notifyListeners();
  }

  bool _isConnectedToMobileData = false;
  bool get getIsConnectedToMobileData => _isConnectedToMobileData;
  set setIsconnectedToMobileData(bool value) {
    _isConnectedToMobileData = value;
    notifyListeners();
  }

  bool _isConnectedToInternet = false;
  bool get getIsConnectedToInternet => _isConnectedToInternet;
  set setIsconnectedToInternet(bool value) {
    _isConnectedToInternet = value;
    notifyListeners();
  }

  void checkConnectivity() async {
    var connectionResult = await _connectivity.checkConnectivity();
    if (connectionResult == ConnectivityResult.mobile) {
      setStatus = "Connected to MobileData";
      setIsconnectedToMobileData = true;
    } else if (connectionResult == ConnectivityResult.wifi) {
      setStatus = "Connected to Wifi";
      setIsconnectedToWifi = true;
    } else if (connectionResult == ConnectivityResult.ethernet) {
      setStatus = "Connected to WIfi";
      setIsconnectedToEthernet = true;
    } else {
      // print('check conn');
      setStatus = "Offline";
      setIsconnectedToEthernet = false;
      setIsconnectedToWifi = false;
      setIsconnectedToMobileData = false;
      setIsconnectedToInternet = false;
      setWasJustOffline = true;
    }
  }

  void checkRealtimeConnection() {
    _streamSubscription = _connectivity.onConnectivityChanged.listen((event) {
      switch (event) {
        case ConnectivityResult.mobile:
          {
            setStatus = "Connected to MobileData";
            setIsconnectedToMobileData = true;
          }
          break;
        case ConnectivityResult.wifi:
          {
            setStatus = "Connected to Wifi";
            setIsconnectedToWifi = true;
          }
          break;
        case ConnectivityResult.ethernet:
          {
            setStatus = "Connected to WIfi";
            setIsconnectedToEthernet = true;
          }
          break;
        default:
          {
            setStatus = "Offline";
            setIsconnectedToEthernet = false;
            setIsconnectedToWifi = false;
            setIsconnectedToMobileData = false;
            setIsconnectedToInternet = false;
            // setWasJustOffline = true;
          }
          break;
      }
    });
  }

  void setToUncheckWasJustOffline() {
    if (getWasJustOffline == true) {
      setWasJustOffline = false;
    }
  }
}
