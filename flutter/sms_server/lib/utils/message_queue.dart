import 'dart:collection';

class msg_queue<T> {
  final queue = Queue<T>();

  void push(T t) {
    queue.add(t);
  }

  T pop() {
    final first = queue.first;
    queue.removeFirst();
    return first;
  }

  void showQueue() {
    print(queue);
  }

  int queueSize() {
    final size = queue.length;
    return size;
  }

  bool queueStatus() {
    final status = queue.isEmpty;
    return status;
  }

  // void sendItem() async {
  //   // print(queueStatus());

  //   // print('Item Send: ${pop()}');
  //   // print(queueSize());

  //   Timer(const Duration(seconds: 9), () {
  //     print('Item Send: ${pop()}');
  //     print(queueSize());
  //   });
  // }
}
