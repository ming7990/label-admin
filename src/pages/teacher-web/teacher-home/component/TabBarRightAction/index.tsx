import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Dropdown, Menu, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const dropItems = [
  { label: '全部课程', key: '0', queryVal: undefined },
  { label: '培训课程', key: '1', queryVal: 1 },
  { label: '考试课程', key: '2', queryVal: 2 },
];

const TabBarRightAction: React.FC<any> = (props: any) => {
  const { courseTypeChange, courseNameSearch } = props;
  const [courseType, setCourseType] = useState<any>('0');
  const [courseTypeName, setCourseTypeName] = useState<any>('全部课程');

  const onMenuClick = (e: any) => {
    setCourseType(e.key);
    let obj: any = dropItems.find((item: any) => {
      return item.key === e.key;
    });
    obj && setCourseTypeName(obj.label);
    courseTypeChange(obj);
  };

  const onSearch = (value: string) => courseNameSearch(value);

  return (
    <div style={{ display: 'flex' }}>
      <Dropdown
        overlay={
          <Menu onClick={onMenuClick}>
            {dropItems.map((item, index) => {
              return (
                <Menu.Item key={item.key}>
                  {item.key === courseType ? (
                    <a style={{ color: '#1890FF' }}>{item.label}</a>
                  ) : (
                    item.label
                  )}
                </Menu.Item>
              );
            })}
          </Menu>
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '15px',
          }}
        >
          <span style={{ marginRight: '3px' }}>{courseTypeName}</span>
          <DownOutlined style={{ marginLeft: '4px', color: 'rgba(0,0,0,0.4)' }} />
        </div>
      </Dropdown>
      <Input.Search
        placeholder="请输入任务名称"
        allowClear
        onSearch={onSearch}
        style={{ width: 232 }}
      />
    </div>
  );
};

export default TabBarRightAction;
