import 'dart:async';

import 'package:flutter/material.dart';

import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/home.dart';

import 'package:sms_server/pages/splash.dart';
import 'package:sms_server/provider/pubnub_provider.dart';
import 'package:sms_server/provider/sent_msgs_provider.dart';

import 'package:sms_server/utils/message_handler.dart';
// import '../provider/connection_provider.dart';

import '../provider/login_provider.dart';

// import '../utils/globals.dart' as globals;

class Wrapper extends StatefulWidget {
  const Wrapper({super.key});

  @override
  State<Wrapper> createState() => _WrapperState();
}

class _WrapperState extends State<Wrapper> {
  @override
  @override
  Widget build(BuildContext context) {
    var pubNubProv = Provider.of<PubNubProvider>(context, listen: false);
    var sent_sms = Provider.of<SentMessagesProvider>(context, listen: false);
    // ConnectionProvider _check_conn =
    //     Provider.of<ConnectionProvider>(context, listen: false);

    // _check_conn.checkConnectivity();

    // if (_check_conn.getStatus == 'offline') {
    //   showDialog(
    //       context: context,
    //       barrierColor: Color(0x01000000),
    //       barrierDismissible: false,
    //       builder: (_) => internetDialog(context));
    // }

    return Consumer<LoginProvider>(builder: (context, authProv, _) {
      switch (authProv.getLoggedInStatus) {
        case LoginStatus.Authorized:
          // print(authProv.getUserDetails);
          // pubNubProv.getDataFromPubNub({authProv.getUserDetails['school_id']});
          pubNubProv.getDataFromPubNub({
            authProv.getUserDetails['school_id'],
            authProv.getUserDetails['name']
          });
          // pubNubProv.getDataFromPubNub({'128081', 'A2019ENERIOEBISA-1'});
          Timer.periodic(new Duration(seconds: 10), (timer) {
            msgHandler().sendMsg(authProv.getUserDetails['contact_numbers']);
            sent_sms.get_sentMessageCount();
            sent_sms.getTodayMessages();
            sent_sms.get_oldSentMessageCount();
          });

          return home();
        case LoginStatus.Unauthorized:
          return splash();
        case LoginStatus.Disconnected:
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
