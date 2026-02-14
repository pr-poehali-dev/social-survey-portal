import { ChatGPTPlaygroundPage } from "@/components/extensions/chatgpt-polza/ChatGPTPlaygroundPage";

const API_URL = "https://functions.poehali.dev/dc9cfd8b-5488-4904-be8a-14495c12ee66";

const ChatGPT = () => {
  return <ChatGPTPlaygroundPage apiUrl={API_URL} defaultModel="openai/gpt-4o-mini" />;
};

export default ChatGPT;
