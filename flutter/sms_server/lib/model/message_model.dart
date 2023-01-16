import 'package:objectbox/objectbox.dart';

@Entity()
class messageDetail {
  int id;
  String payload;

  messageDetail({this.id = 0, required this.payload});
}
