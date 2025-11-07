import { create } from 'zustand';

interface VoiceState {
  activeInputId: string | null;
  setActiveInputId: (id: string | null) => void;
  stopCurrentInput: (() => void) | null;
  setStopCurrentInput: (stopFn: (() => void) | null) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  activeInputId: null,
  setActiveInputId: (id) => set({ activeInputId: id }),
  stopCurrentInput: null,
  setStopCurrentInput: (stopFn) => set({ stopCurrentInput: stopFn }),
}));
