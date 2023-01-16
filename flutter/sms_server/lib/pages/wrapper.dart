import 'dart:async';
import 'dart:isolate';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/basic.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/viewMsg.dart';
import 'package:sms_server/pages/splash.dart';
import 'package:sms_server/provider/pubnub_provider.dart';
import 'package:sms_server/utils/message_sender.dart';

import '../provider/login_provider.dart';

// import '../utils/globals.dart' as globals;

class Wrapper extends StatefulWidget {
  const Wrapper({super.key});

  @override
  State<Wrapper> createState() => _WrapperState();
}

class _WrapperState extends State<Wrapper> {
  @override
  void initState() {
    final receive_port = ReceivePort();
    Isolate.spawn(send_messages, receive_port.sendPort);
  }

  @override
  Widget build(BuildContext context) {
    var pubNubProv = Provider.of<PubNubProvider>(context, listen: false);
    return Consumer<LoginProvider>(builder: (context, authProv, _) {
      switch (authProv.getLoggedInStatus) {
        case LoginStatus.Authorized:
          // print(authProv.getUserDetails);
          pubNubProv.getDataFromPubNub(authProv.getUserDetails['school_id']);
          // Timer.periodic(new Duration(seconds: 1), (timer) {
          //   pubNubProv.send_messages();
          // });
          // msg_sender().send_messages();
          return home();
        case LoginStatus.Unauthorized:
          return splash();
        case LoginStatus.Uninitialized:
          return Scaffold(
            body: Align(
                alignment: AlignmentDirectional(0, 0),
                child: SpinKitRing(
                  color: Colors.amber,
                  size: 50.0,
                )
                // child: Text('Loading...',
                //     textAlign: TextAlign.center,
                //     style: TextStyle(
                //       fontFamily: 'Poppins',
                //       fontSize: 20,
                //     )),
                ),
          );
      }
    });
  }
}

Future<void> send_messages(SendPort sendPort) async {
  // while (true) {
  //   var msgs = globals.objectBoxService.getAllMessages();
  //   if (msgs.length < 0) {
  //     final handle = msgHandler();
  //     for (var element in msgs) {
  //       var msg = element?.payload;
  //       handle.addtoQueue(msg);
  //     }
  //   }
  //   handle.sendMsg();
  // }
  int _count = 0;
  print("isolate (send_messages) runnning....");
  for (var i = 0; i < 10; i++) {
    await Future.delayed(Duration(seconds: 3), () {});
    _count++;
    print("in isolate: ${_count.toString()}");
  }
}
