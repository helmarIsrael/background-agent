import 'package:sms_server/model/message_model.dart';
import 'package:sms_server/objectbox.g.dart';

class ObjectBoxService {
  late final Store _store;
  late final Box<messageDetail> _messageBox;

  ObjectBoxService._init(this._store) {
    _messageBox = Box<messageDetail>(_store);
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
}
