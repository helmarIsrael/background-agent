import 'package:flutter/material.dart';

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
            'Messages',
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
                    child: ListView(
                      padding: EdgeInsets.zero,
                      scrollDirection: Axis.vertical,
                      children: [
                        for (int i = 0; i < 10; i++)
                          //
                          // ###############################
                          // LIST VIEW CHLD 1
                          // ###############################
                          //
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 1),
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
                                padding:
                                    EdgeInsetsDirectional.fromSTEB(8, 8, 8, 8),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Container(
                                      width: 4,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Color(0xFFFFBF00),
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                    Expanded(
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            12, 0, 0, 0),
                                        child: Text(
                                          'Check-in evaluated',
                                          style: TextStyle(
                                            fontFamily: 'Montserrat',
                                            color: Color(0xFF101213),
                                            fontSize: 18,
                                            fontWeight: FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          12, 0, 0, 0),
                                      child: Text(
                                        'Mar 8, 2022',
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
                        //
                        // ###############################
                        // LIST VIEW CHLD 2
                        // ###############################
                        //
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 1),
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
                              padding:
                                  EdgeInsetsDirectional.fromSTEB(8, 8, 8, 8),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Container(
                                    width: 4,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      color: Color(0xFFFFBF00),
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          12, 0, 0, 0),
                                      child: Text(
                                        'Check-in evaluated',
                                        style: TextStyle(
                                          fontFamily: 'Montserrat',
                                          color: Color(0xFF101213),
                                          fontSize: 18,
                                          fontWeight: FontWeight.normal,
                                        ),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        12, 0, 0, 0),
                                    child: Text(
                                      'Mar 8, 2022',
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
                        )
                      ],
                    ),
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
                                        context, '/viewMsg');
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
