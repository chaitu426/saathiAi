"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Settings,
  Trash2,
  Edit2,
  FileText,
  Video,
  Image,
  Link,
  Loader,
  File as FileIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import useFrameStore from "@/stores/useFrameStore";
import ProgressDisplay from "./chat/ProgUpdate";

// Interfaces
export interface Frame {
  id: string;
  title: string;
  description?: string;
  materialCount?: string
  createdAt: Date;
  messageCount: number;
  materials: Material[];
}

export interface Material {
  id: string;
  type: "pdf" | "image" | "youtube" | "webpage";
  name: string;
  url: string;
}


export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const [newFrameTitle, setNewFrameTitle] = useState("");
  const [newFrameDescription, setNewFrameDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { frames, getFrames, isgetFramesloading, isaddFrameloading, isdeleteFrameloading, addFrame, deleteFrame, jobid } = useFrameStore();

  const isCollapsed = state === "collapsed";
  const isActive = (frameId: string) => currentPath === `/chat/${frameId}`;


  useEffect(() => {
    getFrames().then(() => {
      console.log("Frames loaded:", frames);
    });
  }, []);


  const getNavCls = (frameId: string) =>
    isActive(frameId)
      ? "bg-zinc-800/70 border border-zinc-700 text-white"
      : "hover:bg-zinc-800/40 text-zinc-400 hover:text-white";

  // Handlers
  const handleCreateFrame = () => {
    if (!newFrameTitle.trim()) return;
    addFrame({ title: newFrameTitle, description: newFrameDescription });
    // setFrames((prev) => [newFrame, ...prev]);
    setNewFrameTitle("");
    setNewFrameDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteFrame = async (frameId: string) => {
    await deleteFrame(frameId);
  };

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-80"
        } bg-neutral-950 text-neutral-100 backdrop-blur-xl border-r border-zinc-800 transition-all duration-300`}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-zinc-800 p-4">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">StudyBuddy</h2>
            <SidebarTrigger className="rounded-md hover:bg-zinc-800/60 transition-colors" />
          </div>
        )}
        {isCollapsed && <SidebarTrigger className="mx-auto pr-3 rounded-md  transition-colors" />}
      </SidebarHeader>

      {/* Main content */}
      <SidebarContent className="p-4 flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-2">
            {!isCollapsed && "Study Frames"}
          </SidebarGroupLabel>

          {/* Create Button */}
          <div className="mb-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size={isCollapsed ? "icon" : "sm"}
                  className="w-full p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">New Frame</span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-neutral-950 border border-zinc-800 rounded-xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Study Frame</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-zinc-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newFrameTitle}
                      onChange={(e) => setNewFrameTitle(e.target.value)}
                      placeholder="e.g. Calculus Study Session"
                      className="bg-transparent border-border focus-visible:ring-offset-0 text-white focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-zinc-300">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={newFrameDescription}
                      onChange={(e) => setNewFrameDescription(e.target.value)}
                      placeholder="Brief description of your study topic"
                      className="bg-transparent border-border focus-visible:ring-offset-0 text-white focus:border-zinc-600"
                    />
                  </div>
                  <Button
                    onClick={handleCreateFrame}
                    className="w-full bg-zinc-800 text-white hover:bg-zinc-700"
                    disabled={!newFrameTitle.trim()}
                  >
                    {
                      isaddFrameloading ? <Loader className="animate-spin h-4 w-4 mx-auto" /> : "Create Frame"
                    }
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Frames */}
          <SidebarGroupContent>
            {isgetFramesloading ? <Loader className="animate-spin ml-32" /> :
              <>
                <SidebarMenu className="space-y-3">
                  {frames.map((frame) => (
                    <SidebarMenuItem key={frame.id}>
                      {isCollapsed ? (
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={`/chat/${frame.id}`}
                            className={`flex items-center justify-center rounded-lg ${getNavCls(frame.id)}`}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </NavLink>
                        </SidebarMenuButton>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`rounded-xl overflow-hidden border border-zinc-800 ${getNavCls(frame.id)}`}
                        >
                          <Card className="bg-neutral-900/70 border-none shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <NavLink to={`/chat/${frame.id}`} className="block">
                                    <CardTitle className="text-sm font-medium text-white truncate">
                                      {frame.title}
                                    </CardTitle>
                                    {frame.description && (
                                      <CardDescription className="text-xs text-zinc-400 mt-1 line-clamp-2">
                                        {frame.description}
                                      </CardDescription>
                                    )}
                                  </NavLink>
                                  <div className="flex items-center gap-2 py-2 px-2 w-28 rounded-xl bg-neutral-900/60 backdrop-blur-md border border-neutral-800/50 text-sm text-neutral-300">
                                    <div className="flex items-center gap-1 text-neutral-400 text-sm">
                                      {/* Files Count */}
                                        <FileIcon className="w-4 h-4 text-neutral-500" />
                                        <span className="text-neutral-300">{frame.materialCount || 0}</span>
                                      </div>

                                      {/* Divider Dot */}
                                      <span className="w-1 h-1 rounded-full bg-neutral-700"></span>

                                      {/* Messages Count */}
                                      <div className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4 text-neutral-500" />
                                        <span className="text-neutral-300">{frame.messageCount || 0}</span>
                                      </div>
                                    </div>


                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-500 hover:text-white"
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-neutral-900  border border-zinc-800 rounded-lg shadow-lg"
                                    >
                                      <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-800/70">
                                        <Edit2 className="h-3 w-3 mr-2" />
                                        Rename
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-400 hover:bg-red-400/10"
                                        onClick={() => handleDeleteFrame(frame.id)}
                                      >
                                        {isdeleteFrameloading ? <Loader className="animate-spin h-3 w-3 mr-2" /> : <Trash2 className="h-3 w-3 mr-2" />}
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </>
            }
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        {!isCollapsed && (
          <div className="mt-auto pt-2 border-t border-zinc-800">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
