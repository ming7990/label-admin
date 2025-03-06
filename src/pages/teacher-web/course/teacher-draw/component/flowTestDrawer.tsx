import { useDrawModel } from '@/pages/teacher-web/course/model';
import { Button, Checkbox, Drawer, Form, Input, InputNumber, message, Space } from 'antd';
import { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from './style.less';
import customerPhoto from '@/asset/image/customer.png';
import RightChatContent from './chat-right';
import Condition from '@/components/Condition';

const FlowTestDrawer: React.FC<any> = (props: any) => {
  const { cref } = props;
  const boxRef = useRef<any>(null);
  const [visible, setVisible] = useState<any>(false);
  //客户信息
  const [customerInfo, setCustomerInfo] = useState<any>('');
  const [customerInfoVisible, setCustomerInfoVisible] = useState<any>(false);
  //开始结束按钮
  const [sessionId, setSessionId] = useState<any>('');
  const [startBtn, setStartBtn] = useState<any>('start');
  const [inputValue, setInputValue] = useState<any>('');

  const [chatHistory, setChatHistory] = useState<any>([]);
  const { courseCustomInfo, dialogueBegin, dialogueSend, dialogueFinish, flowTestLoading } =
    useDrawModel();

  const { courseInfo } = useModel('course', (model: any) => ({
    courseInfo: model.courseInfo,
  }));

  const onCancel = () => {
    setChatHistory([]);
    setSessionId('');
    setInputValue('');
    setStartBtn('start');
    setVisible(false);
  };

  const open = async () => {
    await courseCustomInfo({ courseId: courseInfo?.id }).then((res) => {
      if (res) {
        setCustomerInfo(res?.data?.customerInfo);
      } else {
        setCustomerInfo('');
      }
    });
    setVisible(true);
  };

  const startBtnClick = async () => {
    if (startBtn == 'end') {
      await dialogueFinish({ courseId: courseInfo?.id, sessionId: sessionId }).then((res) => {
        if (res) {
          setSessionId('');
          setStartBtn('start');
        }
      });
    } else if (startBtn == 'start') {
      await dialogueBegin({ courseId: courseInfo?.id }).then((res) => {
        if (res) {
          setInputValue('');
          setStartBtn('end');
          setSessionId(res?.data?.sessionId);
          setChatHistory([...res?.data?.list]);
          res?.data?.list.map(async (item: any) => {
            if (item.isEnd) {
              await dialogueFinish({ courseId: courseInfo?.id, sessionId: sessionId }).then(
                (res) => {
                  if (res) {
                    setSessionId('');
                    setStartBtn('start');
                  }
                },
              );
            }
          });
        }
      });
    }
  };

  const send = async (e: any) => {
    console.log(boxRef);

    if ((e?.keyCode == '13' || e?.which == '13') && !e?.shiftKey) {
      // sendMessage();
      // 禁止换行
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();
      if (!sessionId) {
        message.warning('请先开始对话');
        return;
      }
      if (!inputValue) {
        message.warning('请输入文本');
        return;
      }
      if (flowTestLoading) {
        message.warning('请等待回复');
        return;
      }
      setChatHistory([...chatHistory, { type: 'student', status: 'loading', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        (boxRef.current as any).scrollTop = (boxRef?.current as any)?.scrollHeight;
      }, 10);

      await dialogueSend({
        courseId: courseInfo?.id,
        sessionId: sessionId,
        message: inputValue,
      }).then((res) => {
        if (res) {
          res?.data?.list.map((item: any) => {
            if (item.isEnd) {
              startBtnClick();
            }
          });
          setChatHistory([
            ...chatHistory,
            ...(res?.data?.list || [{ type: 'student', status: 'error', text: inputValue }]),
          ]);
          (boxRef.current as any).scrollTop = (boxRef?.current as any)?.scrollHeight;
        }
      });
    }
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Drawer
      title={'流程测试'}
      placement="right"
      onClose={onCancel}
      visible={visible}
      footer={
        <div className={styles['chatBox']}>
          <Input.TextArea
            className={styles['textarea']}
            autoSize={{ minRows: 6, maxRows: 6 }}
            maxLength={200}
            value={inputValue}
            placeholder={'输入文本，按回车发送'}
            onPressEnter={send}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className={styles['submitBtn']}>
            <Button
              loading={flowTestLoading}
              onClick={startBtnClick}
              type={'primary'}
              danger={startBtn == 'end' ? true : false}
            >
              {startBtn == 'end' ? '结束对话' : '开始对话'}
            </Button>
          </div>
        </div>
      }
      footerStyle={{ padding: '0' }}
      bodyStyle={{ padding: '0' }}
      className={styles['drawerScroll']}
    >
      <div className={styles['bodyStyle']} ref={boxRef}>
        {/* //客户信息 */}
        <Condition r-if={customerInfo}>
          <div
            className={styles['customerInfo']}
            style={{ display: customerInfoVisible ? '' : 'flex' }}
          >
            {/* {!customerInfoVisible && countLength(customerInfo) > 46
          ? customerInfo.substring(0, 43) + '...'
          : customerInfo} */}
            <span className={customerInfoVisible ? '' : styles['text']}>{customerInfo}</span>
            <a
              className={styles['switch']}
              onClick={() => {
                setCustomerInfoVisible(!customerInfoVisible);
              }}
            >
              {customerInfoVisible ? '收起' : '展开'}
            </a>
          </div>
        </Condition>

        {/* 聊天内容 */}
        <div style={{ marginTop: '24px' }}>
          {chatHistory.map((item: any, index: any) => {
            // const lastType: any = index >= 1 ? chatHistory[index - 1]?.type : null;

            // type 类型  // 类型
            // text 文本内容
            // keysTips 关键点提示 （flag， desc）
            // delay 该话读完需要的秒数
            // status  （loading 加载 / success 回答完全答对 / fail 有关键点没提到）
            const { type, text, role, keysTips, intents, delay = 0, status } = item;

            if (type === 'customer') {
              //// 左边内容
              return (
                <div className={styles['box_customer']} key={index}>
                  <div className={styles['box-avator']}>
                    {/* {lastType !== type && ( */}
                    <img className={styles['avator']} src={customerPhoto} alt="客方" />
                    {/* )} */}
                  </div>
                  <div className={styles['box-bg']}>{text}</div>
                </div>
              );
            } else if (type === 'student') {
              // 右边内容
              return (
                <RightChatContent
                  key={index}
                  status={status}
                  text={text}
                  keysTips={keysTips}
                  intents={intents}
                  showAvator={1}
                />
              );
            } else if (type === 'system') {
              // 中间提示
              return (
                <div className={styles['box_tips']} key={index}>
                  <div className={styles['box_tips_text']}>{text}</div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </Drawer>
  );
};

export default FlowTestDrawer;
