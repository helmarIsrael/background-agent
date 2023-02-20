import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/wrapper.dart';
import 'package:sms_server/provider/login_provider.dart';
import 'package:sms_server/provider/ui_providers/splash_provider.dart';
import 'package:permission_handler/permission_handler.dart';

import '../provider/connection_provider.dart';
import '../utils/alert_dialog.dart';
import '../utils/secure_userdetails.dart';
import '../utils/sms_sender.dart' as sms;
import '../utils/sms_sender.dart';

class splash extends StatefulWidget {
  const splash({Key? key}) : super(key: key);

  @override
  State<splash> createState() => _splashState();
}

class _splashState extends State<splash> {
  void request_permission() async {
    await [Permission.sms].request();
  }

  void toWrapper() {
    Navigator.pushReplacementNamed(context, '/wrapper');
  }

  // void bootup() async {
  //   checkLoad();
  // }

  Future initialize_user() async {
    final cred_sec_user = await CredsSecureStorage.getUsername() ?? '';
    final cred_sec_pass = await CredsSecureStorage.getUserPass() ?? '';

    checkSecureStorage(cred_sec_user, cred_sec_pass);
  }

  void checkSecureStorage(username, password) {
    if (username != '' && password != '') {
      var authProv = Provider.of<LoginProvider>(context, listen: false);
      authProv.verify(username, password);
      toWrapper();
    }
  }

  @override
  void initState() {
    request_permission();
    var sp = Provider.of<SplashProvider>(context, listen: false);
    sp.toLoadSplash();
    var connProv = Provider.of<ConnectionProvider>(context, listen: false);
    connProv.checkConnectivity();

    if (connProv.getStatus != 'Offline') {
      initialize_user();
    }
  }

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    var authProv = Provider.of<LoginProvider>(context, listen: false);
    var connProv = Provider.of<ConnectionProvider>(context, listen: false);
    // connProv.checkConnectivity();
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: SingleChildScrollView(
        // child: (secure_name != '' && secure_pass != '')
        //     ? authProv.verify(usernameController.text,passwordController.text);
        //     : Center(
        child: Center(
            // Center is a layout widget. It takes a single child and positions it
            // in the middle of the parent.
            child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              width: 100,
              height: MediaQuery.of(context).size.height * 1,
              decoration: BoxDecoration(
                color: Color(0xFFFFBF00),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    width: 100,
                    height: MediaQuery.of(context).size.height * 0.5,
                    decoration: BoxDecoration(
                      color: Color.fromARGB(0, 255, 255, 255),
                    ),
                    child: Container(
                      width: 100,
                      height: MediaQuery.of(context).size.height * 0.3,
                      decoration: BoxDecoration(
                        color: Color.fromARGB(0, 231, 15, 15),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('my.eskwela',
                              style: TextStyle(
                                fontFamily: 'Montserrat',
                                color: Colors.white,
                                fontSize: 40,
                                fontWeight: FontWeight.normal,
                              )),
                          SizedBox(
                            height: 5,
                          ),
                          Text('SMS App',
                              style: TextStyle(
                                fontFamily: 'Montserrat',
                                color: Colors.white,
                                fontSize: 25,
                                fontWeight: FontWeight.normal,
                              )),
                          SizedBox(
                            height: 20,
                          ),
                          Consumer<SplashProvider>(
                              builder: (context, splashProv, _) {
                            // splashProv.toLoadSplash();
                            // splashProv.checkDeviceLoad();
                            connProv.checkConnectivity();
                            if (splashProv.getSplashStatus !=
                                SplashStatus.splashIsLoaded) {
                              return Align(
                                  alignment: AlignmentDirectional(0, 0),
                                  child: SpinKitRing(
                                    color: Colors.white,
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
                              if (splashProv.getCanSendStatus ==
                                  SplashStatus.deviceCantSend) {
                                return Text(
                                  'Device Not Capable for message Sending',
                                  style: TextStyle(
                                    fontFamily: 'Montserrat',
                                    color: Color.fromARGB(255, 230, 0, 0),
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                );
                              }

                              // } else if (splashProv.getDeviceLoadStatus ==
                              //     false) {
                              //   return Text(
                              //       'Device is either has no Load for sending Text Messages or has No reception',
                              //       style: TextStyle(
                              //         fontFamily: 'Montserrat',
                              //         color: Color.fromARGB(255, 230, 0, 0),
                              //         fontSize: 25,
                              //         fontWeight: FontWeight.bold,
                              //       ));
                              // }
                            }
                            return Stack(
                              children: [
                                Column(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          9, 5, 9, 5),
                                      child: Container(
                                        width: 300,
                                        child: TextFormField(
                                          controller: usernameController,
                                          // autofocus: true,
                                          obscureText: false,
                                          decoration: InputDecoration(
                                            hintText: 'Username',
                                            hintStyle: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontSize: 20,
                                            ),
                                            enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            errorBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedErrorBorder:
                                                UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            filled: true,
                                            fillColor: Colors.white,
                                          ),
                                          style: TextStyle(
                                            fontFamily: 'Poppins',
                                            fontSize: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          9, 5, 9, 5),
                                      child: Container(
                                        width: 300,
                                        child: TextFormField(
                                          controller: passwordController,
                                          // autofocus: true,
                                          obscureText: true,
                                          decoration: InputDecoration(
                                            hintText: 'Password',
                                            hintStyle: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontSize: 20,
                                            ),
                                            enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            errorBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedErrorBorder:
                                                UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Color(0x00000000),
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            filled: true,
                                            fillColor: Colors.white,
                                          ),
                                          style: TextStyle(
                                            fontFamily: 'Poppins',
                                            fontSize: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    SizedBox(
                                      height: 50,
                                      width: 200,
                                      child: ElevatedButton(
                                        onPressed: () {
                                          // save username to secure storage
                                          authProv.verify(
                                              usernameController.text,
                                              passwordController.text);
                                          Navigator.pushReplacementNamed(
                                              context, '/wrapper');
                                        },
                                        style: ElevatedButton.styleFrom(
                                            primary: Color(0xFFF8D159),
                                            onPrimary: Colors.white),
                                        child: Text('Login',
                                            style: TextStyle(
                                              fontFamily: 'Montseratt',
                                              fontSize: 20,
                                            )),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 20,
                                    ),
                                    if (authProv.getLoggedInStatus ==
                                        LoginStatus.Unauthorized)
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 8.0),
                                        child: Text(
                                          'Invalid Username or Password',
                                          style: TextStyle(
                                            fontFamily: 'Montserrat',
                                            color:
                                                Color.fromARGB(255, 230, 0, 0),
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    if (authProv.getLoggedInStatus ==
                                        LoginStatus.Disconnected)
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 8.0),
                                        child: Text(
                                          'No Internet Connection',
                                          style: TextStyle(
                                            fontFamily: 'Montserrat',
                                            color:
                                                Color.fromARGB(255, 230, 0, 0),
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    Text(
                                      'Make Sure that the Device has load, internet and reception.',
                                      style: TextStyle(
                                        fontFamily: 'Montserrat',
                                        color: Color.fromRGBO(0, 152, 46, 1),
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                                Consumer<ConnectionProvider>(
                                    builder: (context, connProv, _) {
                                  connProv.checkConnectivity();
                                  if (connProv.getStatus == 'Offline') {
                                    return splashDialog(context);
                                    // return internetDialog(context);

                                  }
                                  return Visibility(
                                    child: Text("Gone"),
                                    visible: false,
                                  );
                                })
                              ],
                            );
                          }),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 30,
                  )
                ],
              ),
            ),
          ],
        )),
      ),
    );
  }
}
