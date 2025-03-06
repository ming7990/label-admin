// constants.ts  
export const TABLE_PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50'],
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
};

export const AUTH_KEYS = {
  CREATE: 'knowledge_manage_create_btn',
  EDIT: 'knowledge_manage_edit_btn',
  VIEW: 'knowledge_manage_view_btn',
  DELETE: 'knowledge_manage_delete_btn',
};

export const knowledgeTypeText = {
  1: { text: '文档' },
  2: { text: '视频' },
  3: { text: '图片' },
};

export const QUESTION_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  OFFLINE: 2,
};

export const questionTypeText = {
  0: { text: '单选题' },
  1: { text: '多选题' },
  2: { text: '判断题' },
  3: { text: '填空题' },
  4: { text: '简答题' },
  5: { text: '论述题' },
};

export const questionStatusText = {
  0: { text: '待生成', status: 0 },
  1: { text: '生成中', status: 1 },
  2: { text: '完成', status: 2 },
  2: { text: '失败', status: 3 },
};

export const statusText = {
  0: { text: '待发布', status: 0 },
  1: { text: '已发布', status: 1 },
  2: { text: '已下线', status: 2 },
};

export const TABLE_CONFIG = {
  rowKey: 'id',
  search: {
    defaultCollapsed: false,
    collapseRender: false,
  },
  options: false,
};

// 文件类型  
export const FILE_TYPES = {
  DOC: 'doc',
  DOCX: 'docx',
  PDF: 'pdf',
};

export const fileTypeOptions = [
  { label: 'doc', value: 0 },
  { label: 'docx', value: 1 },
  { label: 'pdf', value: 2 },
  { label: 'xlsx', value: 3 },
  { label: 'ppt', value: 4 },
  { label: 'txt', value: 5 },
];

// 题型  
export const QUESTION_TYPES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
  JUDGE: 'judge',
  FILL: 'fill',
  SHORT: 'short',
  ESSAY: 'essay',
};

export const questionTypeOptions = [
  { label: '单选题', value: QUESTION_TYPES.SINGLE },
  { label: '多选题', value: QUESTION_TYPES.MULTIPLE },
  { label: '判断题', value: QUESTION_TYPES.JUDGE },
  { label: '填空题', value: QUESTION_TYPES.FILL },
  { label: '简答题', value: QUESTION_TYPES.SHORT },
  { label: '论述题', value: QUESTION_TYPES.ESSAY },
];

export const difficultyLevelText = {
  1: '容易',
  2: '一般',
  3: '难',
}