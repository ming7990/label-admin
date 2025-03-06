import { useState } from 'react';

export default function useUpdateModel() {
  const [num, setNum] = useState<any>(0);

  const updatePage = () => {
    setNum(num + 1);
  };

  return {
    updatePage,
  };
}
