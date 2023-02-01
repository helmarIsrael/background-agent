import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/provider/login_provider.dart';
import 'package:sms_server/provider/sent_msgs_provider.dart';
import 'package:sms_server/utils/message_handler.dart';
import '../utils/globals.dart' as globals;
import '../utils/sms_sender.dart' as sms;

class home extends StatefulWidget {
  const home({super.key});

  @override
  State<home> createState() => _homeState();
}

class _homeState extends State<home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFFFFBF00),
        automaticallyImplyLeading: false,
        title: Text(
          'Home',
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
                Expanded(
                  child: Container(
                    child: ListView(
                      scrollDirection: Axis.vertical,
                      children: [
                        Align(
                          alignment: AlignmentDirectional(-0.05, 0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Container(
                                  width: 100,
                                  // height: MediaQuery.of(context).size.height * 0.75,
                                  decoration: BoxDecoration(
                                    color: Color(0x00FFFFFF),
                                  ),
                                  child: Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        15, 15, 15, 0),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceEvenly,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        // FIRST CONTAINER
                                        Padding(
                                          padding: const EdgeInsets.only(
                                              bottom: 8.0),
                                          child: Container(
                                            width: 600,
                                            height: 100,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              boxShadow: [
                                                BoxShadow(
                                                  blurRadius: 4,
                                                  color: Color(0x33000000),
                                                  offset: Offset(0, 2),
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(5, 5, 5, 5),
                                              child: Column(
                                                mainAxisSize: MainAxisSize.max,
                                                children: [
                                                  Align(
                                                    alignment:
                                                        AlignmentDirectional(
                                                            -1, 0),
                                                    child: Text(
                                                      'Number of Messages Sent Today',
                                                      style: TextStyle(
                                                        fontFamily:
                                                            'Montserrat',
                                                        fontSize: 20,
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                                  Expanded(
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              -0.05, -0.05),
                                                      child: Consumer<
                                                              SentMessagesProvider>(
                                                          builder: (context,
                                                              sent_msg, _) {
                                                        sent_msg
                                                            .get_sentMessageCount();
                                                        if (sent_msg
                                                            .getLoadingStatus) {
                                                          return Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      0, 0),
                                                              child:
                                                                  SpinKitRing(
                                                                color: Color(
                                                                    0xFFFFBF00),
                                                                size: 50.0,
                                                              ));
                                                        } else {
                                                          return Text(
                                                            '${sent_msg.getSentMessageCount}',
                                                            textAlign: TextAlign
                                                                .center,
                                                            style: TextStyle(
                                                              fontFamily:
                                                                  'Montserrat',
                                                              fontSize: 33,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                            ),
                                                          );
                                                        }
                                                      }),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),

                                        Padding(
                                          padding: const EdgeInsets.only(
                                              bottom: 8.0),
                                          child: Container(
                                            width: 600,
                                            height: 100,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              boxShadow: [
                                                BoxShadow(
                                                  blurRadius: 4,
                                                  color: Color(0x33000000),
                                                  offset: Offset(0, 2),
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(5, 5, 5, 5),
                                              child: Column(
                                                mainAxisSize: MainAxisSize.max,
                                                children: [
                                                  Align(
                                                    alignment:
                                                        AlignmentDirectional(
                                                            -1, 0),
                                                    child: Text(
                                                      'Total Messages Sent',
                                                      style: TextStyle(
                                                        fontFamily:
                                                            'Montserrat',
                                                        fontSize: 20,
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                                  Expanded(
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              -0.05, -0.05),
                                                      child: Consumer<
                                                              SentMessagesProvider>(
                                                          builder: (context,
                                                              sent_msg, _) {
                                                        sent_msg
                                                            .get_oldSentMessageCount();
                                                        if (sent_msg
                                                            .getLoadingStatus) {
                                                          return Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      0, 0),
                                                              child:
                                                                  SpinKitRing(
                                                                color: Color(
                                                                    0xFFFFBF00),
                                                                size: 50.0,
                                                              ));
                                                        } else {
                                                          return Text(
                                                            '${sent_msg.getSent_oldMessageCount}',
                                                            textAlign: TextAlign
                                                                .center,
                                                            style: TextStyle(
                                                              fontFamily:
                                                                  'Montserrat',
                                                              fontSize: 33,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                            ),
                                                          );
                                                        }
                                                      }),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                        //  SECOND CONTAINER
                                        Padding(
                                          padding: const EdgeInsets.only(
                                              bottom: 8.0),
                                          child: Container(
                                            width: 600,
                                            height: 150,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              boxShadow: [
                                                BoxShadow(
                                                  blurRadius: 4,
                                                  color: Color(0x33000000),
                                                  offset: Offset(0, 2),
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(5, 5, 5, 5),
                                              child: Column(
                                                mainAxisSize: MainAxisSize.max,
                                                children: [
                                                  Align(
                                                    alignment:
                                                        AlignmentDirectional(
                                                            -1, 0),
                                                    child: Text(
                                                      'School',
                                                      style: TextStyle(
                                                        fontFamily:
                                                            'Montserrat',
                                                        fontSize: 20,
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                                  Expanded(
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              -0.05, 0),
                                                      child: Consumer<
                                                              LoginProvider>(
                                                          builder: (context,
                                                              authProv, _) {
                                                        return Text(
                                                          '${authProv.getUserDetails['school']}',
                                                          style: TextStyle(
                                                            fontFamily:
                                                                'Montserrat',
                                                            fontSize: 25,
                                                            fontWeight:
                                                                FontWeight.bold,
                                                          ),
                                                        );
                                                      }),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                        // THIRD CONTAINER
                                        Container(
                                          width: 600,
                                          height: 180,
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            boxShadow: [
                                              BoxShadow(
                                                blurRadius: 4,
                                                color: Color(0x33000000),
                                                offset: Offset(0, 2),
                                              )
                                            ],
                                            borderRadius:
                                                BorderRadius.circular(10),
                                          ),
                                          child: Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    5, 5, 5, 5),
                                            child: Column(
                                              mainAxisSize: MainAxisSize.max,
                                              mainAxisAlignment:
                                                  MainAxisAlignment.spaceEvenly,
                                              children: [
                                                Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          -1, 0),
                                                  child: Text(
                                                    'District',
                                                    style: TextStyle(
                                                      fontFamily: 'Montserrat',
                                                      fontSize: 20,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                    ),
                                                  ),
                                                ),
                                                Expanded(
                                                  child: Align(
                                                    alignment:
                                                        AlignmentDirectional(
                                                            -0.05, 0),
                                                    child:
                                                        Consumer<LoginProvider>(
                                                            builder: (context,
                                                                authProv, _) {
                                                      return Text(
                                                        '${authProv.getUserDetails['district']}',
                                                        style: TextStyle(
                                                          fontFamily:
                                                              'Montserrat',
                                                          fontSize: 25,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      );
                                                    }),
                                                  ),
                                                ),
                                                Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          -1, 0),
                                                  child: Text(
                                                    'Division',
                                                    style: TextStyle(
                                                      fontFamily: 'Montserrat',
                                                      fontSize: 20,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                    ),
                                                  ),
                                                ),
                                                Expanded(
                                                  child: Align(
                                                    alignment:
                                                        AlignmentDirectional(
                                                            -0.05, 0),
                                                    child:
                                                        Consumer<LoginProvider>(
                                                            builder: (context,
                                                                authProv, _) {
                                                      return Text(
                                                        '${authProv.getUserDetails['division']}',
                                                        style: TextStyle(
                                                          fontFamily:
                                                              'Montserrat',
                                                          fontSize: 25,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      );
                                                    }),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        )
                                      ],
                                    ),
                                  ))
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
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
                                  onPressed: () async {
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
        ),
      ),
    );
  }
}
