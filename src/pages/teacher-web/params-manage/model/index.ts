import { useState } from 'react';
import {
  //---用户管理
  userPageApi,
  userListApi,
  userListApi2,
  groupListApi,
  groupListApi2,
  userSynchApi,
  editApi,
  groupPageApi,
  addGroupApi,
  editGroupApi,
  deleteGroupApi,
  addOrganizationApi,
  organizationPageApi,
  editOrganizationApi,
  deleteOrganizationApi,

  //----规则管理
  scoreSaveApi,
  gradeConfigApi,
  ruleConfigApi,
  ruleSaveApi,
  dialogConfigApi,
  dialogSaveApi,

  //-----系统管理
  courceListApi,
  courceDataApi,
  deleteCourceApi,
  modelAddApi,
  modelEditApi,

  //------意图
  customerIntentionListApi,
  intentListApi,
  delIntentApi,
  intentAddApi,
  intentEditApi,
  intentDetailApi,
  intentSyncApi,
  silentConfgSave,
  silentConfig,

  //------大模型剧情管理
  plotPage,
  plotList,
  plotAdd,
  plotEdit,
  plotDelete,

  //--------客户画像管理
  profilePage,
  profileList,
  profileAdd,
  profileEdit,
  profileDelete,
  profileDetail,

  //--------音色配置
  timbreList,
  timbreAdd,
  timbreEdit,
  timbreDelete,
} from './api';

import { api_workPlaceList } from '../workplace-manage/model/api';

//用户管理

export const useUserManageModel = () => {
  const [loading, setLoading] = useState<any>(false);
  const [userList, setUserList] = useState<any>([]);
  const [groupList, setGroupList] = useState<any>([]);
  const [workPlaceList, setWorkPlaceList] = useState<any>([]);

  const userPage = async (params?: any) => {
    setLoading(true);
    let res: any = await userPageApi(params);
    setLoading(false);
    return res;
  };

  const userListRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await userListApi(params);
    setLoading(false);
    setUserList(res?.data || []);
  };

  const groupListRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await groupListApi(params);
    setLoading(false);
    setGroupList(res?.data || []);
  };

  const workPlaceListRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await api_workPlaceList(params);
    setLoading(false);
    setWorkPlaceList(res?.data || []);
  };

  const sameStepRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await userSynchApi(params);
    setLoading(false);
    return res;
  };

  const editRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await editApi(params);
    setLoading(false);
    return res;
  };

  const groupPage = async (params?: any) => {
    setLoading(true);
    let res: any = await groupPageApi(params);
    setLoading(false);
    return res;
  };

  const addGroupRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await addGroupApi(params);
    setLoading(false);
    return res;
  };

  const editGroupRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await editGroupApi(params);
    setLoading(false);
    return res;
  };

  const deleteGroupRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await deleteGroupApi(params);
    setLoading(false);
    return res;
  };

  const organizationPageRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await organizationPageApi(params);
    setLoading(false);
    return res;
  };

  const addOrganizationRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await addOrganizationApi(params);
    setLoading(false);
    return res;
  };

  const editOrganizationRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await editOrganizationApi(params);
    setLoading(false);
    return res;
  };

  const deleteOrganizationRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await deleteOrganizationApi(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    setLoading,
    userPage,
    userListRequest,
    userList,
    groupListRequest,
    groupList,
    workPlaceListRequest,
    workPlaceList,
    sameStepRequest,
    editRequest,
    groupPage,
    addGroupRequest,
    editGroupRequest,
    deleteGroupRequest,
    organizationPageRequest,
    addOrganizationRequest,
    editOrganizationRequest,
    deleteOrganizationRequest,
  };
};

export const useRuleManageModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const scoreSave = async (params?: any) => {
    setLoading(true);
    let res: any = await scoreSaveApi(params);
    setLoading(false);
    return res;
  };

  const gradeConfig = async (params?: any) => {
    setLoading(true);
    let res: any = await gradeConfigApi(params);
    setLoading(false);
    return res;
  };

  const ruleConfig = async (params?: any) => {
    setLoading(true);
    let res: any = await ruleConfigApi(params);
    setLoading(false);
    return res;
  };

  const ruleSave = async (params?: any) => {
    setLoading(true);
    let res: any = await ruleSaveApi(params);
    setLoading(false);
    return res;
  };

  const dialogConfig = async (params?: any) => {
    setLoading(true);
    let res: any = await dialogConfigApi(params);
    setLoading(false);
    return res;
  };

  const dialogSave = async (params?: any) => {
    setLoading(true);
    let res: any = await dialogSaveApi(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    setLoading,
    scoreSave,
    gradeConfig,
    ruleConfig,
    ruleSave,
    dialogConfig,
    dialogSave,
  };
};

export const useCourceModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const courceList = async (params?: any) => {
    setLoading(true);
    let res: any = await courceListApi(params);
    setLoading(false);
    return res;
  };

  const courceData = async (params?: any) => {
    setLoading(true);
    let res: any = await courceDataApi(params);
    setLoading(false);
    return res;
  };

  const deleteCource = async (params?: any) => {
    setLoading(true);
    let res: any = await deleteCourceApi(params);
    setLoading(false);
    return res;
  };

  const modelAdd = async (params?: any) => {
    setLoading(true);
    let res: any = await modelAddApi(params);
    setLoading(false);
    return res;
  };

  const modelEdit = async (params?: any) => {
    setLoading(true);
    let res: any = await modelEditApi(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    courceList,
    courceData,
    deleteCource,
    modelAdd,
    modelEdit,
  };
};

