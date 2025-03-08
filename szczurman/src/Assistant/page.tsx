import { useState, useEffect, useRef } from "react";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useChatGPT } from "./functions";

import assistantIcon from "data-base64:~assets/icon.png";

function Assistant() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const { sendMessage, isLoading } = useChatGPT();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isUserBlocked) return;

    setIsUserBlocked(true);

    const newUserMessage = {
      position: "right",
      type: "text",
      text: inputValue,
      date: new Date(),
      title: "Ty",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");

    const chatHistory = messages.map(msg => ({
      role: msg.position === "right" ? "user" : "assistant",
      content: msg.text
    }));

    const assistantResponse = await sendMessage([...chatHistory, { role: "user", content: inputValue }]);
    
    if (assistantResponse) {
      const assistantReply = {
        position: "left",
        type: "text",
        text: assistantResponse,
        date: new Date(),
        title: "Szczurosław",
        avatar: assistantIcon,
      };
      setMessages((prevMessages) => [...prevMessages, assistantReply]);
    }
    
    setIsUserBlocked(false);
  };

  return (
    <div style={{ width: 500, height: 400, display: "flex", flexDirection: "column", border: "1px solid #ccc" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        <MessageList
          className="message-list"
          dataSource={messages}
          lockable={true}
          toBottomHeight={"100%"}
          referance={null}
        />
        {isLoading && (
          <div style={{ textAlign: "left", padding: "5px 10px", fontStyle: "italic", color: "#888" }}>
            Szczurosław myśli...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 10, borderTop: "1px solid #ccc" }}>
        <Input
          placeholder={isUserBlocked ? "Czekaj na odpowiedź Szczurosława..." : "Napisz wiadomość..."}
          maxHeight={100}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isUserBlocked) handleSend();
          }}
          disabled={isUserBlocked}
        />
      </div>
    </div>
  );
}

export default Assistant;
