'use client';

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function Page() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [socket, setSocket] = useState(null); 
  const [socketId, setSocketId] = useState(""); 

  useEffect(() => {
    const socket_instance = io("http://localhost:4000");
    setSocket(socket_instance);

    socket_instance.on("connect", () => {
      setSocketId(socket_instance.id);
      handle_mssg_received(`You connected with id ${socket_instance.id}`);
    });

    socket_instance.on("message_received", (message) => {
      handle_mssg_received(message);
    });

    return () => {
      if (socket_instance) {
        socket_instance.disconnect();
      }
    };
  }, []);

  function handle_mssg_change(e) {
    setMessage(e.target.value);
  }

  function handle_room_change(e) {
    setRoom(e.target.value);
  }

  function handle_room() {
    if (room.trim() !== '') {
      socket.emit('room_join', room); 
    } else {
      alert("Room name cannot be empty :)");
    }
  }

  function handle_mssg_sent() {
    if (message.trim() !== "") {
      socket.emit('message_sent', message, room); 
      const message2 = { text: message, type: 'sent' };
      setMessagesList(prev => [...prev, message2]);
      setMessage(""); 
    } else {
      alert("Message cannot be empty :)");
    }
  }

  function handle_enter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handle_mssg_sent();
    }
  };

  function handle_mssg_received(receivedMessage) {
    const newMessage = { text: receivedMessage, type: 'received' };
    setMessagesList(prevMessages => [...prevMessages, newMessage]); 
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold pt-4 text-center text-blue-400">Rooms</h1>

      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="h-[500px] w-[800px] border border-gray-600 rounded-lg shadow-lg overflow-hidden">
          <div className="h-[460px] w-full overflow-y-auto p-4">
            {messagesList.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md transition-transform duration-300 ease-in-out transform ${
                  msg.type === "received" ? "bg-blue-600" : "bg-gray-700"
                }`}
                style={{ opacity: 1 }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <span className="pt-3 flex items-center justify-between">
            <input
              type="text"
              placeholder="Enter message...."
              className="border border-slate-400 w-[760px] p-2 rounded bg-gray-800 text-white"
              value={message}
              onChange={handle_mssg_change}
              onKeyDown={handle_enter}
            />
            <button
              type="submit"
              className="border border-gray-400 bg-blue-600 text-sm h-[36px] w-20 rounded ml-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
              onClick={handle_mssg_sent}
            >
              Send
            </button>
          </span>
        </div>

        <div className="flex space-x-5 py-3">
          <input
            type="text"
            placeholder="Enter room name...."
            className="border border-slate-400 p-2 rounded bg-gray-800 text-white"
          />
          <button className="border border-gray-400 bg-blue-600 rounded-md p-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700">
            Create room
          </button>
        </div>

        <div className="flex space-x-5 py-3">
          <input
            type="text"
            placeholder="Enter room name...."
            className="border border-slate-400 p-2 rounded bg-gray-800 text-white"
            value={room}
            onChange={handle_room_change}
          />
          <button 
            className="border border-gray-400 bg-blue-600 rounded-md p-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700" 
            onClick={handle_room}
          >
            Join room
          </button>
        </div>
      </div>
    </div>
  );
}
