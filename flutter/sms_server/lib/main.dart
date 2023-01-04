import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/splash.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]).then(
    (_) => runApp(MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => const splash(),
        '/home': (context) => const home(),
      },
    )),
  );
}
