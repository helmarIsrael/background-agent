import 'package:flutter/foundation.dart';
import 'package:sms_server/model/message_model.dart';
import 'package:sms_server/model/sentSMS_model.dart';
import 'package:sms_server/objectbox.g.dart';

class ObjectBoxService {
  late final Store _store;
  late final Box<messageDetail> _messageBox;
  late final Box<sentSMSDetail> _sentSMSBox;
  // late final ByteData store_reference;

  ObjectBoxService._init(this._store) {
    _messageBox = Box<messageDetail>(_store);
    _sentSMSBox = Box<sentSMSDetail>(_store);
    // store_reference = _store.reference;
  }

  static Future<ObjectBoxService> init() async {
    // final docsDir = await getApplicationDocumentsDirectory();
    // final store = await openStore(directory: p.join(docsDir.path, "obx-example"));
    final store = await openStore();
    // store.close();
    return ObjectBoxService._init(store);
  }

  int insertMessage(messageDetail message) => _messageBox.put(message);
  messageDetail? getMessage(int id) => _messageBox.get(id);
  List getAllMessages() => _messageBox.getAll();

  bool deleteMessage(int id) => _messageBox.remove(id);
  clearMessages() => _messageBox.removeAll();

  int countMessages() => _messageBox.count();

  int sent_insertMessage(sentSMSDetail message) => _sentSMSBox.put(message);
  sentSMSDetail? sent_getMessage(int id) => _sentSMSBox.get(id);
  List sent_getAllMessages() => _sentSMSBox.getAll();

  bool sent_deleteMessage(int id) => _sentSMSBox.remove(id);
  sent_clearMessages() => _sentSMSBox.removeAll();

  int sent_countMessages() => _sentSMSBox.count();

  // List<sentSMSDetail> getNewMessages() {
  //   Query<sentSMSDetail> query = _sentSMSBox
  //       .query(sentSMSDetail_.timestamp.equals(DateTime.now().toString()))
  //       .build();

  //   List<sentSMSDetail> new_msgs = query.find();
  //   print('new messages:$new_msgs');
  //   return new_msgs;
  // }
}
