import { getCurrentWindow } from '@tauri-apps/api/window';
import { PlusIcon, XIcon } from 'lucide-react';
import useStore from '../store';

const appWindow = getCurrentWindow();

const macTitleIconColors = [
  {
    color: '#FF605C',
    onClick: () => {
      appWindow?.close();
    },
  },
  {
    color: '#FFD52E',
    onClick: () => {
      appWindow?.minimize();
    },
  },
  {
    color: '#27C93F',
    onClick: () => {
      appWindow?.unmaximize();
    },
  },
];

function Tabs() {
  const { tabs, current, addTab, setCurrent } = useStore();

  return (
    <div className="flex items-center h-full pl-4" data-tauri-drag-region>
      {macTitleIconColors.map((icon, index) => (
        <div
          key={index}
          className="group w-3 h-3 flex items-center justify-center rounded-full mr-3 cursor-pointer"
          style={{
            backgroundColor: icon.color,
          }}
          onClick={icon.onClick}
        >
          <div className="w-1 h-1 group-hover:bg-black rounded-full" />
        </div>
      ))}
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex w-[10rem] border-r border-[#3f4152] h-full items-center px-4 ${
            tab.id === current.id ? 'bg-[#303240]' : ''
          } ${tab.id === current.id ? 'text-white' : 'text-gray-300'}`}
          onClick={() => {
            setCurrent(tab.id);
          }}
        >
          <h1
            className={`text-sm flex-1 font-medium ${
              tab.id === current.id ? '' : 'opacity-40'
            }`}
          >
            {tab.title}
          </h1>
          <XIcon className="min-w-4 h-4 ml-1 cursor-pointer" />
        </div>
      ))}
      <button
        className="h-full flex items-center px-2 hover:bg-[#363949]"
        onClick={() => {
          addTab();
        }}
      >
        <h1 className="text-sm">
          <PlusIcon className="min-w-4 h-4 mr-1" />
        </h1>
      </button>
    </div>
  );
}

export default Tabs;
