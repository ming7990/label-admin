// service.ts  
import { mock, Random } from 'mockjs';  

// Mock数据生成器  
const generateMockData = (status: number) => {  
  if (status === 0) {  
    return mock({  
      'list|10': [{  
        'id': '@id',  
        'knowledgeName': '@title(3, 5)',  
        'knowledgeType|1': [1, 2, 3],  
        'createTime': '@datetime',  
        'creator': '@name',  
        'userName': '@name',  
      }],  
      'total': '@integer(100, 200)',  
    });  
  }  

  return mock({  
    'list|10': [{  
      'id': '@id',  
      'questionContent': '@paragraph(1, 2)',  
      'questionType|1': [1, 2, 3, 4],  
      'status|1': [0, 1, 2],  
      'category': '@word(4, 8)',  
      'createTime': '@datetime',  
    }],  
    'total': '@integer(100, 200)',  
  });  
};  

// 获取表格数据  
export const getTableData = async (params: any) => {  
  // 模拟API延迟  
  await new Promise(resolve => setTimeout(resolve, 1000));  
  
  const mockData = generateMockData(params.status);  
  
  // 处理搜索和排序  
  let filteredData = mockData.list;  
  if (params.knowledgeName) {  
    filteredData = filteredData.filter(item =>   
      item.knowledgeName?.includes(params.knowledgeName)  
    );  
  }  
  
  if (params.orderBy === 'createTime') {  
    filteredData.sort((a, b) => {  
      const compareResult = new Date(a.createTime) - new Date(b.createTime);  
      return params.orderDesc ? -compareResult : compareResult;  
    });  
  }  

  return {  
    list: filteredData,  
    total: mockData.total,  
  };  
};  

// 获取创建者列表  
export const getCreators = async (status: number) => {  
  await new Promise(resolve => setTimeout(resolve, 500));  
  
  return mock({  
    'data|5-10': [{  
      label: '@name',  
      value: '@id',  
    }]  
  }).data;  
};  

// 获取分类列表  
export const getCategories = async () => {  
  await new Promise(resolve => setTimeout(resolve, 500));  
  
  return mock({  
    'data|5-10': [{  
      label: '@word(4, 8)',  
      value: '@id',  
    }]  
  }).data;  
};