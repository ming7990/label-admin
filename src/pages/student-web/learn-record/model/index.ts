import { useState } from 'react';
import { learnRecordApi, courseListApi, scoreApi, dialogueRecordApi } from './api';

export const useLearnModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const learnRecord = async (params?: any) => {
    setLoading(true);
    let res: any = await learnRecordApi(params);
    setLoading(false);
    return res;
  };

  const courseList = async (params?: any) => {
    setLoading(true);
    let res: any = await courseListApi(params);
    setLoading(false);
    return res;
  };

  const scoreRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await scoreApi(params);
    setLoading(false);
    return res;
  };

  const dialogueRecord = async (params?: any) => {
    setLoading(true);
    let res: any = await dialogueRecordApi(params);
    setLoading(false);
    return res;
  };

  return {
    learnRecord,
    courseList,
    scoreRequest,
    dialogueRecord,
  };
};
