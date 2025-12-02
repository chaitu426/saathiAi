import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

interface Frame {
  id: string,
  title: string,
  description: string,
  materialCount?: string,
  messageCount?: String
}

interface Message {
  id: string,
  frame_id: string,
  content: string,
  created_at: Date,
  role: string
}

interface Material {
  id: string,
  title: string,
  type: string,
  url: string,
  ai_summary: string
  processed_status: string,
  created_at: Date
}

interface FrameStore {
  frames: Frame[];
  error: string | null;
  jobid: string;

  getFrames: () => Promise<boolean>;
  isgetFramesloading: boolean;
  addFrame: (data: { title: string, description: string }) => Promise<boolean>;
  isaddFrameloading: boolean;
  deleteFrame: (id: string) => Promise<boolean>;
  isdeleteFrameloading: boolean;
  getMessages: (frameId: string) => Promise<Message[] | false>;
  isgetMessagesloading: boolean;
  uploadfile: (file: File, frameId: string) => Promise<boolean>;
  isuploadfileloading: boolean;
  uploadlink: (url: string, frameId: string) => Promise<boolean>;
  isuploadlinkloading: boolean;
  chat: (query: string, frameId: string, isRagEnabled: boolean) => Promise<boolean>;
  ischatloading: boolean;
  docs: (frameId: string) => Promise<Material[] | false>;
  isdocsloading: boolean;

  messages?: Message[];
  Materials: Material[];
}

const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;

    // zustand/persist stores JSON with { state: {...} }
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

const useFrameStore = create<FrameStore>()(
  (set) => ({
    frames: [],
    Materials: [],
    isgetFramesloading: false,
    isaddFrameloading: false,
    isdeleteFrameloading: false,
    isgetMessagesloading: false,
    isuploadfileloading: false,
    isuploadlinkloading: false,
    ischatloading: false,
    isdocsloading: false,
    error: null,
    jobid: null,

    getFrames: async () => {
      set({ isgetFramesloading: true, error: null });
      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", isgetFramesloading: false });
        return false;
      }
      try {
        const res = await axios.get<{ frames: Frame[] }>(
          `${BASE_URL}/api/v1/frame/list`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log(res.data);
        set({ frames: res.data, isgetFramesloading: false });
        return true;
      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isgetFramesloading: false });
        return false;
      }
    },

    getMessages: async (frameId: string) => {
      set({ isgetMessagesloading: true, error: null });
      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", isgetMessagesloading: false });
        return false;
      }
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/frame/${frameId}/massages`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        set({ isgetMessagesloading: false });
        set({ messages: res.data });
        return res.data;

      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isgetMessagesloading: false });
        return false;
      }
    },

    addFrame: async (data) => {
      set({ isaddFrameloading: true, error: null });
      try {
        const res = await axios.post<Frame>(
          `${BASE_URL}/api/v1/frame/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        // Transform snake_case -> camelCase if needed
        const newFrame: Frame = {
          id: res.data.id,
          title: res.data.title,
          description: res.data.description,
        };

        set((state) => ({
          frames: [...state.frames, newFrame],
          isaddFrameloading: false,
        }));

        return true;
      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isaddFrameloading: false });
        return false;
      }
    },


    deleteFrame: async (id) => {
      set({ isdeleteFrameloading: true, error: null });
      try {
        await axios.delete(
          `${BASE_URL}/api/v1/frame/delete/${id}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
        );
        set((state) => ({
          frames: state.frames ? state.frames.filter(frame => frame.id !== id) : null,
          isdeleteFrameloading: false
        }));
        return true;
      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }
        set({ error: message, isdeleteFrameloading: false });
        return false;
      }
    },

    uploadfile: async (file: File, frameId: string) => {
      set({ isuploadfileloading: true, error: null });
      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", isuploadfileloading: false });
        return false;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          `${BASE_URL}/api/v1/frame/${frameId}/materials`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        console.log(res.data);
        set({ jobid: res.data.jobid })
        set({ isuploadfileloading: false });
        return true;
      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isuploadfileloading: false });
        return false;
      }
    },

    uploadlink: async (url: string, frameId: string) => {
      set({ isuploadlinkloading: true, error: null });
      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", isuploadlinkloading: false });
        return false;
      }
      try {
        const res = await axios.post(
          `${BASE_URL}/api/v1/frame/${frameId}/materials/link`,
          { url },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        console.log(res.data);
        set({ jobid: res.data.jobid })
        set({ isuploadlinkloading: false });
        return true;
      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isuploadlinkloading: false });
        return false;
      }

    },

    chat: async (frameId: string, query: string, isRagEnabled: boolean) => {
      set({ ischatloading: true, error: null });

      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", ischatloading: false });
        return false;
      }

      try {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: query,
          created_at: new Date(),
          frame_id: frameId

        }
        set((state): Partial<FrameStore> => ({
          messages: [...(state.messages ?? []), userMessage],
        }));

        const assistantId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
          id: assistantId,
          role: "assistant",
          content: "",
          created_at: new Date(),
          frame_id: frameId
        }
        set((state): Partial<FrameStore> => ({
          messages: [...(state.messages ?? []), assistantMessage],
        }));
        const eventSource = new EventSourcePolyfill(
          `${BASE_URL}/api/v1/frame/${frameId}/chat?query=${encodeURIComponent(query)}&rag=${isRagEnabled}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        eventSource.onmessage = (event) => {
          const chunk = event.data;
          if (chunk === "done") {
            eventSource.close();
            set({ ischatloading: false });
            return;
          }
          console.log("Received chunk:", chunk);
          set((state): Partial<FrameStore> => ({
            messages: state.messages?.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunk } // append live
                : msg
            ),
          }));
        };



        eventSource.addEventListener("done", () => {
          eventSource.close();
          set({ ischatloading: false });
        })

        eventSource.onerror = (err) => {
          console.error("EventSource failed:", err);
          eventSource.close();
          set({ error: "Chat connection error.", ischatloading: false });
        }
        return true;
      } catch (err: any) {
        console.error(err);
        set({ error: "Something went wrong.", ischatloading: false });
        return false;
      }
    },

    docs: async (frameId: string) => {
      set({ isdocsloading: true, error: null });
      const token = getToken();
      if (!token) {
        set({ error: "No auth token found", isgetMessagesloading: false });
        return false;
      }
      try {
        const res = await axios.get<Material[]>(
          `${BASE_URL}/api/v1/frame/docs/${frameId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        set({ isgetMessagesloading: false });
        set({ Materials: res.data });

      } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          message = axiosErr.response?.data?.message || axiosErr.message || message;
        }

        set({ error: message, isdocsloading: false });
        return false;
      }
    }


  })
)

export default useFrameStore;