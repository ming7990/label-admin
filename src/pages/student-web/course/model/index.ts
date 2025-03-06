import { useState } from 'react';
import { getStudentCourseDetail_API, getStudentCourse_API, studyNumApi } from './api';
import config from '@/config';
import { message } from 'antd';

const { successCode } = config;

export const useCourseModel = () => {
  const [courselist, setCourseList] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);

  const [totalWait, setTotalWait] = useState<number>(0);
  const [totalDone, setTotalDone] = useState<number>(0);

  const getStudentCourse = async (data: any) => {
    setLoading(true);
    let res: any = await getStudentCourse_API(data);
    setLoading(false);
    if (res.resultCode === successCode) {
      let list: any = res?.data?.list || [];
      let _total: any = res?.data.totalPage || 0;
      setCourseList(list);
      // return res
      if (data?.type == 0) {
        setTotalWait(_total);
      } else {
        setTotalDone(_total);
      }
      // message.success('保存成功');
    } else {
      message.warning('获取数据失败');
    }
  };

  const studyNum = async (data: any) => {
    let res: any = await studyNumApi(data);
    return res;
  };

  return {
    courselist,
    loading,
    setLoading,
    // setTotal,
    totalWait,
    totalDone,
    getStudentCourse,
    studyNum,
  };
};
