received_messages = []
status = 0
show_has_run = False

def show():
    f = open('studentapp\message_handler\msg.txt', 'r')
    contents = f.read()
    print(contents)

# class receiveMSG():
#     def __init__(self, status = None):
#         self.status = 0

#     def show(self):
#         if self.status == 0:
#             self.status = 1
#         else:
#             self.status = 0
#     # f = open("msg.txt", "r")
#     # contents = f.read()
#     # print(contents)
#     # with open("msg.txt",'w') as file:
#     #     pass
#     def printStatus(self):
#         if self.status == 1:
#             print(f'status: {self.status}')