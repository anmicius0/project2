import os
import json

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room


app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)
current_room = None

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chat/<room>")
def chat(room):
    return render_template('chat.html', room_name=room)



@socketio.on("join")
def join(room):

    # get the room (/room)
    join_room(room)

    # if there is already room joined:
    #   chang the room
    if current_room:
        leave_room(current_room)
    global current_room
    current_room = room
    print(current_room)


@socketio.on("submit_chat")
def submit_chat(msg):
    print(msg)
    print(current_room)
    emit("receive_message", msg, broadcast=True, room=current_room)



if __name__ == '__main__':
    socketio.run(app, debug=True)
