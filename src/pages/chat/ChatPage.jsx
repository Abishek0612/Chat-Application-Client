import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChatWindow } from "../../components/chat/ChatWindow";
import { fetchChatById, setCurrentChat } from "../../store/slices/chatSlice";

const ChatPage = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (chatId) {
      dispatch(fetchChatById(chatId));
    } else {
      dispatch(setCurrentChat(null));
    }
  }, [chatId, dispatch]);

  return <ChatWindow />;
};

export default ChatPage;
