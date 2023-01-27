import 'package:objectbox/objectbox.dart';

@Entity()
class sentSMSDetail {
  int id;
  String payload;
  String timestamp;

  sentSMSDetail({this.id = 0, required this.payload, required this.timestamp});
}
