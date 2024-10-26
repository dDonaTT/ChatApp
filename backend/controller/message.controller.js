import Conversation from "../model/conversation.model.js";
import Message from "../model/mesage.model.js";
import { getReciverSocketId,io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, reciverId],
      },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }
    const newMessage = new Message({
      senderId,
      reciverId,
      message,
    });
    if (newMessage) {
      conversation.message.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("message");
    if (!conversation) return res.status(200).json([]);
    const message = conversation.message;
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
