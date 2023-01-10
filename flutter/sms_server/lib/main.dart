import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/messages.dart';
import 'package:sms_server/pages/splash.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/wrapper.dart';
import 'package:sms_server/provider/login_provider.dart';
import 'package:sms_server/provider/pubnub_provider.dart';
import 'package:sms_server/provider/ui_providers/splash_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]).then(
    (_) => runApp(MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PubNubProvider()),
        ChangeNotifierProvider(create: (_) => SplashProvider()),
        ChangeNotifierProvider(create: (_) => LoginProvider()),
      ],
      child: MaterialApp(
        initialRoute: '/',
        routes: {
          '/': (context) => const home(),
          '/messages': (context) => const messages(),
          '/wrapper': (context) => const Wrapper(),
          '/home': (context) => const splash()
        },
      ),
    )),
  );
}
