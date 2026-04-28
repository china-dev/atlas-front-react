import { create } from 'zustand'

interface BreadcrumbStore {
  title: string | null
  setTitle: (title: string) => void
  clearTitle: () => void
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  title: null,
  setTitle: (title) => set({ title }),
  clearTitle: () => set({ title: null }),
}))
