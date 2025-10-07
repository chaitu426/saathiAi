import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, User, Bot, Search, Sparkles, ThumbsUp, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "./FileUpload";
import { motion, AnimatePresence } from "framer-motion";
import useFrameStore from "@/stores/useFrameStore";
import Markdown from "./markdown"; // ⬅️ import the refined Markdown component
import Ripple from "../ui/ripple";

export interface ChatMessage {
  id: string;
  frame_id: string;
  content: string;
  created_at: Date;
  role: string;
}

interface ChatInterfaceProps {
  frameId?: string;
}

export function ChatInterface({ frameId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRagEnabled, setIsRagEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const {
    getMessages,
    isgetMessagesloading,
    chat,
    messages,
    ischatloading,
    error,
  } = useFrameStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    getMessages(frameId)
      .then(() => {
        console.log("Messages fetched");
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });
  }, [frameId, getMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const res = await chat(frameId, inputValue, isRagEnabled);
    if (res) setInputValue("");
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
      <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3/5 h-14 lg:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -rotate-12 blur-[6.5rem] -z-10"></div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">
        
        <AnimatePresence>
          {messages?.length === 0 &&(
            <>
             
            <div className=" items-center justify-center overflow-visible">
              <Ripple />
            </div>
            <div className="flex items-center justify-center pt-64">{`Wellcome chaitu`}</div>
            </>
          )}
          {isgetMessagesloading ? (
           <div>loading...</div>
          ) : (
            <>
              {messages?.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3"
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm 
                      ${message.role === "user"
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-neutral-900 border-neutral-800"
                      }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <Card
                    className={`rounded-xl shadow-sm border backdrop-blur-lg text-sm leading-relaxed 
                      ${message.role === "user"
                        ? "bg-neutral-900 border-none"
                        : "bg-neutral-950 border-none"
                      }`}
                  >
                    <CardContent className="p-4 text-neutral-200">
                      {message.role === "assistant" ? (
                        <Markdown>{message.content}</Markdown> // ⬅️ Assistant messages render with Markdown
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-50">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-neutral-500 hover:text-white"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-neutral-500 hover:text-white"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-neutral-950/80 backdrop-blur-xl p-2 pb-6">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-2 shadow-lg backdrop-blur-lg transition-colors focus-within:border-neutral-600"
          >
            {/* Attachments */}
            <Button
              variant="ghost"
              size="icon"
              className="relative z-10 text-neutral-400 hover:text-neutral-200 transition-transform hover:scale-110"
              onClick={() => setIsMaterialDialogOpen(true)}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* 🌌 RAG Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRagEnabled(!isRagEnabled)}
              className={`
                relative z-10 flex items-center justify-center 
                w-10 h-10 rounded-full transition-all duration-300 ease-out
                ${isRagEnabled
                  ? "bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-neutral-800/70"
                }
              `}
            >
              <Sparkles className="h-5 w-5" /> {/* Icon → Sparkles (fits AI/RAG) */}

              {isRagEnabled && (
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  
                </span>
              )}
            </Button>



            {/* Input */}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message StudyBuddy..."
              className="relative z-10 flex-1 border-0 bg-transparent text-sm text-neutral-200 placeholder-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            {/* Send Button */}
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

        {/* File Upload Dialog */}
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



