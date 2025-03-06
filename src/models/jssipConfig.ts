import { useState } from 'react';

export default function useJssipModel() {
  const [jssipInfo, setJssipInfo] = useState<any>({});

  return {
    jssipInfo,
    setJssipInfo,
  };
}
