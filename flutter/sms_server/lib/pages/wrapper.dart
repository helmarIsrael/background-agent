import 'dart:async';
import 'dart:collection';
import 'dart:io';
import 'dart:isolate';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/basic.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/objectbox.g.dart';
import 'package:sms_server/pages/home.dart';
import 'package:sms_server/pages/viewMsg.dart';
import 'package:sms_server/pages/splash.dart';
import 'package:sms_server/provider/pubnub_provider.dart';
import 'package:sms_server/utils/isolate_args.dart';
import 'package:sms_server/utils/message_handler.dart';
import '../utils/sms_sender.dart' as sms;

import '../model/message_model.dart';
import '../provider/login_provider.dart';

// import '../utils/globals.dart' as globals;

class Wrapper extends StatefulWidget {
  const Wrapper({super.key});

  @override
  State<Wrapper> createState() => _WrapperState();
}

class _WrapperState extends State<Wrapper> {
  @override
  Widget build(BuildContext context) {
    var pubNubProv = Provider.of<PubNubProvider>(context, listen: false);
    return Consumer<LoginProvider>(builder: (context, authProv, _) {
      switch (authProv.getLoggedInStatus) {
        case LoginStatus.Authorized:
          // print(authProv.getUserDetails);
          pubNubProv.getDataFromPubNub(authProv.getUserDetails['school_id']);

          Timer.periodic(new Duration(seconds: 10), (timer) {
            msgHandler().sendMsg(authProv.getUserDetails['contact_numbers']);
          });
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

// void send_messages(RequiredArgs args) {
//   print("isolate (send_messages) runnning....");
//   List<String> nums = ['09763189903', '09050262036'];

//   // print(nums);
//   // sendSMS(message: 'myeskwela', recipients: nums, sendDirect: true);

//   // var isSent = sms.send_sms('myeskwela', nums);

//   // final SendPort sendPort = args.sendPort;
//   // final store = Store.fromReference(getObjectBoxModel(), args.id as ByteData);
//   // var messageBox = Box<messageDetail>(store);
//   // // var send = msg_sender();
//   // // var canSend = await sms.check_canSend();

//   // int id = 0;

//   // // if (canSend) {
//   // // print(canSend);
//   Timer.periodic(new Duration(seconds: 10), (timer) {
//     // print(id);

//     msgHandler().sendMsg();
//     // print("running periodically");
//     // var msgs = messageBox.getAll();
//     // if (msgs.length > 0) {
//     //   // send.send_messages(messageBox);
//     //   //send 10 everysecond
//     //   msgHandler().sendMsg(messageBox);
//     //   print('monitor local storage length: ${msgs.length}');
//     // }
//   });
//   // }
//   // send.send_messages(messageBox);
// }
