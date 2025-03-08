import { useState } from "react";
import OpenAI from "openai";

const API_KEY = process.env.PLASMO_PUBLIC_OPENAI_API_KEY;
const SYSTEM_PROMPT = process.env.PLASMO_PUBLIC_CHAT_SYSTEM_PROMPT;

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export const useChatGPT = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const sendMessage = async (messages) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.7,
        });
        
        if (!response.choices || response.choices.length === 0) {
          throw new Error("Brak odpowiedzi od OpenAI");
        }
        
        return response.choices[0].message.content;
      } catch (err) {
        setError(err.message);
        console.error("Błąd OpenAI:", err);
        return "Przepraszam, wystąpił problem z moją odpowiedzią.";
      } finally {
        setIsLoading(false);
      }
    };
  
    return { sendMessage, isLoading, error };
  };