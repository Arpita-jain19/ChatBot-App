import { useState } from "react";
import axios from "axios";
import "./App.css";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: []
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

const toggleTheme = () => {
  const newTheme = !darkMode;

  setDarkMode(newTheme);

  localStorage.setItem(
    "theme",
    newTheme ? "dark" : "light"
  );
};

  const activeChat = chats.find(
    chat => chat.id === activeChatId
  );

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };

    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

const exportChatToPDF = () => {
  if (!activeChat?.messages.length) {
    alert("No messages to export");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Chat Conversation", 10, 15);

  let y = 30;

  activeChat.messages.forEach((msg) => {
    const sender =
      msg.role === "user" ? "You" : "AI";

    const text = `${sender}: ${msg.text}`;

    const lines = doc.splitTextToSize(
      text,
      180
    );

    doc.text(lines, 10, y);

    y += lines.length * 7 + 5;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`${activeChat.title}.pdf`);
};

const copyToClipboard = (text, index) => {
  navigator.clipboard.writeText(text);

  setCopiedIndex(index);

  setTimeout(() => {
    setCopiedIndex(null);
  }, 2000);
};
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message
    };

    const updatedChats = chats.map(chat => {
  if (chat.id === activeChatId) {

    let title = chat.title;

    // First message of the chat
    if (
      chat.messages.length === 0 &&
      chat.title === "New Chat"
    ) {
      title =
        message.length > 25
          ? message.substring(0, 25) + "..."
          : message;
    }

    return {
      ...chat,
      title,
      messages: [...chat.messages, userMessage]
    };
  }

  return chat;
});
setChats(updatedChats);

    const currentMessage = message;
    setMessage("");

    try {
      setIsTyping(true);

      const response = await axios.post(
        "https://chatbot-app-surx.onrender.com/chat",
        {
          message: currentMessage
        }
      );

      const botMessage = {
        role: "bot",
        text: response.data.reply
      };

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, botMessage]
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "bot",
        text: "Something went wrong."
      };

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage]
            };
          }
          return chat;
        })
      );
    } finally {
      setIsTyping(false);
    }
  };
  const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    setMessage(transcript);
  };
};

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };



const regenerateResponse = async () => {
  if (!activeChat?.messages.length) return;

  const lastUserMessage = [...activeChat.messages]
    .reverse()
    .find(msg => msg.role === "user");

  if (!lastUserMessage) return;

  try {
    setIsTyping(true);

    const response = await axios.post(
      "http://localhost:5000/chat",
      {
        message: lastUserMessage.text
      }
    );

    const botMessage = {
      role: "bot",
      text: response.data.reply
    };

    setChats(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              botMessage
            ]
          };
        }
        return chat;
      })
    );
  } catch (error) {
    console.error(error);
  } finally {
    setIsTyping(false);
  }
};



  return (
    <div
  className={`app ${
    darkMode ? "dark" : "light"
  }`}
>

      {/* Sidebar */}
      <div className="sidebar">
         <button
    className="theme-btn"
    onClick={toggleTheme}
  >
    {darkMode ? "☀️ Light" : "🌙 Dark"}
  </button>

  <button
    className="new-chat-btn"
    onClick={createNewChat}
  >
    + New Chat
  </button>

<button
  className="export-btn"
  onClick={exportChatToPDF}
>
  📄 Export Chat
</button>

        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${
              activeChatId === chat.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveChatId(chat.id)
            }
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="main">

        <h2>AI Chatbot 🤖</h2>

        <div className="chat-box">
          {activeChat?.messages.map(
  (msg, index) => (
    <div key={index}>
      <div
        className={
          msg.role === "user"
            ? "user"
            : "bot"
        }
      >
        <ReactMarkdown
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(
        className || ""
      );

      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  }}
>
  {msg.text}
</ReactMarkdown>
      </div>

      {msg.role === "bot" &&
        index ===
          activeChat.messages.length - 1 && (
          <button
            className="regenerate-btn"
            onClick={regenerateResponse}
          >
            🔄 Regenerate
          </button>
      )}
    </div>
  )
)}
         
          {isTyping && (
            <div className="bot">
              AI is typing...
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={message}
            placeholder="Ask anything..."
            onChange={e =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <button onClick={sendMessage}>
            Send
          </button>
          <button onClick={startListening}>
  🎤
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;