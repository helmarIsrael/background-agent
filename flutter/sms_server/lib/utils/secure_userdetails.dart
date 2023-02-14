import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class CredsSecureStorage {
  static final _storage = new FlutterSecureStorage();

  static Future setUsername(String username) async =>
      await _storage.write(key: 'username', value: username);

  static Future<String?> getUsername() async =>
      await _storage.read(key: 'username');

  static Future deleteUsername() async =>
      await _storage.delete(key: 'username');

  static Future setUserPass(String password) async =>
      await _storage.write(key: 'password', value: password);

  static Future<String?> getUserPass() async =>
      await _storage.read(key: 'password');

  static Future deleteUserPass() async =>
      await _storage.delete(key: 'username');

  static Future setUserToken(String token) async =>
      await _storage.write(key: 'token', value: token);

  static Future<String?> getUserToken() async =>
      await _storage.read(key: 'token');

  static Future deleteUserToken() async => await _storage.delete(key: 'token');
}
