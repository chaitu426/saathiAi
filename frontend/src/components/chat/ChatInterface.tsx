import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  User,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload, Material } from "./FileUpload";
import { motion, AnimatePresence } from "framer-motion";
import useFrameStore from "@/stores/useFrameStore";

export interface ChatMessage {
    id: string,
    frame_id: string,
    content: string,
    created_at: Date,
    role: string
}

interface ChatInterfaceProps {
  frameId?: string;
}

export function ChatInterface({ frameId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {getMessages, loading, error} = useFrameStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    getMessages(frameId).then((message) => {
      if (message){ 
        setMessages(message)
        console.log(message)
      };

    }
    );
  }, [frameId, getMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "✨ Let me think on that and give you a detailed explanation with examples...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 `}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm 
            ${message.role === "user" ? "bg-neutral-800 border-neutral-700" : "bg-neutral-900 border-neutral-800"}`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Bot className="h-4 w-4 text-neutral-400" />
                )}
              </div>

              {/* Message Bubble */}
              <Card
                className={`rounded-xl shadow-sm border backdrop-blur-sm text-sm leading-relaxed 
            ${message.role === "user"
                    ? "bg-neutral-900/80 border-none"
                    : "bg-neutral-950 border-none"
                  }`}
              >
                <CardContent className="p-4 whitespace-pre-wrap text-neutral-200">
                  {message.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-sm">
                <Bot className="h-4 w-4 text-neutral-400" />
              </div>
              <Card className="bg-neutral-950/70 border border-neutral-800 rounded-xl shadow-sm backdrop-blur-sm">
                <CardContent className="p-4 flex gap-2 items-center text-neutral-400 text-sm">
                  <motion.div
                    className="w-2 h-2 bg-neutral-500 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-neutral-500 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-neutral-500 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                  <span>StudyBuddy is thinking…</span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>


      {/* Input */}
      <div className="sticky bottom-0  bg-neutral-950/80 backdrop-blur-xl p-2 pb-6">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-2 shadow-lg backdrop-blur-lg transition-colors focus-within:border-neutral-600"
          >
            {/* Animated light beam around edge */}
            

            <Button
              variant="ghost"
              size="icon"
              className="relative z-10 text-neutral-400 hover:text-neutral-200 transition-transform hover:scale-110"
              onClick={() => setIsMaterialDialogOpen(true)}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message StudyBuddy..."
              className="relative z-10 flex-1 border-0 bg-transparent text-sm text-neutral-200 placeholder-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <motion.div whileTap={{ scale: 0.9 }} className="relative z-10">
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 h-9 shadow-md transition-all disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>


        <FileUpload
          isOpen={isMaterialDialogOpen}
          onOpenChange={setIsMaterialDialogOpen}
          onMaterialAdd={() => { }}
          frameId={frameId}
        />
      </div>
    </div>
  );
}
