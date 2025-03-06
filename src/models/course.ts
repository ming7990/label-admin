import { useState } from 'react';

export default function useCourseModel() {
  const [courseInfo, setCourseInfo] = useState<any>({});

  return {
    courseInfo,
    setCourseInfo,
  };
}
