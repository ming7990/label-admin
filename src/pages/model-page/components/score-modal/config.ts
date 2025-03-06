const colors = ['#3AA0FF', '#36CBCB', '#4ECB73', '#FAD337'];

export const getConfig = (data: any) => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
    data,
    series: [
      {
        name: '得分情况',
        type: 'pie',
        radius: '75%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
};

export const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: '扣分点', // 渠道大类
    ellipsis: true,
    width: 200,
  },
  {
    dataIndex: 'value',
    key: 'value',
    title: '扣分', // 渠道大类
    width: 80,
    render: (text: any, row: any, index: any) => {
      return text;
    },
  },
];
