import { useRef } from 'react';

export default function useGundamModel() {
  // 音频播放相关
  const voiceListener = useRef<any>({
    listeners: [],
  });

  const addListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;
    if (val && listeners.indexOf(val) === -1) {
      listeners.push(val);
    }
  };

  const removeListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;
    const index = listeners.indexOf(val);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  const stopOtherListener = (val: any) => {
    const listeners: any[] = voiceListener.current.listeners;

    listeners.forEach((obj: any) => {
      // 循环调用暂停
      if (obj !== val) {
        obj?.pause?.();
      }
    });
  };

  return {
    addListener,
    removeListener,
    stopOtherListener,
  };
}
