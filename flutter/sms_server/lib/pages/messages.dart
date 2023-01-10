import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:pubnub/pubnub.dart';
import 'package:sms_server/provider/pubnub_provider.dart';

class messages extends StatefulWidget {
  const messages({Key? key}) : super(key: key);

  @override
  State<messages> createState() => _messagesState();
}

class _messagesState extends State<messages> {
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
          child: Align(
            alignment: AlignmentDirectional(-0.05, 0),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: Container(
                    width: 100,
                    decoration: BoxDecoration(
                      color: Color(0x00FFFFFF),
                    ),
                    child: Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(15, 15, 15, 0),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: MediaQuery.of(context).size.width,
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
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Padding(
                              padding:
                                  EdgeInsetsDirectional.fromSTEB(5, 5, 5, 5),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Align(
                                    alignment: AlignmentDirectional(-1, 0),
                                    child: Text(
                                      'Notifcation Coming From',
                                      style: TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  Align(
                                      alignment: AlignmentDirectional(-0.05, 0),
                                      child: Consumer<PubNubProvider>(
                                          builder: (context, pub, _) {
                                        return Text(
                                          '${pub.getMessage['name']}',
                                          style: TextStyle(
                                            fontFamily: 'Montserrat',
                                            fontSize: 30,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        );
                                      })),
                                ],
                              ),
                            ),
                          ),
                          Container(
                            width: 100,
                            height: MediaQuery.of(context).size.height * 0.03,
                            decoration: BoxDecoration(
                              color: Color(0x00FFFFFF),
                            ),
                          ),
                          Container(
                            width: MediaQuery.of(context).size.width,
                            height: MediaQuery.of(context).size.height * 0.3,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              boxShadow: [
                                BoxShadow(
                                  blurRadius: 4,
                                  color: Color(0x33000000),
                                  offset: Offset(0, 2),
                                )
                              ],
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Padding(
                              padding:
                                  EdgeInsetsDirectional.fromSTEB(5, 5, 5, 5),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0, 0, 0, 10),
                                    child: Text(
                                      'Message PAYLOAD',
                                      style: TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  Consumer<PubNubProvider>(
                                      builder: (context, pub, _) {
                                    // pub.getDataFromPubNub();
                                    if (pub.getMessage == '') {
                                      return Align(
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
                                          );
                                    } else {
                                      return Text(
                                        '\"${pub.getMessage['poster']}\"',
                                        style: TextStyle(
                                          fontFamily: 'Montserrat',
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      );
                                    }
                                  }),

                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0, 10, 0, 0),
                                    child: Text(
                                      'Message Type',
                                      style: TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),

                                  Consumer<PubNubProvider>(
                                      builder: (context, pub, _) {
                                    // pub.getDataFromPubNub();
                                    if (pub.getMessage == '') {
                                      return Align(
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
                                          );
                                    } else {
                                      return Text(
                                        '\"${pub.getMessage['type']}\"',
                                        style: TextStyle(
                                          fontFamily: 'Montserrat',
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      );
                                    }
                                  }),

                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0, 10, 0, 0),
                                    child: Text(
                                      'Timestamp',
                                      style: TextStyle(
                                        fontFamily: 'Montserrat',
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),

                                  Consumer<PubNubProvider>(
                                      builder: (context, pub, _) {
                                    // pub.getDataFromPubNub();
                                    if (pub.getMessage == '') {
                                      return Align(
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
                                          );
                                    } else {
                                      return Text(
                                        '\"${pub.getMessage['ts']}\"',
                                        style: TextStyle(
                                          fontFamily: 'Montserrat',
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      );
                                    }
                                  }),

                                  // Center(
                                  //   child: Consumer<PubNubProvider>(
                                  //     builder: (context, pubNubProv, _) {
                                  //       return ElevatedButton(
                                  //         child: Text('ambotlang btn'),
                                  //         onPressed: (){
                                  //           pubNubProv.ambotlang();
                                  //         },
                                  //       );
                                  //     }
                                  //   ),
                                  // )
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Container(
                //   width: 100,
                //   height: MediaQuery.of(context).size.height * 0.5,
                //   decoration: BoxDecoration(
                //     color: Colors.white,
                //   ),
                // ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
// Center is a layout widget. It takes a single child and positions it
// in the middle of the parent.
