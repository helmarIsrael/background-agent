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

  var userDetails;
  get getUserDetails => userDetails;
  set setUserDetails(value) {
    userDetails = value;
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
    const String baseUrl = 'https://www.myeskwela.ph';
    const String authUrl = baseUrl + '/auth';

    try {
      final response = await http.get(
        Uri.parse(authUrl),
        headers: {
          "Authorization": "Basic $encoded_cred",
        },
      );

      if (response.statusCode == 200) {
        // print(response.body.runtimeType);
        var res = jsonDecode(response.body);
        // print(res['userschool']['id']);
        Map<String, dynamic> user_details = {
          'name': String,
          'school': String,
          'school_id': String,
          'district': String,
          'division': String,
          'contact_numbers': List<dynamic>
        };

        user_details['name'] = res['userdetails']['name'];
        user_details['school'] = res['userschool']['name'];
        user_details['school_id'] = res['userschool']['id'];
        user_details['district'] = res['userschool']['district'];
        user_details['division'] = res['userschool']['division'];
        user_details['contact_numbers'] = [
          '09171148868',
          '09050262036',
        ];

        setUserDetails = user_details;
        // print(getUserDetails['school_id']);
        setLoggedInStatus = LoginStatus.Authorized;
        // User getUserData = User.fromJson(res); MOOOOODEEEEEEL
        // setUser = getUserData;
      } else {
        setLoggedInStatus = LoginStatus.Unauthorized;
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
