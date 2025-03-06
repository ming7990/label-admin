import React, { memo, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Avatar, Input, Button, message, Skeleton, Popconfirm, Modal, Divider } from 'antd';
import { UserOutlined, LikeOutlined, MessageOutlined, DeleteOutlined, ArrowUpOutlined } from '@ant-design/icons';
import style from './comment.less';
import config from '@/config';
import InfiniteScroll from 'react-infinite-scroll-component';
// import ReplyItem from './replyItem'
import { useReplyModel } from '../../model';
const successCode = config.successCode;

const ReplyItem: React.FC<any> = memo((props: any) => {
  const {
    knowledgeId, ableComment,
    id, creator, comments, commentedUser, createTime, likeCount, isLike, primaryId, likeId,
    publishComment, commentLike, reload, replyList, setList, index, commentDelete, ableDelete
  } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const onInput = (e: any) => {
    setText(e.target?.value);
  };
  // 回复提交
  const onSubmit = () => {
    if (text) {
      publishComment({ primaryId, parentId: id, knowledgeId: knowledgeId, comments: text }, () => {
        setVisible(false);
        reload();
        console.log('重新拉取回复评论11');
      });
    } else {
      message.warn('请填写回复');
    }
  };
  // 点赞;
  const onLike = async () => {
    const list = [...replyList];
    const res = await commentLike({ id: likeId, type: isLike ? 'cancel' : 'like', commentId: id });
    if (res?.resultCode) {
      if (isLike) {
        list[index].likeCount = +likeCount - 1;
      } else {
        list[index].likeCount = +likeCount + 1;
      }
      list[index].likeId = res.data?.likeId;
      list[index].isLike = !list[index].isLike;
      setList(list);
    }
  };
  return (
    <>
      <div className={style['reply-item']}>
        <div className={style.username}>{creator} <span style={{ color: '#1890FF' }}>回复{commentedUser}</span>：</div>
        <div className={style.content}>{comments}</div>
        <div className={style['infor-opt']}>
          <span className={style.time}>{createTime}</span>
          <span className={`${style.likeBtn} ${isLike ? style.liked : ''}`} onClick={onLike}><LikeOutlined className={style.likeIcon} /> {likeCount}</span>
          {ableComment ?
            <span onClick={() => {
              setText('');
              setVisible(true);
            }} className={style.msgBtn}><MessageOutlined className={style.msgIcon} /> 回复</span> : null
          }
          {
            ableDelete ? <Popconfirm
              title="确定删除吗"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                const res = await commentDelete({ commentId: id });
                if (res) reload();
              }}
            >
              <span className={style.delBtn}><DeleteOutlined className={style.delIcon} /> 删除</span>
            </Popconfirm> : null
          }
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
        <Input.TextArea value={text} onChange={onInput} placeholder='我来说说' showCount maxLength={500} rows={3}></Input.TextArea>
      </Modal>
    </>
  );
});
// 回复;
const ReplyBox: React.FC<any> = memo((props: any) => {
  const { primaryId, parentId, cref, knowledgeId } = props;
  const {
    hasMore, curPage, setList, getReplyList, replyList, publishComment, commentLike, commentDelete,
    total, hideItem, setHideItem,
  } = useReplyModel();

  useEffect(() => {
    getReplyList({ commentId: parentId, page: 1 });
  }, [parentId]);

  const onLoadMore = () => {
    setHideItem(!hideItem);
  };

  const reload = () => {
    // 重新拉取评论;
    console.log('重新拉取回复评论');
    getReplyList({ commentId: parentId, page: 1 });
  };
  const loadMoreData = () => {
    getReplyList({ commentId: parentId, page: curPage + 1 });
    setHideItem(false);
  }
  useImperativeHandle(cref, () => ({
    reload,
  }));
  const len = replyList.length;
  if (len === 0) return null;

  return (
    <div className={`${style['reply-box']} ${hideItem ? style.two : ''}`}>
      <div className={style['reply-scroll']} id={'replay-scroll-' + parentId}>
        <InfiniteScroll
          dataLength={replyList.length}
          next={loadMoreData}
          hasMore={replyList.length < total}
          // loader={<Skeleton paragraph={{ rows: 1 }} active />}
          // endMessage={<Divider plain>没有更多了</Divider>}
          scrollableTarget={'replay-scroll-' + parentId}
        >
          <div>
            {
              replyList.map((item: any, index: number) => (
                <ReplyItem
                  key={item.id}
                  {...item}
                  commentLike={commentLike}
                  publishComment={publishComment}
                  reload={reload}
                  setList={setList}
                  replyList={replyList}
                  index={index}
                  commentDelete={commentDelete}
                  primaryId={primaryId}
                  knowledgeId={knowledgeId}
                />
              ))
            }
          </div>
        </InfiniteScroll>
      </div>
      {
        replyList.length > 2 && hideItem ? <a onClick={onLoadMore} style={{ textAlign: "left" }} className={style.moreBtn}>查看所有回复</a> : null
      }
      {
        replyList.length > 2 && !hideItem ? <a onClick={onLoadMore} style={{ textAlign: "left" }} className={style.moreBtn}>收起</a> : null
      }
    </div>
  )
});

