import { useState, useEffect, useRef } from "react";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import "./chatStyles.css";
import { useChatGPT } from "./functions";
import assistantIcon from "data-base64:~assets/icon.png";

interface Message {
    position: "right" | "left";
    type: string;
    text: string;
    date: Date;
    title?: string;
    avatar?: string;
    className?: string;
}

function Assistant() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);
    const { sendMessage, isLoading } = useChatGPT();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isUserBlocked) return;

        setIsUserBlocked(true);

        const newUserMessage: Message = {
            position: "right",
            type: "text",
            text: inputValue,
            date: new Date(),
            title: "Ty",
            className: "my-message",
        };

        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInputValue("");

        const chatHistory = messages.map(msg => ({
            role: msg.position === "right" ? "user" : "assistant",
            content: msg.text
        }));

        const assistantResponse = await sendMessage([...chatHistory, { role: "user", content: inputValue }]);

        if (assistantResponse) {
            const assistantReply: Message = {
                position: "left",
                type: "text",
                text: assistantResponse,
                date: new Date(),
                title: "Szczurosław",
                avatar: assistantIcon,
                className: "their-message",
            };
            setMessages((prevMessages) => [...prevMessages, assistantReply]);
        }

        setIsUserBlocked(false);
    };

    return (
        <div className="w-full h-96 flex flex-col rounded-lg shadow-lg overflow-hidden bg-[#dda15e]">
            <div className="flex-1 overflow-y-auto p-4 bg-[#ffe6a7]">
                <MessageList
                    className="message-list"
                    dataSource={messages}
                    lockable={true}
                    toBottomHeight={"100%"}
                />
                {isLoading && (
                    <div className="text-left p-2 italic text-[#99582a] animate-pulse">
                        Szczurosław pisze...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t bg-[#99582a]">
                <Input
                    className="w-full rounded-md shadow-md"
                    inputStyle={{
                        color: "#ffe6a7", 
                        backgroundColor: "#99582a", 
                    }}
                    placeholder={isUserBlocked ? "" : "Zapytaj o coś Szczurosława"}
                    maxHeight={100}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isUserBlocked) handleSend();
                    }}
                    disabled={isUserBlocked}
                />
            </div>
        </div>
    );
}

export default Assistant;
