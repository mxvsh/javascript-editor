import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Tab = {
  id: number;
  title: string;
  code: string;
  output: string;
};

type State = {
  tabs: Tab[];
  current: Tab;
};

type Actions = {
  addTab: () => void;
  updateCode: (id: number, code: string) => void;
  updateOutput: (id: number, output: string) => void;
  setCurrent: (id: number) => void;
};

let initialTab: Tab = {
  id: 1,
  title: 'Tab 1',
  code: `// Write your JavaScript code here`,
  output: '',
};

const useStore = create<State & Actions>()(
  persist(
    set => ({
      current: initialTab,
      tabs: [initialTab],

      addTab() {
        set(state => {
          const id = state.tabs.length + 1;
          const newTab: Tab = {
            id,
            title: `Tab ${id}`,
            code: `// Write your JavaScript code here`,
            output: '',
          };
          state.tabs.push(newTab);
          return { tabs: state.tabs, current: newTab };
        });
      },

      updateCode: (id, code) => {
        set(state => {
          const tab = state.tabs.find(tab => tab.id === id);
          if (tab) {
            tab.code = code;
          }
          return {
            tabs: state.tabs,
            current: tab || state.current,
          };
        });
      },

      updateOutput: (id, output) =>
        set(state => {
          const tab = state.tabs.find(tab => tab.id === id);
          if (tab) {
            tab.output = output;
          }
          return {
            tabs: state.tabs,
            current: tab || state.current,
          };
        }),

      setCurrent: id =>
        set(state => {
          const tab = state.tabs.find(tab => tab.id === id);
          if (tab) {
            state.current = tab;
          }
          return { current: state.current };
        }),
    }),
    {
      name: 'tabs_x',
    },
  ),
);

export default useStore;
