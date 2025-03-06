import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
const profileListInit: any = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
  { id: '5', name: '钱七' },
  { id: '6', name: '孙八' },
  { id: '7', name: '周九' },
];

const UserProfilePage: React.FC<any> = (props: any) => {
  useEffect(() => {
    setProfileList(profileListInit);
  }, []);
  const [profileList, setProfileList] = useState([]);

  const profileChange = (val: any) => {
    console.log(val);
  };
  return (
    <div>
      <Select
        placeholder="请选择客户画像"
        showSearch
        allowClear
        style={{ width: '100%' }}
        onChange={profileChange}
        filterOption={(input, option) => {
          console.log(input, option);
          return (option?.item as unknown as string)?.toLowerCase()?.includes(input.toLowerCase());
        }}
      >
        {profileList.map((item: any) => {
          return (
            <Select.Option key={item?.id} value={item?.id} item={item.name}>
              {item?.name}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export default UserProfilePage;
