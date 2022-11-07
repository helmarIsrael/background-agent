from turtle import *

def f(pen, length, depth):
    if depth == 0:
        pen.forward(length)
    else:
        f(pen,length/3, depth - 1)
        pen.right(60)
        f(pen,length/3, depth - 1)
        pen.left(120)
        f(pen,length/3, depth - 1)
        pen.right(60)
        f(pen,length/3, depth-1)

g = Pen()
f(g,500,4)
raw_input("dfd")
