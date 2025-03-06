import config from '@/config';
import { message } from 'antd';
import { useState, useRef } from 'react';

const { successCode } = config;

import {
  getVideoList,
  videDelete,
  addOrUpdate,
  videoFileList,
  videoDetail,
  createId,
  videoMove,
  videoSubmit,
  deleteVideoFile,
  classAll,
  fileRecordAll,
  shareVideoList,
} from './api';

export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);

  const getTableList = async (data: any) => {
    setTableLoading(true);
    const res: any = await getVideoList(data);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      setHasData(res?.data?.totalPage > 0);
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  const deleteItem = async (data: { id: any }) => {
    const res: any = await videDelete(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    tableLoading,
    getTableList,
    deleteItem,
    hasData,
  };
};
// 新增、编辑;
export const useAddOrEditModel = () => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [shareList, setShareList] = useState<any[]>([]);
  const [shareList2, setShareList2] = useState<any[]>([]); // 二级目录;
  const [shares, setShares] = useState<any[]>([]); // 选中的分享视频;
  // 编辑或新增
  const addOrEdit = (params: any, type: 'add' | 'edit', cb?: any) => {
    setBtnLoading(true);
    addOrUpdate(params, type)
      .then((res) => {
        setBtnLoading(false);
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          cb && cb();
        } else {
          message.error(res?.resultDesc);
        }
      })
      .catch(() => {
        cb && cb();
      });
  };

  const getFileList = async (params: any) => {
    const res = await videoFileList(params);
    if (res?.resultCode == successCode) {
      return res.data || [];
    } else {
      message.error(res?.resultDesc);
      return [];
    }
  };

  // 共享文件;
  const getClassAll = () => {
    classAll({ type: 'file' }).then((res) => {
      if (res?.resultCode == successCode) {
        setShareList(res?.data || []);
      } else {
        message.error(res?.resultDesc);
      }
    });
  };
  const getFileRecordAll = (params: any) => {
    fileRecordAll(params).then((res) => {
      if (res?.resultCode == successCode) {
        setShareList2(res?.data || []);
      } else {
        message.error(res?.resultDesc);
      }
    });
  };

  const _cacheShares = useRef({});
  const getShareVideoList = (params: any) => {
    setShares([]); // 清空;
    const arr: any = [];
    console.log(_cacheShares.current, '_cacheShares');
    params?.forEach((item: any) => {
      if (_cacheShares.current[item]) {
        arr.push(_cacheShares.current[item]);
        // setShares([...shares, _cacheShares.current[item]]);
        if (params.length === arr.length) {
          setShares(arr);
        }
        return;
      }
      shareVideoList({ shareId: item }).then((res) => {
        if (res?.resultCode == successCode) {
          const list = res?.data || [];
          const o = { ...list[0], shareId: item };
          // setShares([...shares, o]);
          arr.push(o);
          if (params.length === arr.length) {
            setShares(arr);
          }
          _cacheShares.current[item] = o;
        } else {
          message.error(res?.resultDesc);
        }
      });
    });
  };

  return {
    btnLoading,
    addOrEdit,
    getFileList,
    videoInfo,
    createId: () => createId(),
    deleteVideoFile,
    getClassAll,
    shareList,
    shareList2,
    getFileRecordAll,
    getShareVideoList,
    shares,
  };
};

export const videoInfo = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [info, setInfo] = useState<any>({});
  const _videoInfo = async (params: any, cb?: any) => {
    let courseVideoId = params.courseVideoId;
    let pageSource = params.pageSource;
    delete params.pageSource;
    if (!courseVideoId) {
      courseVideoId = (await getVideoList({ ...params, page: 1, pageSize: 10 })).data?.list[0]?.id;
    }
    const res = await videoDetail({ courseVideoId }, pageSource);
    if (res?.resultCode == successCode) {
      setInfo(res.data || {});
      const res2 = await videoFileList({ courseVideoId }, pageSource);
      if (res2?.resultCode == successCode) {
        cb && cb(res2.data || []);
      }
    } else {
      message.error(res?.resultDesc);
      cb && cb([]);
      return setInfo({});
    }
  };
  const fetchInfo = async (params: any, cb?: any) => {
    const res = await videoMove(params);
    if (res?.resultCode == successCode) {
      cb && cb(res.data);
    } else {
      message.error(res?.resultDesc);
      cb && cb({});
    }
  };
  const submitInfo = async (data: any) => {
    videoSubmit(data);
  };
  return {
    info,
    getInfo: _videoInfo,
    submitInfo,
    fetchInfo,
    createId: () => createId(),
  };
};
