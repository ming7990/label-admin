import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';

const { successCode } = config;

import {
  getQuestionList, questionDelete, getQuestionType, questionSetScore,
  questionInsert, questionDetail, questionUpdate, questionNumber
} from './api';

export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [questionTypeList, setQuestionTypeList] = useState([]);

  const getTableList = async (data: any) => {
    setTableLoading(true);
    const res: any = await getQuestionList(data);
    setTableLoading(false);
    console.log(res,'getQuestionList');
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  }

  const getQuestionTypeList = async (data: any) => {
    const res = await getQuestionType(data);
    const list = res?.data || [];
    list.forEach((item, index)=> {
      item.id = index;
    });
    setQuestionTypeList(list);
  }

  const onQuestionDelete = async (params: any) => {
    let res = await questionDelete(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    tableLoading,
    getTableList,
    questionDelete: onQuestionDelete, // 删除题目;
    questionTypeList,
    setQuestionTypeList,
    getQuestionTypeList, // 获取设置分数题型;
    questionSetScore, // 设置;
    // 新增题目相关;
    questionInsert,
    questionDetail,
    questionUpdate,

    questionNumber: async (params: any) => {
      let res = await questionNumber(params);
      if (res?.resultCode == successCode) {
        return res;
      } else {
        message.error(res?.resultDesc);
        return false;
      }
    }
  }
}