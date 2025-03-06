import React, { memo, useEffect, useRef, useState } from 'react';
import { Avatar, Input, Button, message, Spin, Popconfirm, Modal, List, Skeleton } from 'antd';
import { UserOutlined, LikeOutlined, MessageOutlined, DeleteOutlined, ArrowUpOutlined } from '@ant-design/icons';
import style from './comment.less';
import config from '@/config';
import { useReplyModel } from '../../model';
const successCode = config.successCode;

const ReplyItem: React.FC<any> = memo((props: any) => {
  const { id, creator, content, commentedUser, createTime, likeNum } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  // const [creator, setCreator] = useState('');
  const [parentId, setParentId] = useState(''); // 父评论id;

  const { replyList, publishComment, commentLike } = useReplyModel();
  console.log(replyList, 'commentList');
  const onInput = (e: any) => {
    console.log(e.target?.value);
    setText(e.target?.value)
  };

  const onShowComment = () => {

  };

  // 回复提交
  const onSubmit = () => {
    if (text) {
      setVisible(false);
      console.log(parentId)
      publishComment({ parentId, knowledgeId: props.id, comments: text }, () => {

      });
    } else {
      message.warn('请填写回复');
    }
  };
  // 点赞;
  const onLike = async () => {
    // const list = [...commentList];
    // const res = await commentLike({ commentId: id });
    // if (res?.resultCode) {
    //   if (isLike) {
    //     list[index].likeNum = +likeNum - 1;
    //   } else {
    //     list[index].likeNum = +likeNum + 1;
    //   }
    //   list[index].isLike = !list[index].isLike;
    //   setCommentList(list);
    // }
  };
  return (
    <>
      <div className={style['reply-item']}>
        <div className={style.username}>{creator} <span style={{ color: '#1890FF' }}>回复{commentedUser}</span>：</div>
        <div className={style.content}>{content}</div>
        <div className={style['infor-opt']}>
          <span className={style.time}>{createTime}</span>
          <span className={style.likeBtn}><LikeOutlined className={style.likeIcon} /> {likeNum}</span>
          <span onClick={() => {
            // setCreator(creator);
            setParentId(id);
            setVisible(true);
          }} className={style.msgBtn}><MessageOutlined className={style.msgIcon} /> 回复</span>
          <Popconfirm
            title="确定删除吗"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {

            }}
          >
            <span className={style.delBtn}><DeleteOutlined className={style.delIcon} /> 删除</span>
          </Popconfirm>
        </div>
      </div>
      <Modal
        width={560}
        title={"回复" + creator}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>取 消</Button>,
          <Button key="save" type="primary" onClick={onSubmit}>发 布</Button>,
        ]}
      >
        <Input.TextArea onChange={onInput} placeholder='我来说说' showCount maxLength={500} rows={3}></Input.TextArea>
      </Modal>
    </>
  );
});

export default ReplyItem;
