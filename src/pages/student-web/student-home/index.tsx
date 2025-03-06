import React, { useEffect, useState, useRef } from 'react';
import { history, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Space, Table, Tag, Avatar, Dropdown, Menu, Tooltip, Button, Modal, Carousel } from 'antd';
import { UserOutlined, WomanOutlined, ManOutlined, DownOutlined } from '@ant-design/icons';
import style from './style.less';
import { useStudentRankModel } from './model';
import { useUpdateEffect, useMount } from 'ahooks';
import type { ColumnsType } from 'antd/es/table';

import female from '@/asset/image/female.png';
import male from '@/asset/image/male.png';
import rank_1 from '@/asset/image/rank_1.png';
import rank_2 from '@/asset/image/rank_2.png';
import rank_3 from '@/asset/image/rank_3.png';

const rankTop3Imgs = [rank_1, rank_2, rank_3];

const columns: ColumnsType<any> = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    width: 72,
    align: 'center',
    render: (rank) => {
      const idx = rank - 1;
      if (idx < 3) {
        const rankImg = rankTop3Imgs[idx];
        return <img src={rankImg} alt={`${rank}`} style={{ width: '24px', height: '22px' }} />;
      }
      return rank;
    },
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    title: '部门',
    dataIndex: 'groupName',
    key: 'groupName',
    align: 'center',
  },
  {
    title: '分值',
    dataIndex: 'score',
    key: 'score',
    width: 100,
    align: 'center',
  },
];

const StudentHome: React.FC<any> = (props: any) => {
  const {
    loading,
    setLoading,
    // 排名分组接口
    getStudentGroup,
    studentGroupData,
    // 成绩排名接口
    getScoreSort,
    scoreSortData,
    tipsList,
    getTips,
  } = useStudentRankModel();

  // 用户信息
  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { userName, account, groupName, phoneNumber, createTime, groupId, sex, signInTime, role } = userInfoAll || {};
  // 下拉组别选择 数据处理
  let dropItems = [
    { label: groupName, key: 'usergroup', queryVal: groupId },
    { label: '全部', key: 'all', queryVal: undefined },
  ];
  const groupItems = studentGroupData?.dropItems;
  if (groupItems?.length) {
    const newGroupItems = groupItems.filter((item: any) => {
      return item.queryVal !== groupId;
    }); // 过滤掉本人所属组别
    dropItems = [...dropItems, ...newGroupItems];
  }
  // 选中的组别
  const [selectedGroupInfo, setSelectedGroupInfo] = useState<any>(dropItems[0]);
  const { label: sgiLabel, key: sgiKey, queryVal } = selectedGroupInfo || {};
  const onMenuClick = (e: any) => {
    let obj: any = dropItems?.find((item: any) => {
      return item.key === e.key;
    });
    obj && setSelectedGroupInfo(obj);
  };

  const getTableRowClassName = (record: any, index: any) => {
    if (record?.isMe) return 'isMe';
    return '';
  };

  useMount(() => {
    getStudentGroup({});
    getScoreSort({ groupId });
  });

  useUpdateEffect(() => {
    const { queryVal: sgiQueryVal } = selectedGroupInfo || {};
    let params = {};
    if (sgiQueryVal) {
      params = { groupId: queryVal };
    }
    getScoreSort(params);
  }, [selectedGroupInfo]);

  const [visible, setVisible] = useState(false);
  const carouselRef = useRef(null);
  const goDetail = () => {
    getTips({});
    carouselRef.current?.goTo(0);
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };

  const next = () => {
    carouselRef.current?.next();
  };
  const prev = () => {
    carouselRef.current?.prev();
  };

  return (
    <PageContainer
      className="student-home-page"
      header={{
        title: "首页",
        subTitle: (role.length === 1 && role?.includes('student')) ? <div className={style['titlebar-tips']}><Button onClick={goDetail} type="link">温馨提示</Button></div> : null,
        ghost: true,
      }}
    >
      <div className={style.container}>
        <div className={style.leftContainer}>
          <div className={style.leftTopContainer}>
            <div className={style.ltcAvatarContainer}>
              <Avatar size={40} icon={<UserOutlined />} src={sex === '1' ? male : female} />
              <span className={style.ltcTitle}>{userName}</span>
              {sex === '1' ? (
                <ManOutlined className={style.manOutlined} />
              ) : (
                <WomanOutlined className={style.womanOutlined} />
              )}
              {(role.length === 1 && role?.includes('student')) && <Tooltip placement="top" title={'今日打卡时间 ' + signInTime}>
                <Button style={{ marginLeft: 118 }} type="link">考勤打卡</Button>
              </Tooltip>}
            </div>
            <div className={style.ltcInfoContainer}>
              <div className={style.ltcInfoItem}>
                <div className={style.infoTitle}>组别</div>
                <div className={style.infoDesc}>{groupName}</div>
              </div>
              <div className={style.ltcInfoItem}>
                <div className={style.infoTitle}>手机号码</div>
                <div className={style.infoDesc}>{phoneNumber}</div>
              </div>
              <div className={style.ltcInfoItem}>
                <div className={style.infoTitle}>账户名称</div>
                <div className={style.infoDesc}>{account}</div>
              </div>
              <div className={style.ltcInfoItem}>
                <div className={style.infoTitle}>注册时间</div>
                <div className={style.infoDesc}>{createTime}</div>
              </div>
            </div>
          </div>
          <Card title="最新通知" extra={<a href="#">更多</a>}>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
            <p>请所有学员在11月26日前完成考试1的考试考试考...</p>
          </Card>
        </div>
        <div className={style.rightContainer}>
          <div className={style.rcHeader}>
            <div className={style.rchTitle}>排名</div>
            <Dropdown
              className={style.rchDropdown}
              overlay={
                <Menu onClick={onMenuClick}>
                  {dropItems?.map((item: any, index: any) => {
                    return (
                      <Menu.Item key={item.key}>
                        {item.key === sgiKey ? (
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
                <span style={{ marginRight: '3px' }}>{sgiLabel}</span>
                <DownOutlined style={{ marginLeft: '4px', color: 'rgba(0,0,0,0.4)' }} />
              </div>
            </Dropdown>
          </div>
          <div className={style.rcBody}>
            <Table
              columns={columns}
              dataSource={scoreSortData.rankList}
              pagination={false}
              rowClassName={getTableRowClassName}
            />
          </div>
        </div>
      </div>
      <Modal
        title={<p style={{ textAlign: 'center' }}>温馨提示</p>}
        visible={visible}
        onOk={handleOk}
        okText="知道了"
        onCancel={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ position: "relative", padding: "0 8px" }}>
          <Carousel dots={false} ref={carouselRef}>
            {
              tipsList.map((item: any, index: number) => <div>
                <div>
                  <h3 style={{ textAlign: 'center' }}>{index + 1}.{item.title}</h3>
                  <div>{item.content}</div>
                </div>
              </div>
              )
            }
          </Carousel>
          <p onClick={prev} className={style.prev}>&lt;</p>
          <p onClick={next} className={style.next}>&gt;</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default StudentHome;
