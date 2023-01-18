import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'package:sms_server/pages/wrapper.dart';
import 'package:sms_server/provider/login_provider.dart';
import 'package:sms_server/provider/ui_providers/splash_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class splash extends StatefulWidget {
  const splash({Key? key}) : super(key: key);

  @override
  State<splash> createState() => _splashState();
}

class _splashState extends State<splash> {
  void request_permission() async {
    await [Permission.sms].request();
  }
  // void bootup() async {
  //   await Future.delayed(Duration(seconds: 3), () {
  //     Navigator.pushReplacementNamed(context, '/home');
  //   });
  // }

  @override
  void initState() {
    request_permission();
  }

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    var authProv = Provider.of<LoginProvider>(context, listen: false);
    return Scaffold(
      body: Center(
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
                  height: MediaQuery.of(context).size.height * 0.6,
                  decoration: BoxDecoration(
                    color: Color(0x00FFFFFF),
                  ),
                  child: Container(
                    width: 100,
                    height: MediaQuery.of(context).size.height * 0.3,
                    decoration: BoxDecoration(
                      color: Color(0x00FFFFFF),
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
                          splashProv.toLoadSplash();
                          if (splashProv.getSplashStatus ==
                              SplashStatus.splashUninitialized) {
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
                          }
                          return Column(
                            children: [
                              Padding(
                                padding:
                                    EdgeInsetsDirectional.fromSTEB(9, 5, 9, 5),
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
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      errorBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      focusedErrorBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
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
                                padding:
                                    EdgeInsetsDirectional.fromSTEB(9, 5, 9, 5),
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
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      errorBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(4.0),
                                          topRight: Radius.circular(4.0),
                                        ),
                                      ),
                                      focusedErrorBorder: UnderlineInputBorder(
                                        borderSide: BorderSide(
                                          color: Color(0x00000000),
                                          width: 1,
                                        ),
                                        borderRadius: const BorderRadius.only(
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
                                height: 15,
                              ),
                              SizedBox(
                                height: 50,
                                width: 200,
                                child: ElevatedButton(
                                  onPressed: () {
                                    authProv.verify(usernameController.text,
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
                              )
                            ],
                          );
                        }),
                        // Padding(
                        //   padding: EdgeInsetsDirectional.fromSTEB(9, 5, 9, 5),
                        //   child: Container(
                        //     width: 300,
                        //     child: TextFormField(
                        //       autofocus: true,
                        //       obscureText: false,
                        //       decoration: InputDecoration(
                        //         hintText: 'Username',
                        //         hintStyle: TextStyle(
                        //           fontFamily: 'Poppins',
                        //           fontSize: 20,
                        //         ),
                        //         enabledBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         focusedBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         errorBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         focusedErrorBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         filled: true,
                        //         fillColor: Colors.white,
                        //       ),
                        //       style: TextStyle(
                        //         fontFamily: 'Poppins',
                        //         fontSize: 20,
                        //       ),
                        //     ),
                        //   ),
                        // ),
                        // Padding(
                        //   padding: EdgeInsetsDirectional.fromSTEB(9, 5, 9, 5),
                        //   child: Container(
                        //     width: 300,
                        //     child: TextFormField(
                        //       autofocus: true,
                        //       obscureText: true,
                        //       decoration: InputDecoration(
                        //         hintText: 'Password',
                        //         hintStyle: TextStyle(
                        //           fontFamily: 'Poppins',
                        //           fontSize: 20,
                        //         ),
                        //         enabledBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         focusedBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         errorBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         focusedErrorBorder: UnderlineInputBorder(
                        //           borderSide: BorderSide(
                        //             color: Color(0x00000000),
                        //             width: 1,
                        //           ),
                        //           borderRadius: const BorderRadius.only(
                        //             topLeft: Radius.circular(4.0),
                        //             topRight: Radius.circular(4.0),
                        //           ),
                        //         ),
                        //         filled: true,
                        //         fillColor: Colors.white,
                        //       ),
                        //       style: TextStyle(
                        //         fontFamily: 'Poppins',
                        //         fontSize: 20,
                        //       ),
                        //     ),
                        //   ),
                        // ),
                        // SizedBox(
                        //   height: 15,
                        // ),
                        // SizedBox(
                        //   height: 50,
                        //   width: 200,
                        //   child: ElevatedButton(
                        //     onPressed: () {
                        //       print('Button pressed ...');
                        //     },
                        //     style: ElevatedButton.styleFrom(
                        //         primary: Color(0xFFF8D159),
                        //         onPrimary: Colors.white),
                        //     child: Text('Login',
                        //         style: TextStyle(
                        //           fontFamily: 'Montseratt',
                        //           fontSize: 20,
                        //         )),
                        //   ),
                        // )
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      )),
    );
  }
}
