import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

enum LoginStatus { Uninitialized, Authorized, Unauthorized }

class LoginProvider extends ChangeNotifier {
  LoginStatus _loggedInStatus = LoginStatus.Uninitialized;
  LoginStatus get getLoggedInStatus => _loggedInStatus;
  set setLoggedInStatus(LoginStatus value) {
    _loggedInStatus = value;
    notifyListeners();
  }

  Future<void> verify(String username, String password) async {
    var str = utf8.encode(password);
    Digest digest = sha1.convert(str);

    setLoggedInStatus = LoginStatus.Uninitialized;

    // objectBoxService = await ObjectBoxService.init();

    Codec<String, String> loginToBase64 = utf8.fuse(base64);
    String creds = "$username:$digest";
    String encoded_cred = loginToBase64.encode(creds);

    try {
      final response = await http.get(
        Uri.parse(AppUrl.authURL),
        headers: {
          "Authorization": "Basic $encoded_cred",
        },
      );

      if (response.statusCode == 200) {
        print(response.body.runtimeType);
        var res = jsonDecode(response.body);
        // User getUserData = User.fromJson(res); MOOOOODEEEEEEL
        // setUser = getUserData;
      }
    } on SocketException {
      print('no internet');
    } on HttpException {
      print('Could not find the post');

      setLoggedInStatus = LoginStatus.Unauthorized;
    } on FormatException {
      print('Bad response');

      setLoggedInStatus = LoginStatus.Unauthorized;
    }
  }
}
