import { useState, useRef } from "react";
import { Upload, FileText, Image, Video, Link, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFrameStore from "@/stores/useFrameStore"; // ✅ import store
import { Bounce, toast } from "react-toastify";

export interface Material {
    id: string;
    name: string;
    url: string;
    file?: File;
}

interface FileUploadProps {
    frameId: string; // ✅ added frameId prop
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onMaterialAdd: (material: Material) => void;
}

export function FileUpload({ frameId, isOpen, onOpenChange, onMaterialAdd }: FileUploadProps) {
    const [urlInput, setUrlInput] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { uploadfile, isuploadfileloading, isuploadlinkloading, uploadlink } = useFrameStore(); // ✅ get from store

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // 🔥 Call store upload API
        const success = await uploadfile(file, frameId);

        if (success) {
            const material: Material = {
                id: Date.now().toString(),
                name: file.name,
                url: URL.createObjectURL(file),
                file,
            };
            onMaterialAdd(material);
            onOpenChange(false);

            toast.success("File uploaded successfully", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        }else{
            toast.error("File upload failed", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    const handleUrlSubmit = async () => {
        const success = await uploadlink(urlInput, frameId);
        if (success) {
            const material: Material = {
                id: Date.now().toString(),
                name: urlInput,
                url: urlInput,
            };
            onMaterialAdd(material);
            setUrlInput("");
            onOpenChange(false);

            toast.success("Link added successfully",
                {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                }
            );
        }else{
            toast.error("Failed to add link",
                {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                }
            );
        }
        
    };

    // Drag-n-drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const type = file.type.startsWith("image/") ? "image" : "pdf";
            handleFileUpload(e.dataTransfer.files);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Add Study Material
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="files" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="files">Upload Files</TabsTrigger>
                        <TabsTrigger value="links">Add Links</TabsTrigger>
                    </TabsList>

                    {/* File Upload */}
                    <TabsContent value="files" className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? "border-primary bg-accent/50"
                                : "border-border hover:border-primary/50"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className="h-10 w-10 mx-auto mb-4 text-foreground-muted" />
                            <p className="text-sm text-foreground-muted mb-4">
                                Drag and drop files here, or click to browse
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-col gap-2 h-20 w-80 border-none"
                                    disabled={isuploadfileloading}
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.accept = "image/*", "pdf";
                                            fileInputRef.current.onchange = (e) => {
                                                const target = e.target as HTMLInputElement;
                                                handleFileUpload(target.files);
                                            };
                                            fileInputRef.current.click();
                                        }
                                    }}
                                >
                                    {isuploadfileloading ? <Loader className="animate-spin"/>:
                                    <>
                                    <FileText className="h-6 w-6" />
                                    <span>PDF OR IMAGE</span>
                                    </>
                                    }
                                </Button>
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" />
                    </TabsContent>

                    {/* Links */}
                    <TabsContent value="links" className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="youtube-url" className="text-sm font-medium">
                                    YouTube Video
                                </Label>
                                <div className="flex mt-1">
                                    <Input id="youtube-url" placeholder="https://youtube.com/watch?v=..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="rounded-r-none" />
                                    <Button onClick={() => handleUrlSubmit()} disabled={!urlInput.trim()} className="rounded-l-none" variant="outline" >
                                        {isuploadlinkloading ? <Loader className="animate-spin"/>:
                                        <>
                                            <Video className="h-4 w-4" />
                                        </>
                                        }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
function uploadlink(urlInput: string, type: string) {
    throw new Error("Function not implemented.");
}

