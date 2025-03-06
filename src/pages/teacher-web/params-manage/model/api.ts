import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/**----------------------用户管理--------------------------**/

/** 获取用户管理列表 **/
export async function userPageApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/userPage`, {
    method: 'POST',
    data: params,
  });
}

/** 获取用户列表 **/
export async function userListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/userList`, {
    method: 'POST',
    data: params,
  });
}

/** 组别列表 **/
export async function groupListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupList`, {
    method: 'POST',
    data: params,
  });
}

/** 同步 **/
export async function userSynchApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/userSynch`, {
    method: 'POST',
    data: params,
  });
}

/** 编辑用户 **/
export async function editApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/userEdit`, {
    method: 'POST',
    data: params,
  });
}

/** 组别分页 **/
export async function groupPageApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupPage`, {
    method: 'POST',
    data: params,
  });
}

/** 新建组别 **/
export async function addGroupApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupAdd`, {
    method: 'POST',
    data: params,
  });
}

/** 编辑组别 **/
export async function editGroupApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupEdit`, {
    method: 'POST',
    data: params,
  });
}

/** 删除组别 **/
export async function deleteGroupApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupDelete`, {
    method: 'POST',
    data: params,
  });
}

/**----------------------机构管理--------------------------**/

export async function getOrganizationApi(params?: any) {
  // 不分页获取机构列表
  return request(`${baseUrl}/services/organization/list`, {
    method: 'get',
    params,
  });
}

export async function organizationPageApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/organization/page`, {
    method: 'get',
    params,
  });
}

export async function addOrganizationApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/organization/add`, {
    method: 'POST',
    data: params,
  });
}

/** 编辑组别 **/
export async function editOrganizationApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/organization/edit`, {
    method: 'POST',
    data: params,
  });
}

/** 删除组别 **/
export async function deleteOrganizationApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/organization/delete`, {
    method: 'POST',
    data: params,
  });
}

/**----------------------规则管理--------------------------**/

/** 评分比例配置保存 **/
export async function scoreSaveApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/gradeConfigSave`, {
    method: 'POST',
    data: params,
  });
}

/** 评分比例配置 **/
export async function gradeConfigApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/gradeConfig`, {
    method: 'POST',
    data: params,
  });
}

/** 服务规则配置 **/
export async function ruleConfigApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/ruleConfig`, {
    method: 'POST',
    data: params,
  });
}

/** 服务规则保存 **/
export async function ruleSaveApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/ruleConfigSave`, {
    method: 'POST',
    data: params,
  });
}

/** 话术标准配置 **/
export async function dialogConfigApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/actionConfig`, {
    method: 'POST',
    data: params,
  });
}

/** 话术标准保存 **/
export async function dialogSaveApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/setting/actionConfigSave`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表 **/
export async function courceListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/model/modelPage`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--不分页 **/
export async function courceDataApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/model/modelList`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--删除 **/
export async function deleteCourceApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/model/modelDelete`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--新增 **/
export async function modelAddApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/model/modelAdd`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--编辑 **/
export async function modelEditApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/model/modelEdit`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表 **/
export async function customerIntentionListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentPage`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表--不分页 **/
export async function intentListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentList`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图--删除**/
export async function delIntentApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentDelete`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表--新建 **/
export async function intentAddApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentAdd`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表--编辑 **/
export async function intentEditApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentEdit`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表--详情 **/
export async function intentDetailApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentDetail`, {
    method: 'POST',
    data: params,
  });
}

/** 课程模型列表--客户意图列表--详情 **/
export async function intentSyncApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/intent/intentSync`, {
    method: 'POST',
    data: params,
  });
}

/** 获取用户列表 **/
export async function userListApi2(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/groupUserList`, {
    method: 'GET',
    params,
  });
}

/** 组别列表 **/
export async function groupListApi2(params?: Record<string, any>) {
  return request(`${baseUrl}/services/user/groupList`, {
    method: 'GET',
    params,
  });
}

export async function silentConfgSave(params?: Record<string, any>) {
  return request(`${baseUrl}/services/dictionary/silentConfigSave`, {
    method: 'POST',
    data: params,
  });
}

export async function silentConfig(params?: Record<string, any>) {
  return request(`${baseUrl}/services/dictionary/silentConfig`, {
    method: 'GET',
    params,
  });
}

/**----------------------大模型剧情管理--------------------------**/

/** 大模型剧情分页查询 **/
export async function plotPage(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/page`, {
    method: 'GET',
    params,
  });
}

/** 大模型剧情列表查询 **/
export async function plotList(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/list`, {
    method: 'GET',
    params,
  });
}

/** 大模型剧情新增 **/
export async function plotAdd(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/add`, {
    method: 'POST',
    data: params,
  });
}

/** 大模型剧情编辑 **/
export async function plotEdit(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/edit`, {
    method: 'POST',
    data: params,
  });
}

/** 大模型剧情删除 **/
export async function plotDelete(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/delete`, {
    method: 'POST',
    data: params,
  });
}

/**----------------------客户画像管理--------------------------**/

/** 客户画像分页查询 **/
export async function profilePage(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/page`, {
    method: 'GET',
    params,
  });
}

/** 客户画像新增 **/
export async function profileAdd(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/add`, {
    method: 'POST',
    data: params,
  });
}

/** 客户画像编辑 **/
export async function profileEdit(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/edit`, {
    method: 'POST',
    data: params,
  });
}

/** 客户画像删除 **/
export async function profileDelete(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/delete`, {
    method: 'POST',
    data: params,
  });
}

/** 客户画像分页查询 **/
export async function profileList(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/list`, {
    method: 'GET',
    params,
  });
}

/** 客户画像详情 **/
export async function profileDetail(params?: Record<string, any>) {
  return request(`${baseUrl}/services/profile/detail`, {
    method: 'GET',
    params,
  });
}

/**----------------------音色配置管理--------------------------**/

/** 音色分页查询 **/
export async function timbreList(params?: Record<string, any>) {
  return request(`${baseUrl}/services/timbre/list`, {
    method: 'GET',
    params,
  });
}
/** 音色新增 **/
export async function timbreAdd(params?: Record<string, any>) {
  return request(`${baseUrl}/services/timbre/add`, {
    method: 'POST',
    data: params,
  });
}
/** 音色编辑 **/
export async function timbreEdit(params?: Record<string, any>) {
  return request(`${baseUrl}/services/timbre/edit`, {
    method: 'POST',
    data: params,
  });
}
/** 音色删除 **/
export async function timbreDelete(params?: Record<string, any>) {
  return request(`${baseUrl}/services/timbre/delete`, {
    method: 'POST',
    data: params,
  });
}
