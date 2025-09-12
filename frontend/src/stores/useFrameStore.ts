import { create } from "zustand";
import axios, { AxiosError } from "axios";

interface Frame{
    id: string,
    title: string,
    description: string
}

interface Message{
    id: string,
    frame_id: string,
    content: string,
    created_at: Date,
    role: string
}

interface FrameStore{
    frames: Frame[] ;
    error: string | null;

    getFrames: () => Promise<boolean>;
    isgetFramesloading: boolean;
    addFrame: (data: {title: string, description: string}) => Promise<boolean>;
    isaddFrameloading: boolean;
    deleteFrame: (id: string) => Promise<boolean>;
    isdeleteFrameloading: boolean;
    getMessages: (frameId: string) => Promise<Message[] | false>;
    isgetMessagesloading: boolean;
    uploadfile: (file: File, frameId: string) => Promise<boolean>;
    isuploadfileloading: boolean;
    uploadlink: (url: string, frameId: string) => Promise<boolean>;
    isuploadlinkloading: boolean;
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
        frames:[],
        isgetFramesloading: false,
        isaddFrameloading: false,
        isdeleteFrameloading: false,
        isgetMessagesloading: false,
        isuploadfileloading: false,
        isuploadlinkloading: false,
        error: null,

        getFrames: async () => {
            set({ isgetFramesloading: true, error: null });
            const token = getToken();
            if (!token) {
                set({ error: "No auth token found", isgetFramesloading: false });
                return false;
            }
            try {
                const res = await axios.get<{ frames: Frame[] }>(
                    `http://localhost:5000/api/v1/frame/list`,
                    {
                        headers:{
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
                    `http://localhost:5000/api/v1/frame/${frameId}/massages`,
                    {
                        headers:{
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                set({ isgetMessagesloading: false });
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
                `http://localhost:5000/api/v1/frame/create`,
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
                description: res.data.description
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
                    `http://localhost:5000/api/v1/frame/delete/${id}`,{
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
                    `http://localhost:5000/api/v1/frame/${frameId}/materials`,
                    formData,
                    {
                        headers:{
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                console.log(res.data);
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

        uploadlink: async (url:string, frameId: string)=> {
            set({ isuploadlinkloading: true, error: null });
            const token = getToken();
            if (!token) {
                set({ error: "No auth token found", isuploadlinkloading: false });
                return false;
            }
            try {
                const res = await axios.post(
                    `http://localhost:5000/api/v1/frame/${frameId}/materials/link`,
                    { url },
                    {
                        headers:{
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                console.log(res.data);
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

        }
    })
)

export default useFrameStore;