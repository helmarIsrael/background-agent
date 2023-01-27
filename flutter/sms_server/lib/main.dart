import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/messages.dart';
import 'package:sms_server/pages/viewMsg.dart';
import 'package:sms_server/pages/splash.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/wrapper.dart';
import 'package:sms_server/provider/login_provider.dart';
import 'package:sms_server/provider/pubnub_provider.dart';
import 'package:sms_server/provider/sent_msgs_provider.dart';
import 'package:sms_server/provider/ui_providers/splash_provider.dart';

import '../utils/globals.dart' as globals;
import 'model_helper/helper.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // DartPluginRegistrant.ensureInitialized();
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    globals.objectBoxService = await ObjectBoxService.init();
  });

  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]).then(
    (_) => runApp(MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PubNubProvider()),
        ChangeNotifierProvider(create: (_) => SplashProvider()),
        ChangeNotifierProvider(create: (_) => LoginProvider()),
        ChangeNotifierProvider(create: (_) => SentMessagesProvider()),
      ],
      child: MaterialApp(
        initialRoute: '/',
        routes: {
          '/': (context) => const splash(),
          '/viewMsg': (context) => viewMsg(
                msg_id: 0,
              ),
          '/wrapper': (context) => const Wrapper(),
          '/home': (context) => const home(),
          '/messages': (context) => const messages()
        },
      ),
    )),
  );
}
