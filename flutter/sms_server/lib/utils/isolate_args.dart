import 'dart:isolate';

class RequiredArgs {
  late final SendPort sendPort;
  late var id;

  RequiredArgs(this.id, this.sendPort);
}
