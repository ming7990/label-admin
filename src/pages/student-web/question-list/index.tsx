import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Modal, Popconfirm, Select } from 'antd';
import { history, useModel } from 'umi';
import { usePaperModel } from './model';
import Question from './components/Question';
import Sidebar from './components/Sidebar';
import BtnAuth from '@/components/BtnAuth';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from './style.less';

const Index: React.FC<any> = () => {
  const query: any = history.location.query || {};
  const courseId: any = query?.courseId;
  const nodeId: any = query?.nodeId;
  const taskId: any = query?.taskId;
  const title: any = query?.name;
  const beforeLeaveRef = useRef(null);
  const [isSubmited, setIsSubmit] = useState<boolean>(false); // 是否已交卷;
  const go = () => { history.replace(`/front/student/course/detail?taskId=${taskId}`); }
  const goBack = () => {
    if (!isSubmited) {
      Modal.confirm({
        title: '当前考试还没提交，确定要离开当前页面吗？',
        onOk: () => {
          // 用户点击确定，继续页面返回
          go();
          removeEvt();
        },
        onCancel: () => {
          // 用户点击取消，阻止页面返回
        },
      });
    } else {
      go();
    }
  };

  // 注册 block 回调函数
  // history.block((location, action) => {
  //   // 在这里可以添加你的逻辑来判断是否阻止页面返回
  //   // 如果要阻止页面返回，弹出一个 modal 提示用户
  //   if (!isSubmited) {
  //     Modal.confirm({
  //       title: '当前考试还没提交，确定要离开当前页面吗？',
  //       onOk: () => {
  //         // 用户点击确定，继续页面返回
  //         history.goBack();
  //         removeEvt();
  //       },
  //       onCancel: () => {
  //         // 用户点击取消，阻止页面返回
  //       },
  //     });
  //   } else {
  //     history.goBack();
  //   }

  //   // 返回 false 可以阻止默认的页面跳转行为
  //   return false;
  // });

  const { prefix, getPaperInfor, questionTypeList, loading, paperInfor, setQuestionTypeList, submitPaper } = usePaperModel();
  const scoreRef = useRef(null);
  const creatRef = useRef(null);
  const handleBeforeUnload = useCallback((event: any) => {
    // 在这里可以添加你的逻辑来处理页面关闭事件
    // 例如，向后端发送请求保存用户数据或执行其他操作
    event.preventDefault();
    event.returnValue = ''; // 必须设置一个返回值，否则浏览器可能不会触发提示框
  }, []);

  const removeEvt = () => {
    console.log('removeEvt');
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  useEffect(() => {
    courseId && getPaperInfor({ courseId });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      removeEvt();
    };
  }, []);

  return (
    <PageContainer
      header={{
        title: '',
        ghost: true,
      }}
      content={
        <div className={style['detail-page']}>
          <div>
            <div className={style['title']}>
              <ArrowLeftOutlined onClick={goBack} style={{ marginRight: '8px' }} />
              <span style={{ marginRight: '8px' }}>{title}</span>
            </div>
          </div>
        </div>
      }
    >
      <div className={style['exam-container']}>
        <Question
          courseId={courseId}
          prefix={prefix}
          loading={loading}
          questionTypeList={questionTypeList}
          setQuestionTypeList={setQuestionTypeList}
        />
        <Sidebar
          courseId={courseId}
          nodeId={nodeId}
          taskId={taskId}
          prefix={prefix}
          paperInfor={paperInfor}
          questionTypeList={questionTypeList}
          submitPaper={submitPaper}
          cref={beforeLeaveRef}
          removeEvt={removeEvt}
          setIsSubmit={setIsSubmit}
          goBack={goBack}
        />
      </div>
    </PageContainer>
  );
}

export default Index;
