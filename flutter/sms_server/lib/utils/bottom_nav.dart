// import 'package:flutter/material.dart';

// Widget bottomNav(BuildContext context) {
//   return Align(
//       alignment: AlignmentDirectional(0, 0),
//       child: Container(
//         width: double.infinity,
//         decoration: BoxDecoration(
//           color: Color(0xFFF8D159),
//           boxShadow: [
//             BoxShadow(
//               blurRadius: 4,
//               color: Color(0x55000000),
//               offset: Offset(0, 2),
//             )
//           ],
//           borderRadius: BorderRadius.only(
//             bottomLeft: Radius.circular(0),
//             bottomRight: Radius.circular(0),
//             topLeft: Radius.circular(16),
//             topRight: Radius.circular(16),
//           ),
//         ),
//         child: Padding(
//             padding: EdgeInsetsDirectional.fromSTEB(16, 16, 16, 52),
//             child: Row(
//               mainAxisSize: MainAxisSize.max,
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 SizedBox(
//                   height: 50,
//                   width: 160,
//                   child: ElevatedButton(
//                     onPressed: () {
//                       Navigator.pushReplacementNamed(context, '/messages');
//                     },
//                     style: ElevatedButton.styleFrom(
//                         primary: Colors.white, onPrimary: Color(0xFFF8D159)),
//                     child: Text('Messages',
//                         style: TextStyle(
//                           fontFamily: 'Montseratt',
//                           fontSize: 15,
//                         )),
//                   ),
//                 ),
//                 SizedBox(
//                   width: 7,
//                 ),
//                 SizedBox(
//                   height: 50,
//                   width: 160,
//                   child: ElevatedButton(
//                     onPressed: () async {
//                       Navigator.pushReplacementNamed(context, '/home');
//                     },
//                     style: ElevatedButton.styleFrom(
//                         primary: Colors.white, onPrimary: Color(0xFFF8D159)),
//                     child: Text('Home',
//                         style: TextStyle(
//                           fontFamily: 'Montseratt',
//                           fontSize: 15,
//                         )),
//                   ),
//                 )
//               ],
//             )),
//       ));
// }
