// import { useState, useRef, useEffect } from "react";
// import { Send, Paperclip, User, Bot, Search, Sparkles, ThumbsUp, Check, Copy } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { FileUpload } from "./FileUpload";
// import { motion, AnimatePresence } from "framer-motion";
// import useFrameStore from "@/stores/useFrameStore";
// import Markdown from "./markdown"; // ⬅️ import the refined Markdown component
// import Ripple from "../ui/ripple";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// export interface ChatMessage {
//   id: string;
//   frame_id: string;
//   content: string;
//   created_at: Date;
//   role: string;
// }

// interface ChatInterfaceProps {
//   frameId?: string;
// }

// export function ChatInterface({ frameId }: ChatInterfaceProps) {
//   const [inputValue, setInputValue] = useState("");
//   const [isRagEnabled, setIsRagEnabled] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const {
//     getMessages,
//     isgetMessagesloading,
//     chat,
//     messages,
//     ischatloading,
//     error,
//   } = useFrameStore();
//   const tooltipText = isRagEnabled ? "Disable RAG" : "Enable RAG";

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     getMessages(frameId)
//       .then(() => {
//         console.log("Messages fetched");
//       })
//       .catch((err) => {
//         console.error("Error fetching messages:", err);
//       });
//   }, [frameId, getMessages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const res = await chat(frameId, inputValue, isRagEnabled);
//     if (res) setInputValue("");
//   };

//   const handleCopy = async (content: string, id: string) => {
//     await navigator.clipboard.writeText(content);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 1500);
//   };

//   return (
//     <div className="flex flex-col h-full bg-neutral-950 text-neutral-100">
//       <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3/5 h-14 lg:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -rotate-12 blur-[6.5rem] -z-10"></div>
//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">

//         <AnimatePresence>
//           {messages?.length === 0 && (
//             <>
//               <div className="flex items-center justify-center pt-64">{`Wellcome to sarthi`}</div>
//             </>
//           )}
//           {isgetMessagesloading ? (
//             <div>loading...</div>
//           ) : (
//             <>
//               {messages?.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.25 }}
//                   className="flex gap-3"
//                 >
//                   {/* Avatar */}
//                   <div
//                     className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm 
//                       ${message.role === "user"
//                         ? "bg-neutral-800 border-neutral-700"
//                         : "bg-neutral-900 border-neutral-800"
//                       }`}
//                   >
//                     {message.role === "user" ? (
//                       <User className="h-4 w-4 text-neutral-400" />
//                     ) : (
//                       <Bot className="h-4 w-4 text-neutral-400" />
//                     )}
//                   </div>

//                   {/* Message Bubble */}
//                   <Card
//                     className={`group rounded-xl shadow-sm border backdrop-blur-lg text-sm leading-relaxed 
//                       ${message.role === "user"
//                         ? "bg-neutral-900 border-none"
//                         : "bg-neutral-950 border-none"
//                       }`}
//                   >
//                     <CardContent className="p-4 text-neutral-200">
//                       {message.role === "assistant" ? (
//                         <Markdown >
//                           {message.content}
//                         </Markdown>
//                       ) : (
//                         <p className="whitespace-pre-wrap">{message.content}</p>
//                       )}

//                       {/* Hover Actions */}
//                       <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-50">
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-6 w-6 text-neutral-500 hover:text-white"
//                           onClick={() => handleCopy(message.content, message.id)}
//                         >
//                           {copiedId === message.id ? (
//                             <Check className="h-3 w-3" />
//                           ) : (
//                             <Copy className="h-3 w-3" />
//                           )}
//                         </Button>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-6 w-6 text-neutral-500 hover:text-white"
//                         >
//                           <ThumbsUp className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </>
//           )}
//         </AnimatePresence>
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="sticky bottom-0 bg-neutral-950/80 backdrop-blur-xl p-2 pb-6">
//         <div className="max-w-3xl mx-auto w-full">
//           <motion.div
//             whileFocus={{ scale: 1.02 }}
//             className="relative flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-2 shadow-lg backdrop-blur-lg transition-colors focus-within:border-neutral-600"
//           >
//             {/* Attachments */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="relative z-10 text-neutral-400 hover:text-neutral-200 transition-transform hover:scale-110"
//               onClick={() => setIsMaterialDialogOpen(true)}
//             >
//               <Paperclip className="h-5 w-5" />
//             </Button>

//             {/* 🌌 RAG Toggle */}
//             <TooltipProvider delayDuration={150}>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     onClick={() => setIsRagEnabled(!isRagEnabled)}
//                     className={`
//               relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300
//               ${isRagEnabled ? "bg-white" : "bg-neutral-700"}
//             `}
//                   >
//                     {/* Track Highlight */}
//                     <span
//                       className={`
//                 absolute inset-0 rounded-full transition-opacity duration-300
//                 ${isRagEnabled ? "opacity-100 bg-white/90" : "opacity-0"}
//               `}
//                     />

//                     {/* Sliding Knob */}
//                     <span
//                       className={`
//                 absolute flex items-center justify-center h-5 w-5 bg-black text-white rounded-full 
//                 transform transition-transform duration-300
//                 ${isRagEnabled ? "translate-x-6 bg-black text-white" : "translate-x-1 bg-neutral-300 text-black"}
//               `}
//                     >
//                     </span>
//                   </button>
//                 </TooltipTrigger>

