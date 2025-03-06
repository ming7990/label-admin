// 题目类型
export enum KnowledgeType {
  Pic = 0, // 图文
  Audio = 1, // 录音
  Video = 2, // 视频
  Doc = 3, // 文档
}

export const KnowledgeTypeList = [
  { label: '图文', value: KnowledgeType.Pic },
  { label: '录音', value: KnowledgeType.Audio },
  { label: '视频', value: KnowledgeType.Video },
  { label: '文档', value: KnowledgeType.Doc },
];

export const authConfigList = [
  { label: '所有人可看', value: 0 },
  { label: '仅所属职场可看', value: 1 },
  { label: '仅所属机构可看', value: 2 },
];

const o = {};
KnowledgeTypeList.forEach(({ label, value }) => {
  o[value] = label;
});
export const knowledgeTypeText = o;

const o1 = {};
authConfigList.forEach(({ label, value }) => {
  o1[value] = label;
});
export const authConfigListText = o1;
