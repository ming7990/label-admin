import React, { useEffect, useState, useImperativeHandle } from 'react';
import style from '../style.less';
import { Pagination, Button, Tag, Dropdown, Menu } from 'antd';
import { Link, history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import config from '@/config';

import { useCourseModel } from '../model';
import coursePic from '@/asset/image/course-pic.png';
import Condition from '@/components/Condition';
import Process from '../component/process';

import { formatePercent } from '@/utils';

const { basePath } = config;

const items = [
  { label: '全部课程', key: '0' },
  { label: '培训课程', key: '1' }, // 菜单项务必填写 key
  { label: '考试课程', key: '2' },
];

const WaitLearnPage: React.FC<any> = (props: any) => {
  const { type, changeMenu, activeKey, cref } = props;
  const [pageNo, setPageNo] = useState<any>(1);

  const [pageSize, setPageSize] = useState<any>(12);

  const [courseType, setCourseType] = useState<any>('0');
  const [courseTypeName, setCourseTypeName] = useState<any>('全部课程');

  useImperativeHandle(cref, () => ({
    courseType,
  }));

  const onMenuClick = (e: any) => {
    console.log(e);
    setCourseType(e.key);
    setPageNo(1);
    let obj: any = items.find((item: any) => {
      return item.key === e.key;
    });
    // console.log(obj.label);
    obj && setCourseTypeName(obj.label);
    changeMenu(e.key);
  };

  const { courselist, totalWait, totalDone, getStudentCourse, loading } = useCourseModel();

  useEffect(() => {
    if (Number(activeKey) !== type + 1) {
      return;
    }
    getStudentCourse({
      type,
      page: pageNo,
      pageSize,
      taskType: courseType === '0' ? undefined : Number(courseType),
    });
  }, [pageNo, pageSize, courseType, activeKey]);

  return (
    <div className={style['normal-page']}>
      <div className={style['page-select']}>
        <Dropdown
          overlay={
            <Menu onClick={onMenuClick}>
              {items.map((item, index) => {
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
          <div>
            {' '}
            {courseTypeName}{' '}
            <DownOutlined style={{ marginLeft: '4px', color: 'rgba(0,0,0,0.4)' }} />
          </div>
        </Dropdown>
      </div>
      <div className={style['page-context_bg']}>
        <Condition r-if={courselist.length > 0}>
          <div className={style['page-context']}>
            {courselist.map((item: any, index: number) => {
              return (
                <Link
                  target="blank"
                  key={index}
                  to={{
                    pathname: `/front/student/course/detail`,
                    search: `?taskId=${item.taskId}&tab=${type + 1}`,
                  }}
                >
                  <div className={style['course-box']}>
                    <div className={style['course-pic']}>
                      <img src={coursePic} className={style['course-pic']} />
                    </div>

                    <div className={style['box']}>
                      <div className={style['course-title']}>{item.taskName}</div>

                      <div className={style['context']}>
                        <div>
                          <Condition r-if={item.taskType === 1}>
                            <Tag color="blue">培训课程</Tag>
                          </Condition>
                          <Condition r-if={item.taskType === 2}>
                            <Tag color={'orange'}>考试课程</Tag>
                          </Condition>
                        </div>
                      </div>

                      <div className={style['context-bottom']}>
                        <Process percent={item.progress} />
                        <span>学习进度：{formatePercent(item.progress)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Condition>

        <Condition r-if={!loading && courselist.length === 0}>
          <div className={style['page-error']}>
            <img src={coursePic} className={style['course-pic']} />
            <div style={{ marginTop: '18px' }}>暂无数据</div>
          </div>
        </Condition>
      </div>
      <div className={style['page-right']}>
        <Pagination
          current={pageNo}
          total={type == '0' ? totalWait : totalDone}
          pageSize={pageSize}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={[12, 24, 36]}
          showTotal={(total, range) => `总共 ${total} 条`}
          onChange={(current: any, size: any) => {
            setPageNo(current);
          }}
          onShowSizeChange={(current: any, size: any) => {
            setPageNo(1);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default WaitLearnPage;