//                 <TooltipContent className="text-xs px-2 py-1">
//                   {tooltipText}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>



//             {/* Input */}
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               placeholder="Message StudyBuddy..."
//               className="relative z-10 flex-1 border-0 bg-transparent text-sm text-neutral-200 placeholder-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
//             />

//             {/* Send Button */}
//             <motion.div whileTap={{ scale: 0.9 }} className="relative z-10">
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={isLoading || !inputValue.trim()}
//                 className="rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 h-9 shadow-md transition-all disabled:opacity-40"
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* File Upload Dialog */}
//         <FileUpload
//           isOpen={isMaterialDialogOpen}
//           onOpenChange={setIsMaterialDialogOpen}
//           onMaterialAdd={() => { }}
//           frameId={frameId}
//         />
//       </div>

//     </div>
//   );
// }











import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, User, Bot, Search, Sparkles, ThumbsUp, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "./FileUpload";
import { motion, AnimatePresence } from "framer-motion";
import useFrameStore from "@/stores/useFrameStore";
import Markdown from "./markdown";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useVideoPanelStore } from "@/stores/videoPanelStore";
import { X, ZoomIn, ZoomOut, Download, ArrowLeft } from "lucide-react";
import { Document, Page } from "react-pdf";

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
  const [isRagEnabled, setIsRagEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showPanel, panelUrl, closePanel, showType, aiSummary } = useVideoPanelStore();
  const {
    getMessages,
    isgetMessagesloading,
    chat,
    messages,
    ischatloading,
    error,
  } = useFrameStore();
  const tooltipText = isRagEnabled ? "Disable RAG" : "Enable RAG";
  const [scale, setScale] = useState(1);

  const isResizing = useRef(false);


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
    <div className="flex h-screen w-full overflow-hidden">
      <PanelGroup autoSaveId="example" direction="horizontal">

        {showPanel &&
          <Panel defaultSize={25}>
            <div
              className=" flex flex-1 flex-col overflow-y-auto bg-neutral-900 border-r border-neutral-800 h-full"
            >
              <div className="w-full h-full bg-black">
                <button className="bg-zinc-800 w-14 justify-center content-center hover:bg-zinc-900 rounded-full text-white m-4"
                  onClick={() =>
                    closePanel()
                  }
                >
                  close
                </button>
                {showType == "YTLink" ? (
                  <iframe
                    className="w-full h-[400px] p-4"
                    src={`https://www.youtube.com/embed/${panelUrl.split("/")[3]}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900">
                      <div className="flex items-center gap-3">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setScale(s => s + 0.1)}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(panelUrl, "_blank")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Viewer */}
                    <div className="w-full h-full overflow-auto bg-neutral-950 flex items-center justify-center p-4">
                      {showType === "image" ? (
                        <img src={panelUrl} style={{ transform: `scale(${scale})` }} className="max-w-full max-h-full rounded-lg" />
                      ) : (
                        <Document file={panelUrl} className="flex flex-col items-center">
                          <Page pageNumber={1} scale={scale} renderAnnotationLayer={false} />
                        </Document>
                      )}
                    </div>
                  </>
                )}


                <p className="p-4">{aiSummary}</p>


              </div>
            </div>
          </Panel>
        }
        {showPanel && <PanelResizeHandle />}



        <Panel defaultSize={50}>
          <div className="flex flex-1 flex-col h-full bg-neutral-950 text-neutral-100">
            <div className="overflow-y-auto">
              {/* Chat messages */}
              <div className="flex-1  px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">

                <AnimatePresence>
                  {messages?.length === 0 && (
                    <>
                      <div className="flex items-center justify-center pt-64">{`Wellcome to sarthi`}</div>
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
                            className={`group rounded-xl shadow-sm border backdrop-blur-lg text-sm leading-relaxed 
                      ${message.role === "user"
                                ? "bg-neutral-900 border-none"
                                : "bg-neutral-950 border-none"
                              }`}
                          >
                            <CardContent className="p-4 text-neutral-200">
                              {message.role === "assistant" ? (
                                <Markdown >
                                  {message.content}
                                </Markdown>
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
            </div>


            {/* Input */}
            <div className="sticky bg-neutral-950/80 backdrop-blur-xl p-2 pb-6">
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
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsRagEnabled(!isRagEnabled)}
                          className={`
              relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300
              ${isRagEnabled ? "bg-white" : "bg-neutral-700"}
            `}
                        >
                          {/* Track Highlight */}
                          <span
                            className={`
                absolute inset-0 rounded-full transition-opacity duration-300
                ${isRagEnabled ? "opacity-100 bg-white/90" : "opacity-0"}
              `}
                          />

                          {/* Sliding Knob */}
                          <span
                            className={`
                absolute flex items-center justify-center h-5 w-5 bg-black text-white rounded-full 
                transform transition-transform duration-300
                ${isRagEnabled ? "translate-x-6 bg-black text-white" : "translate-x-1 bg-neutral-300 text-black"}
              `}
                          >
                          </span>
                        </button>
                      </TooltipTrigger>

                      <TooltipContent className="text-xs px-2 py-1">
                        {tooltipText}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>



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
        </Panel>
      </PanelGroup>
    </div>
  );
}




