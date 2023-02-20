import 'package:flutter/material.dart';

Widget internetDialog(BuildContext context) {
  return AlertDialog(
    title: Text('No Internet Connection'),
    content: Text(
        'Please Check your Mobile Data and Connect to the Internet to continue sending messages.'),
    elevation: 24.0,
    backgroundColor: Color(0xFFF8D159),
  );
}

Widget splashDialog(BuildContext context) {
  return AlertDialog(
    title: Text('No Internet Connection'),
    content: Container(
      height: 62,
      child: Text(
          'Please Check your Mobile Data and Connect to the Internet to Log in'),
    ),
    elevation: 24.0,
    backgroundColor: Color(0xFFF8D159),
  );
}
