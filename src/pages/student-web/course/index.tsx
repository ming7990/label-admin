import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import SearchPage from './search-page';
import style from './style.less';
import { useCourseModel } from './model';

const TagIcon = (props: any) => {
  const { value, activeKey, num } = props;

  if (value === activeKey) {
    return (
      <>
        {num > 0 && (
          <span className={style['tag-icon-active']} style={{ marginLeft: '8px' }}>
            {num}
          </span>
        )}
      </>
    );
  } else {
    return (
      <>
        {num > 0 && (
          <span className={style['tag-icon']} style={{ marginLeft: '8px' }}>
            {num}
          </span>
        )}
      </>
    );
  }
};

const StudentWeb: React.FC<any> = (props: any) => {
  const { studyNum } = useCourseModel();

  const waitRef = useRef();
  const doneRef = useRef();

  const query: any = history.location.query || {};
  let tab: any = query?.tab;
  tab = isNaN(tab) ? '1' : tab;

  const [activeKey, setActiveKey] = useState<any>(tab);
  const [waitNum, setWaitNum] = useState<any>(0);
  const [doneNum, setDoneNum] = useState<any>(0);

  useEffect(() => {
    getStudyNum('0');
  }, []);

  const getStudyNum = async (key: any) => {
    let res = await studyNum({ taskType: key == '0' ? undefined : Number(key) });
    setWaitNum(res?.data?.unTotalNum);
    setDoneNum(res?.data?.totalNum);
  };

  const tabOnChange = (key: any) => {
    setActiveKey(key);
    if (key == '1') {
      getStudyNum(waitRef?.current?.courseType);
    } else if (key == '2') {
      getStudyNum(doneRef?.current?.courseType);
    }
  };

  const changeMenu = (type: any) => {
    getStudyNum(type);
  };
  // 0 待学习， 1已学习

  const pagesItem: any = [
    {
      label: (
        <span>
          待学习
          <TagIcon value={'1'} activeKey={activeKey} num={waitNum} />
        </span>
      ),
      key: '1',
      children: (
        <SearchPage type={0} changeMenu={changeMenu} activeKey={activeKey} cref={waitRef} />
      ),
    },
    {
      label: (
        <span>
          已学习
          <TagIcon value={'2'} activeKey={activeKey} num={doneNum} />
        </span>
      ),
      key: '2',
      children: (
        <SearchPage type={1} changeMenu={changeMenu} activeKey={activeKey} cref={doneRef} />
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '我的课程',
        ghost: true,
      }}
    >
      <div className={style['page-bg']}>
        <Tabs activeKey={activeKey} onChange={tabOnChange} size={'large'} items={[]}>
          {pagesItem.map((item: any, index: any) => {
            return (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default StudentWeb;
