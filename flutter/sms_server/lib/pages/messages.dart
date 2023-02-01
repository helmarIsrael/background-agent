import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/viewMsg.dart';
import 'package:sms_server/provider/sent_msgs_provider.dart';

class messages extends StatefulWidget {
  const messages({super.key});

  @override
  State<messages> createState() => _messagesState();
}

class _messagesState extends State<messages> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Color(0xFFFFBF00),
          automaticallyImplyLeading: false,
          title: Text(
            'Messages Sent',
            style: TextStyle(
              fontFamily: 'Montserrat',
              color: Colors.white,
              fontSize: 22,
            ),
          ),
          actions: [],
          centerTitle: false,
          elevation: 2,
        ),
        body: SafeArea(
            child: GestureDetector(
          child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // FIRST CHILD
                Container(
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height * 0.74,
                  // height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white,
                  ),
                  child: Padding(
                    padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                    //
                    // #############
                    // LIST VIEW HERE
                    // #############3
                    //
                    child: Consumer<SentMessagesProvider>(
                        builder: (context, sent_msgs, _) {
                      sent_msgs.get_sentMessages();
                      // List msgs = sent_msgs.getsentMessages.reversed.toList();
                      if (sent_msgs.getMsgsLoadingStatus == true) {
                        return Align(
                            alignment: AlignmentDirectional(0, 0),
                            child: SpinKitRing(
                              color: Color(0xFFFFBF00),
                              size: 50.0,
                            ));
                      } else {
                        if (sent_msgs.getsentMessages.length == 0) {
                          return Center(
                            child: Text('No Messages Sent Yet',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontFamily: 'Montserrat',
                                  color: Color.fromARGB(162, 255, 191, 0),
                                  fontSize: 30,
                                  fontWeight: FontWeight.normal,
                                )),
                          );
                        } else {
                          return ListView(
                            padding: EdgeInsets.zero,
                            scrollDirection: Axis.vertical,
                            children: [
                              for (int i = 0;
                                  i < sent_msgs.getsentMessages.length;
                                  i++)
                                //
                                // ###############################
                                // LIST VIEW CHLD 1
                                // ###############################
                                //
                                GestureDetector(
                                  onTap: () => {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => viewMsg(
                                                msg_id: sent_msgs
                                                    .getsentMessages[i].id))),
                                  },
                                  child: Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0, 0, 0, 1),
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        boxShadow: [
                                          BoxShadow(
                                            blurRadius: 0,
                                            color: Color(0xFFE0E3E7),
                                            offset: Offset(0, 4),
                                          )
                                        ],
                                        borderRadius: BorderRadius.circular(0),
                                        shape: BoxShape.rectangle,
                                      ),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            8, 8, 8, 8),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.max,
                                          children: [
                                            Container(
                                              width: 4,
                                              height: 50,
                                              decoration: BoxDecoration(
                                                color: Color(0xFFFFBF00),
                                                borderRadius:
                                                    BorderRadius.circular(2),
                                              ),
                                            ),
                                            Expanded(
                                              child: Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(12, 0, 0, 0),
                                                child: Text(
                                                  "${json.decode(sent_msgs.getsentMessages[i].payload)['poster']}",
                                                  style: TextStyle(
                                                    fontFamily: 'Montserrat',
                                                    color: Color(0xFF101213),
                                                    fontSize: 18,
                                                    fontWeight:
                                                        FontWeight.normal,
                                                  ),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(0, 0, 0, 0),
                                              child: Text(
                                                '${DateFormat("MMM, dd, yyyy").format(DateTime.parse(sent_msgs.getsentMessages[i].timestamp))}\n${DateFormat("jm").format(DateTime.parse(sent_msgs.getsentMessages[i].timestamp))}',
                                                style: TextStyle(
                                                  fontFamily: 'Montserrat',
                                                  color: Color(0xFF57636C),
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.normal,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          );
                        }
                      }

                      ;
                    }),
                  ),
                ),

                // SECOND CHILD
                Align(
                    alignment: AlignmentDirectional(0, 0),
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Color(0xFFF8D159),
                        boxShadow: [
                          BoxShadow(
                            blurRadius: 4,
                            color: Color(0x55000000),
                            offset: Offset(0, 2),
                          )
                        ],
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(0),
                          bottomRight: Radius.circular(0),
                          topLeft: Radius.circular(16),
                          topRight: Radius.circular(16),
                        ),
                      ),
                      child: Padding(
                          padding:
                              EdgeInsetsDirectional.fromSTEB(16, 16, 16, 52),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(
                                height: 50,
                                width: 160,
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.pushReplacementNamed(
                                        context, '/messages');
                                  },
                                  style: ElevatedButton.styleFrom(
                                      primary: Colors.white,
                                      onPrimary: Color(0xFFF8D159)),
                                  child: Text('Messages',
                                      style: TextStyle(
                                        fontFamily: 'Montseratt',
                                        fontSize: 15,
                                      )),
                                ),
                              ),
                              SizedBox(
                                width: 7,
                              ),
                              SizedBox(
                                height: 50,
                                width: 160,
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.pushReplacementNamed(
                                        context, '/home');
                                  },
                                  style: ElevatedButton.styleFrom(
                                      primary: Colors.white,
                                      onPrimary: Color(0xFFF8D159)),
                                  child: Text('Home',
                                      style: TextStyle(
                                        fontFamily: 'Montseratt',
                                        fontSize: 15,
                                      )),
                                ),
                              )
                            ],
                          )),
                    ))
              ]),
        )));
  }
}
