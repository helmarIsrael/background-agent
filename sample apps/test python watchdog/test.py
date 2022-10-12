import time
from datetime import datetime, timedelta
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = datetime.now()
    def on_modified(self, event):
        if datetime.now() - self.last_modified < timedelta(seconds=1):
            return
        else:
            self.last_modified = datetime.now()
        return True
event_handler = MyHandler()
observer = Observer()
observer.schedule(event_handler, path='./file', recursive=False)
observer.start()
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
observer.join()