// 主评论;
const CommentItem: React.FC<any> = memo((props: any) => {
  const {
    knowledgeId, ableTop,
    setCommentList, commentList, index, publishComment, getCommentList,
    commentLike, commentTop, commentDelete, likeId,
    id, isTop, isLike, createTime, creator, likeCount, ableComment, comments, replyList = [], ableDelete
  } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [parentId, setParentId] = useState(''); // 父评论id;
  const replyBox = useRef(null);
  const reload = () => {
    // 重新拉取评论;
    getCommentList({ knowledgeId, page: 1 });
  };
  const onCancel = () => {
    setVisible(false);
  };
  const onInput = (e: any) => {
    console.log(e.target?.value);
    setText(e.target?.value)
  };
  // 主评论的回复提交
  const onSubmit = () => {
    if (text) {
      setVisible(false);
      console.log(parentId)
      publishComment({ primaryId: parentId, parentId, knowledgeId, comments: text }, () => {
        // 重新拉回复取评论;
        replyBox?.current.reload?.();
      });
    } else {
      message.warn('请填写回复');
    }
  };

  const onTop = async () => {
    const res = await commentTop({ commentId: id, top: !isTop });
    if (res) reload();
  };

  const Toping = (
    ableTop ?
      <Popconfirm
        title={isTop ? "确定取消置顶这条评论吗" : "确定置顶这条评论吗"}
        okText="确定"
        cancelText="取消"
        onConfirm={async () => {
          onTop();
        }}
      >
        <span className={`${style.topBtn} ${isTop && style.topedBtn}`}><ArrowUpOutlined className={style.topIcon} />置顶</span>
      </Popconfirm> : null
  );

  // 点赞;
  const onLike = async () => {
    const list = [...commentList];
    const res = await commentLike({ id: likeId, type: isLike ? 'cancel' : 'like', commentId: id });
    if (res?.resultCode) {
      if (isLike) {
        list[index].likeCount = +likeCount - 1;
      } else {
        list[index].likeCount = +likeCount + 1;
      }
      list[index].likeId = res.data?.likeId;
      list[index].isLike = !list[index].isLike;
      setCommentList(list);
    }
  };
  // 回复;
  const onReply = (id: string) => {
    setParentId(id);
    setText('');
    setVisible(true);
  };

  return (
    <div className={style['comment-item']}>
      <div className={style['comment-item-content']}>
        <div className={style.userimg}>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </div>
        <div className={style.username}>{creator}</div>
        <div className={style.content}>{comments}</div>
        <div className={style['infor-opt']}>
          <span className={style.time}>{createTime}</span>
          <span className={`${style.likeBtn} ${isLike ? style.liked : ''}`} onClick={onLike}><LikeOutlined className={style.likeIcon} /> {likeCount}</span>
          {
            ableComment ?
              <span onClick={() => {
                onReply(id);
              }} className={style.msgBtn}><MessageOutlined className={style.msgIcon} /> 回复</span> :
              null
          }
          {Toping}
          {
            ableDelete ? <Popconfirm
              title="确定删除吗"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                const res = await commentDelete({ commentId: id });
                if (res) reload();
              }}
            >
              <span className={style.delBtn}><DeleteOutlined className={style.delIcon} /> 删除</span>
            </Popconfirm> : null
          }
        </div>
        <div style={{ display: isTop ? 'block' : 'none' }} className={style.topTag}>置顶评论</div>
        {/* 回复列表 */}
        <ReplyBox cref={replyBox} parentId={id} primaryId={id} knowledgeId={knowledgeId}></ReplyBox>
      </div>
      {/* modal */}
      <Modal
        width={560}
        title="回复评论"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>取 消</Button>,
          <Button key="save" type="primary" onClick={onSubmit}>发 布</Button>,
        ]}
      >
        <Input.TextArea value={text} onChange={onInput} placeholder='我来说说' showCount maxLength={500} rows={3}></Input.TextArea>
      </Modal>
    </div>
  )
});

export default CommentItem;
