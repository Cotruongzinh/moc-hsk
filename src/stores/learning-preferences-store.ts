import { create } from 'zustand'

export type AudioSpeed = 0.75 | 1 | 1.25

type LearningPreferencesState = {
  showPronunciation: boolean
  autoPlayAudio: boolean
  audioSpeed: AudioSpeed

  togglePronunciation: () => void
  toggleAutoPlay: () => void
  setAudioSpeed: (speed: AudioSpeed) => void
}

export const useLearningPreferencesStore =
  create<LearningPreferencesState>()((set) => ({
    showPronunciation: true,
    autoPlayAudio: false,
    audioSpeed: 1,

    togglePronunciation: () =>
      set((state) => ({
        showPronunciation: !state.showPronunciation,
      })),

    toggleAutoPlay: () =>
      set((state) => ({
        autoPlayAudio: !state.autoPlayAudio,
      })),

    setAudioSpeed: (audioSpeed) =>
      set({
        audioSpeed,
      }),
  }))
