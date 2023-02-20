import 'package:flutter/material.dart';

Future internetDialog(BuildContext context) {
  return showDialog(
      context: context,
      barrierColor: Color(0x01000000),
      barrierDismissible: false,
      builder: (_) => AlertDialog(
            title: Text('No Internet Connection'),
            content: Text(
                'Please Check your Mobile Data and Connect to the Internet to continue sending messages.'),
            elevation: 24.0,
            backgroundColor: Color(0xFFF8D159),
          ));
}
