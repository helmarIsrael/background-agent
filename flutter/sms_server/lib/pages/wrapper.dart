import 'dart:async';
import 'dart:collection';
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
// import 'package:sms_server/utils/message_sender.dart';

import '../model/message_model.dart';
import '../provider/login_provider.dart';

import '../utils/globals.dart' as globals;

class Wrapper extends StatefulWidget {
  const Wrapper({super.key});

  @override
  State<Wrapper> createState() => _WrapperState();
}

class _WrapperState extends State<Wrapper> {
  // Future<void> sendport_completer() async {
  //   var sendPortCompleter = Completer<SendPort>();
  //   SendPort main_iso_sendPort = await sendPortCompleter.future;
  //   main_iso_sendPort.send(10);
  // }

  @override
  void initState() {
    final receive_port = ReceivePort();
    var store = globals.objectBoxService.store_reference;
    RequiredArgs requiredArgs = RequiredArgs(store, receive_port.sendPort);
    Isolate.spawn(send_messages, requiredArgs);
    // sendport_completer();
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

Future<void> send_messages(RequiredArgs args) async {
  final SendPort sendPort = args.sendPort;
  final store = Store.fromReference(getObjectBoxModel(), args.id as ByteData);
  var messageBox = Box<messageDetail>(store);

  print(messageBox.getAll());

  // print(id);

  // sendPort.send("yes");

  // final commandPort = ReceivePort();
  // p.send(commandPort.sendPort);

  // print(commandPort.first);

  // SendPort responsePort = args[0];
  // var queue = args[0];

  // print(queue);

  // messageBox.getAll();

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
  // int _count = 0;
  // print("isolate (send_messages) runnning....");
  // for (var i = 0; i < 10; i++) {
  //   await Future.delayed(Duration(seconds: 3), () {});
  //   _count++;
  //   print("in isolate: ${_count.toString()}");
  // }
}