export const usePlotModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const getPlotPage = async (params?: any) => {
    setLoading(true);
    let res: any = await plotPage(params);
    setLoading(false);
    return res;
  };

  const getPlotList = async (params?: any) => {
    setLoading(true);
    let res: any = await plotList(params);
    setLoading(false);
    return res;
  };

  const getPlotAdd = async (params?: any) => {
    setLoading(true);
    let res: any = await plotAdd(params);
    setLoading(false);
    return res;
  };

  const getPlotEdit = async (params?: any) => {
    setLoading(true);
    let res: any = await plotEdit(params);
    setLoading(false);
    return res;
  };

  const getPlotDelete = async (params?: any) => {
    setLoading(true);
    let res: any = await plotDelete(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    getPlotPage,
    getPlotList,
    getPlotAdd,
    getPlotEdit,
    getPlotDelete,
  };
};

export const useProfileModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const getProfilePage = async (params?: any) => {
    setLoading(true);
    let res: any = await profilePage(params);
    setLoading(false);
    return res;
  };

  const getProfileList = async (params?: any) => {
    setLoading(true);
    let res: any = await profileList(params);
    setLoading(false);
    return res;
  };

  const getProfileAdd = async (params?: any) => {
    setLoading(true);
    let res: any = await profileAdd(params);
    setLoading(false);
    return res;
  };

  const getProfileEdit = async (params?: any) => {
    setLoading(true);
    let res: any = await profileEdit(params);
    setLoading(false);
    return res;
  };

  const getProfileDelete = async (params?: any) => {
    setLoading(true);
    let res: any = await profileDelete(params);
    setLoading(false);
    return res;
  };

  const getProfileDetail = async (params?: any) => {
    setLoading(true);
    let res: any = await profileDetail(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    getProfilePage,
    getProfileList,
    getProfileAdd,
    getProfileEdit,
    getProfileDelete,
    getProfileDetail,
  };
};

export const useIntentionModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const customerIntentionList = async (params?: any) => {
    setLoading(true);
    let res: any = await customerIntentionListApi(params);
    setLoading(false);
    return res;
  };

  const intentListRequest = async (params?: any) => {
    setLoading(true);
    let res: any = await intentListApi(params);
    setLoading(false);
    return res;
  };

  const delIntent = async (params?: any) => {
    setLoading(true);
    let res: any = await delIntentApi(params);
    setLoading(false);
    return res;
  };

  const intentAdd = async (params?: any) => {
    setLoading(true);
    let res: any = await intentAddApi(params);
    setLoading(false);
    return res;
  };

  const intentEdit = async (params?: any) => {
    setLoading(true);
    let res: any = await intentEditApi(params);
    setLoading(false);
    return res;
  };

  const intentDetail = async (params?: any) => {
    setLoading(true);
    let res: any = await intentDetailApi(params);
    setLoading(false);
    return res;
  };

  const intentSync = async (params?: any) => {
    setLoading(true);
    let res: any = await intentSyncApi(params);
    setLoading(false);
    return res;
  };

  const getConfigSave = async (params?: any) => {
    setLoading(true);
    let res: any = await silentConfgSave(params);
    setLoading(false);
    return res;
  };

  const getSettingConfg = async (params?: any) => {
    setLoading(true);
    let res: any = await silentConfig(params);
    setLoading(false);
    return res;
  };



  return {
    loading,
    customerIntentionList,
    intentListRequest,
    delIntent,
    intentAdd,
    intentEdit,
    intentDetail,
    intentSync,
    getConfigSave,
    getSettingConfg,
  };
};

// 签到数据;
export const useUserSignModel = () => {
  const [userList2, setUserList2] = useState<any>([]);
  const [userList3, setUserList3] = useState<any>([]);
  const [groupList2, setGroupList2] = useState<any>([]);

  const userListRequest2 = async (params?: any) => {
    let res: any = await userListApi2(params);
    setUserList2(res?.data || []);
  };
  const userListRequest3 = async (params?: any) => {
    let res: any = await userListApi2(params);
    setUserList3(res?.data || []);
  };

  const groupListRequest2 = async (params?: any) => {
    let res: any = await groupListApi2(params);
    setGroupList2(res?.data || []);
  };

  return {
    userListRequest2,
    userList2,
    userListRequest3,
    userList3,
    groupListRequest2,
    groupList2,
  };
};

export const useSoundConfigModel = () => {
  const [loading, setLoading] = useState<any>(false);

  const timbreListApi = async (params?: any) => {
    setLoading(true);
    let res: any = await timbreList(params);
    setLoading(false);
    return res;
  };

  const timbreAddApi = async (params?: any) => {
    setLoading(true);
    let res: any = await timbreAdd(params);
    setLoading(false);
    return res;
  };

  const timbreEditApi = async (params?: any) => {
    setLoading(true);
    let res: any = await timbreEdit(params);
    setLoading(false);
    return res;
  };

  const timbreDeleteApi = async (params?: any) => {
    setLoading(true);
    let res: any = await timbreDelete(params);
    setLoading(false);
    return res;
  };

  return {
    loading,
    timbreListApi,
    timbreAddApi,
    timbreEditApi,
    timbreDeleteApi
  };
};
