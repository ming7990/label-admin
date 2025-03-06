import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Divider, Input, Button, message, Spin, Space, notification, Drawer, Pagination } from 'antd';
import { useCommentModel } from '../../model';
import style from './comment.less';
import CommentItem from './commentItem';

const CommentDetail: React.FC<any> = (props: any) => {
  const {
    getCommentList, setCommentList, publishComment, commentList = [], commentLike, commentTop,
    total, curPage, commentDelete,
  } = useCommentModel();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getCommentList({ knowledgeId: props.id, page: 1 });
  }, [props.id]);

  const onChange = useCallback((page: number) => {
    getCommentList({ knowledgeId: props.id, page });
  }, [props.id]);

  const handleInputChange = (e: any) => {
    const val = (e.target?.value || '').trim();
    setInputValue(val);
  };

  const onPublish = () => {
    const comments = inputValue;
    if (comments) {
      publishComment({ knowledgeId: props.id, comments }, () => {
        setInputValue('');
        // 重新拉取评论;
        getCommentList({ knowledgeId: props.id, page: 1 });
      });
    } else {
      message.warn('请输入评论');
    }
  };

  return (
    <div className={style['comment-detail-box']}>
      <div className={style['title-bar']}>
        <div style={{ fontSize: 20, color: '#000000d9' }} className={style['title']}>评论</div>
        <Divider style={{ margin: '16px 0' }} />
      </div>
      <div className={style['publish-area']}>
        <div className={style['input-area']}>
          <Input.TextArea value={inputValue} onChange={handleInputChange} placeholder='欢迎评论~' maxLength={500} showCount rows={2}></Input.TextArea>
        </div>
        <Button disabled={!inputValue} onClick={onPublish} className={style['p-btn']}>发 布</Button>
      </div>
      <div className={style['comment-show-box']}>
        <div className={style['comment-list-box']}>
          {
            commentList.map((item: any, index) => (
              <CommentItem
                knowledgeId={props.id}
                {...item} key={item.id}
                commentList={commentList}
                setCommentList={setCommentList}
                getCommentList={getCommentList}
                index={index}
                publishComment={publishComment}
                commentLike={commentLike}
                commentTop={commentTop}
                commentDelete={commentDelete}
              />
            ))
          }
        </div>
        <Pagination style={{ paddingLeft: 45 }} hideOnSinglePage={true} pageSize={10} onChange={onChange} defaultCurrent={1} current={curPage} total={total} />
      </div>
    </div>
  )
};
export default CommentDetail;
