import 'package:flutter/foundation.dart';
import 'package:sms_server/model/sentSMS_model.dart';
import 'package:sms_server/objectbox.g.dart';

class ObjectBoxService {
  late final Store _store;
  late final Box<sentSMSDetail> _sentSMSBox;
  late final ByteData store_reference;

  ObjectBoxService._init(this._store) {
    _sentSMSBox = Box<sentSMSDetail>(_store);
    store_reference = _store.reference;
  }

  static Future<ObjectBoxService> init() async {
    // final docsDir = await getApplicationDocumentsDirectory();
    // final store = await openStore(directory: p.join(docsDir.path, "obx-example"));
    final store = await openStore();
    // store.close();
    return ObjectBoxService._init(store);
  }

  int insertMessage(sentSMSDetail message) => _sentSMSBox.put(message);
  sentSMSDetail? getMessage(int id) => _sentSMSBox.get(id);
  List getAllMessages() => _sentSMSBox.getAll();

  bool deleteMessage(int id) => _sentSMSBox.remove(id);
  clearMessages() => _sentSMSBox.removeAll();

  int countMessages() => _sentSMSBox.count();
}
