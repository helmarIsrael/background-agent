import 'package:shared_preferences/shared_preferences.dart';

setVisitingFlag(username) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setBool("alreadyLoggedIn", true);
  prefs.setString("loggedUser", username);
}

getVisitingFlag() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  bool alreadyLoggedIn = prefs.getBool("alreadyLoggedIn") ?? false;
  String loggedUser = prefs.getString("loggedUser") ?? "no user";
  Map session_data = {'user': loggedUser, 'status': alreadyLoggedIn};
  return session_data;
}
