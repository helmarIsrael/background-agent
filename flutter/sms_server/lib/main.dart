import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/splash.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/provider/pubnub_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]).then(
    (_) => runApp(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => PubNubProvider()),
        ],
        child: MaterialApp(
        initialRoute: '/',
        routes: {
          '/': (context) => const splash(),
          '/home': (context) => const home(),
        },
          ),
      )),
  );
}
