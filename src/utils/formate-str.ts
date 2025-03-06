const task_model_map = {
  1: '闯关模式',
  2: '任意模式',
};

const task_type_map = {
  1: '培训',
  2: '考试',
};

export const formateTaskModel = (val: any) => {
  return task_model_map[val] || '';
};

export const formateTaskType = (val: any) => {
  return task_type_map[val] || '';
};
