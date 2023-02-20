import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:sms_server/utils/secure_userdetails.dart';

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
        final cred_sec_user = await CredsSecureStorage.getUsername() ?? '';
        final cred_sec_pass = await CredsSecureStorage.getUserPass() ?? '';

        if (cred_sec_user != username && cred_sec_pass != password) {
          CredsSecureStorage.deleteUsername();
          CredsSecureStorage.deleteUserPass();
          CredsSecureStorage.setUsername(username);
          CredsSecureStorage.setUserPass(password);
        }

        // save username and pass to secure storge
        // print(response.body.runtimeType);
        var res = jsonDecode(response.body);
        // print(res['userschool']['id']);
        Map<String, dynamic> user_details = {
          'name': String,
          // 'personnumid': String,
          'school': String,
          'school_id': String,
          'district': String,
          'division': String,
          'contact_numbers': List<dynamic>,
          'usertype': String
        };

        if (res['usertype'] == 'admin') {
          user_details['name'] = res['userdetails']['name'];
          // userDetails['personnumid'] = res['personnumid'];
          user_details['school'] = res['userschool']['name'];
          user_details['school_id'] = res['userschool']['id'];
          user_details['district'] = res['userschool']['district'];
          user_details['division'] = res['userschool']['division'];
          user_details['contact_numbers'] = [
            '09953781651',
            '09050262036',
          ];
          user_details['usertype'] = res['usertype'];

          setUserDetails = user_details;
          // print(getUserDetails['school_id']);
          setLoggedInStatus = LoginStatus.Authorized;
          // User getUserData = User.fromJson(res); MOOOOODEEEEEEL
          // setUser = getUserData;

        } else {
          setLoggedInStatus = LoginStatus.Unauthorized;
        }
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
