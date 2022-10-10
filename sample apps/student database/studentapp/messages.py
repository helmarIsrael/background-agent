received_messages = []

def show():
    f = open("msg.txt", "r")
    contents = f.read()
    received_messages.append(contents)
    print(contents)

if received_messages:
    print(received_messages)