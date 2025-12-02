import { create } from "zustand";



interface VideoPanelState {
  showPanel: boolean;
  panelUrl: string | null;
  showType: string,
  aiSummary: string
  openPanel: (url: string, type:string, ai_summary: string) => void;
  closePanel: () => void;
}

export const useVideoPanelStore = create<VideoPanelState>((set) => ({
  showPanel: false,
  panelUrl: null,
  showType: null,
  aiSummary: null,
  openPanel: (url, type, ai_summary) => set({ showPanel: true, panelUrl: url, showType: type, aiSummary: ai_summary }),
  closePanel: () => set({ showPanel: false, panelUrl: null }),
}));
