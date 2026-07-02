import create from 'zustand';
import type { User } from '../types/index';

interface AppState {
  // Current user
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Modals
  modals: {
    createProject: boolean;
    createTask: boolean;
    taskDetail: boolean;
    userProfile: boolean;
  };
  openModal: (modal: keyof AppState['modals']) => void;
  closeModal: (modal: keyof AppState['modals']) => void;

  // Selected items
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;

  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;

  selectedSprintId: string | null; // 'backlog' or sprint ID
  setSelectedSprintId: (id: string | null) => void;

  // Toast notifications
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Current user
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modals
  modals: {
    createProject: false,
    createTask: false,
    taskDetail: false,
    userProfile: false,
  },
  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    })),

  // Selected items
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  selectedTaskId: null,
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),

  selectedSprintId: 'backlog',
  setSelectedSprintId: (id) => set({ selectedSprintId: id }),

  // Toast notifications
  toasts: [],
  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: Math.random().toString(36).substr(2, 9),
          message,
          type,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
