import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
/** 获取知识库分页列表 **/
export async function getKnowledgeList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/list`, {
    method: 'POST',
    data,
  });
}

/** 获取创建人列表 **/
export async function getCreatorList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/creator`, {
    method: 'GET',
    params: data,
  });
}

/** 获取知识库详情 **/
export async function getKnowledgeDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/detail`, {
    method: 'GET',
    params: data,
  });
}

/** 获取知识库文件列表 **/
export async function getKnowledgeFiles(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file`, {
    method: 'GET',
    params: data,
  });
}

/** 下载 **/
export async function downLoadFile({ fileNumber, knowledgeId }) {
  window.open(`${baseUrl}/services/knowledge/file/download?knowledgeId=${knowledgeId}&fileNumber=${fileNumber}`, '_blank');
}

/** 下载 **/
export function downLoadFile2({ fileNumber, knowledgeId }) {
  let url = `${baseUrl}/services/knowledge/file/download?knowledgeId=${knowledgeId}&fileNumber=${fileNumber}`;
  var a = document.createElement('a');
  a.href = url;
  url = a.href;
  console.log(url)
  return url;
}

/** 获取知识库id **/
export async function getKnowledgeId() {
  return request(`${baseUrl}/services/knowledge/getId`, {
    method: 'GET',
  });
}

/** 新增知识库 **/
export async function knowledgeInsert(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/insert`, {
    method: 'POST',
    data,
  });
}

/** 更新知识库 **/
export async function knowledgeUpdate(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/update`, {
    method: 'POST',
    data,
  });
}

/** 删除知识库 **/
export async function knowledgeDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/delete`, {
    method: 'POST',
    data,
  });
}

/** 上下架知识库 **/
export async function onknowledgeUpDown(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/upDown`, {
    method: 'POST',
    data,
  });
}

/** 获取知识文件目录 **/
export async function knowledgeDirectory(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/directory`, {
    method: 'GET',
    params: data,
  });
}

/** 新增知识文件目录 **/
export async function knowledgeDirectoryInsert(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/directory/insert`, {
    method: 'POST',
    data,
  });
}

/** 移动知识文件目录 **/
export async function ondirectoryMove(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/move`, {
    method: 'POST',
    data,
  });
}

/** 删除知识文件目录 **/
export async function directoryDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/directory/delete`, {
    method: 'POST',
    data,
  });
}

/** 重命名知识文件目录 **/
export async function rename(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/directory/rename`, {
    method: 'POST',
    data,
  });
}

/** 知识库文件上传 **/
export async function knowledgeUpload(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/upload`, {
    method: 'POST',
    data,
  });
}
/** 知识库文件上传 **/
export async function postMessage(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/video/message`, {
    method: 'POST',
    data,
  });
}

/** 发布评论 **/
export async function commentReply(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/reply`, {
    method: 'POST',
    data,
  });
}

/** 删除评论 **/
export async function commentDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/delete`, {
    method: 'POST',
    data,
  });
}

/** 获取评论 **/
export async function getCommentLists(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/list`, {
    method: 'GET',
    params: data,
  });
}

/** 获取更多评论 **/
export async function getCommentMoreLists(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/more`, {
    method: 'GET',
    params: data,
  });
}

/** 置顶 **/
export async function oncommentTop(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/top`, {
    method: 'POST',
    data,
  });
}

/** 知识库-点赞 **/
export async function knowledgeLike(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/like`, {
    method: 'POST',
    data,
  });
}

/** 评论-点赞 **/
export async function oncommentLike(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/comment/like`, {
    method: 'POST',
    data,
  });
}

/** 删除文件 **/
export async function onfileDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/delete`, {
    method: 'POST',
    data,
  });
}

/** 获取所有知识库列表 **/
export async function getKgListAll(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/list/all`, {
    method: 'GET',
    params: data,
  });
}

/** 获取所有知识库列表 **/
export async function knowledgeAdd(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/file/knowledge/add`, {
    method: 'POST',
    data,
  });
}

// 题目新增;
export function questionInsert(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/insert`, {
    method: 'POST',
    data,
  });
}
// 题目详情;
export function questionDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/detail`, {
    method: 'GET',
    params: data,
  });
}
// 题目编辑;
export function questionUpdate(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/update`, {
    method: 'POST',
    data,
  });
}

// 品质列表查询;
export function qualityList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/qualityList`, {
    method: 'POST',
    data,
  });
}
// 品质知识库添加;
export function addQuality(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/addQuality`, {
    method: 'POST',
    data,
  });
}
// 品质知识库编辑;
export function editQuality(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/editQuality`, {
    method: 'POST',
    data,
  });
}
// 品质知识库删除;
export function deleteQuality(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/deleteQuality`, {
    method: 'POST',
    data,
  });
}
// 品质知识库生成试题;
export function qualityGenQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/qualityGenQuestion`, {
    method: 'POST',
    data,
  });
}

// 题库列表查询;
export function qualityQuestionLis(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/qualityQuestionList`, {
    method: 'POST',
    data,
  });
}
// 编辑题目;
export function editQualityQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/editQualityQuestion`, {
    method: 'POST',
    data,
  });
}
// 发布、下线题目;
export function qualityQuestionStatus(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/qualityQuestionStatus`, {
    method: 'POST',
    data,
  });
}
// 删除题目;
export function deleteQualityQuestion(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/deleteQualityQuestion`, {
    method: 'POST',
    data,
  });
}

// 题目详情;
export function qualityQuestionDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/knowledge/text/qualityQuestionDetail`, {
    method: 'GET',
    params: data,
  });
}