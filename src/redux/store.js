import { configureStore, createSlice } from "@reduxjs/toolkit";

export const storageKey = "taskmatrix-state-v1";

const initialTasks = {
  items: [],
  query: "",
};

const initialUI = {
  sidebarOpen: false,
  taskId: null,
  createTaskModal: false,
  editingTask: null,
  selectedTask: null,
};

const initialTheme = {
  dark: false,
};

const initialNotifications = {
  unread: 3,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialTasks,
  reducers: {
    hydrateTasks: (state, action) => {
      const payload = action.payload ?? {};
      state.items = Array.isArray(payload.items) ? payload.items : [];
      state.query = payload.query ?? "";
    },

    moveTask: (state, action) => {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },

    setQuery: (state, action) => {
      state.query = action.payload;
    },

    addTask: (state, action) => {
      const payload = action.payload ?? {};
      state.items.unshift({
        ...payload,
        comments: payload.comments ?? 0,
        labels: payload.labels ?? [],
      });
    },

    updateTask: (state, action) => {
      const payload = action.payload ?? {};
      const index = state.items.findIndex((task) => task.id === payload.id);

      if (index === -1) return;

      state.items[index] = {
        ...state.items[index],
        ...payload,
      };
    },

    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },

    duplicateTask: (state, action) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (!task) return;

      state.items.unshift({
        ...task,
        id: crypto.randomUUID(),
        key: `${task.key}-COPY`,
        title: `${task.title} Copy`,
        comments: 0,
      });
    },
  },
});

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUI,
  reducers: {
    hydrateUi: (state, action) => {
      const payload = action.payload ?? {};

      state.sidebarOpen = Boolean(payload.sidebarOpen);
      state.taskId = payload.taskId ?? null;
      state.createTaskModal = Boolean(payload.createTaskModal);
      state.editingTask = payload.editingTask ?? null;
      state.selectedTask = payload.selectedTask ?? null;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    openTask: (state, action) => {
      state.taskId = action.payload;
      state.selectedTask = action.payload;
    },

    closeTask: (state) => {
      state.taskId = null;
      state.selectedTask = null;
    },

    openCreateTask: (state, action) => {
      state.createTaskModal = true;
      state.editingTask = action.payload ?? null;
    },

    closeCreateTask: (state) => {
      state.createTaskModal = false;
      state.editingTask = null;
    },
  },
});

const themeSlice = createSlice({
  name: "theme",
  initialState: initialTheme,
  reducers: {
    hydrateTheme: (state, action) => {
      state.dark = Boolean(action.payload?.dark);
    },

    toggleTheme: (state) => {
      state.dark = !state.dark;
    },

    setTheme: (state, action) => {
      state.dark = Boolean(action.payload);
    },
  },
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialNotifications,
  reducers: {
    hydrateNotifications: (state, action) => {
      state.unread = Number(action.payload?.unread) || 0;
    },
  },
});

export const {
  hydrateTasks,
  moveTask,
  setQuery,
  addTask,
  updateTask,
  deleteTask,
  duplicateTask,
} = tasksSlice.actions;

export const {
  hydrateUi,
  toggleSidebar,
  openTask,
  closeTask,
  openCreateTask,
  closeCreateTask,
} = uiSlice.actions;

export const {
  hydrateTheme,
  toggleTheme,
  setTheme,
} = themeSlice.actions;

export const {
  hydrateNotifications,
} = notificationsSlice.actions;

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
    ui: uiSlice.reducer,
    theme: themeSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

store.subscribe(() => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(store.getState()));
  } catch (error) {
    console.error("Failed to persist state:", error);
  }
});