import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import {
  getKnowledgeList, getKnowledgeDetail, knowledgeInsert, knowledgeUpdate, getCreatorList,
  knowledgeDelete, onknowledgeUpDown, knowledgeDirectory, knowledgeUpload, getKnowledgeFiles,
  commentReply, knowledgeLike, oncommentLike, getCommentLists, oncommentTop, getCommentMoreLists,
  commentDelete, knowledgeDirectoryInsert, directoryDelete, ondirectoryMove, getKnowledgeId,
  rename, downLoadFile, onfileDelete, getKgListAll, downLoadFile2, knowledgeAdd, postMessage,
  questionInsert, questionDetail, questionUpdate, qualityList, addQuality, editQuality, deleteQuality, qualityGenQuestion,
  qualityQuestionLis, editQualityQuestion, qualityQuestionStatus, deleteQualityQuestion, qualityQuestionDetail
} from './api';

const { successCode } = config;

const commentLike = async (data: any) => {
  const res: any = await oncommentLike(data);
  if (res?.resultCode == successCode) {
    message.success(res?.resultDesc);
    return res;
  } else {
    message.error(res?.resultDesc);
    return false;
  }
}
// 上下架;
const knowledgeUpDown = (params: any) => {
  return new Promise((r) => {
    onknowledgeUpDown(params).then((res: any) => {
      if (res?.resultCode == successCode) {
        message.success(res?.resultDesc);
        r(res);
      } else {
        message.error(res?.resultDesc);
        r(false);
      }
    });
  });
}

export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getTableList = async (params: any) => {
    setTableLoading(true);
    const res = await getKnowledgeList(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  }

  const onKnowledgeInsert = async (data: any) => {
    const res: any = await knowledgeInsert(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  const on_getKnowledgeDetail = async (data: any) => {
    const res: any = await getKnowledgeDetail(data);
    if (res?.resultCode == successCode) {
      // message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }
  const fileDelete = async (data: any) => {
    const res: any = await onfileDelete(data);
    if (res?.resultCode == successCode) {
      // message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  const onknowledgeUpdate = async (data: any) => {
    const res: any = await knowledgeUpdate(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  const postVideoMessage = async (data: any) => {
    const res: any = await postMessage(data);
    if (res?.resultCode == successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  return {
    tableLoading,
    getTableList,
    getCreatorList,
    getKnowledgeDetail: on_getKnowledgeDetail,
    knowledgeInsert: onKnowledgeInsert,
    knowledgeUpdate: onknowledgeUpdate,
    knowledgeDelete,
    knowledgeUpDown,
    knowledgeUpload,
    knowledgeDirectory,
    getKnowledgeId,
    getKnowledgeFiles,
    fileDelete,
    getPreviewUrl: downLoadFile2,
    postVideoMessage,
    questionInsert,
    questionDetail,
    questionUpdate,
    qualityList,
    addQuality,
    editQuality,
    deleteQuality,
    qualityGenQuestion,
    qualityQuestionLis,
    editQualityQuestion,
    qualityQuestionStatus,
    deleteQualityQuestion,
    qualityQuestionDetail
  }
}

// 左边目录;
export const useDirectoryModel = (directory: any, file: any) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [topId, setTopId] = useState<string>(''); // 顶级目录id;

  const dealList = (list: any[] = []) => {
    const arr: any[] = [];
    list.forEach((item: any, i: number) => {
      arr.push({
        title: item.className,
        key: item.id,
        icon: item.isDirectory ? directory : file,
        isLeaf: !item.isDirectory,
        // children: item.children && dealList(item.children)
      });
    });
    return arr;
  }
  const getFirstDirectory = () => {
    setLoaded(false);
    knowledgeDirectory().then(res => {
      setLoaded(true);
      if (res?.resultCode == successCode) {
        const list: any[] = dealList(res?.data || []);
        setTopId(list[0]?.key);
        setTreeData(list);
      } else {
        message.error(res?.resultDesc);
      }
    });
  }

  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
    list.map(node => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  // 重命名;
  const updateTitle = (list: any[], key: React.Key, title: string): any[] => {
    list.forEach(node => {
      if (node.key === key) {
        node.title = title;
        return;
      }
      if (node.children) {
        return updateTitle(node.children, key, title)
      }
      return node;
    });
    return list;
  }
  const onLoadData = ({ key, children }: any) => {
    return new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      knowledgeDirectory({ parentId: key }).then(res => {
        const list: any[] = dealList(res?.data || []);
        setTreeData(origin =>
          updateTreeData(origin, key, list),
        );
        resolve();
      });
    });
  }

  let oldData = null;
  const onDrop = (info, reload) => {
    console.log(info);
    const dropKey = info.node.key; // 终止键
    const dragKey = info.dragNode.key; // 拖动键
    const dropPos = info.node.pos.split('-');
    // // -1是移动到和他平级在他上面 1是移动到和他平级在他下面 0是移动到他下面作为他子集
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    console.log(dropPosition, 'dropPosition')
    const loop = (
      data: any[],
      key: React.Key,
      callback: (node: any, i: number, data: any[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const findParent = (
      data: any[],
      key: React.Key,
      callback: (node: any, i: number, data: any[]) => void,
    ) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i].children.find(item => item.key === key),'key', key);
        if (data[i].children && data[i].children.find(item => item.key === key)) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          findParent(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];
    // Find dragObject
    let dragObj: any;
    let parentId: any;
    let previousId: any = '';
    let _delete: any;
    let _insert: any;
    let isDone = true;
    loop(data, dragKey, (item, index, arr) => {
      // arr.splice(index, 1);
      dragObj = item;
      _delete = () => { arr.splice(index, 1); }
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        parentId = item.key;
        const prevO = item.children[0];
        console.log(prevO, 1);
        if (dragObj.isLeaf && prevO && !prevO.isLeaf) {
          isDone = false;
          return message.warn('不能移动到目录的前面');
        }
        previousId = '';
        // where to insert 示例添加到头部，可以是随意位置
        // item.children.unshift(dragObj);
        _insert = () => { item.children.unshift(dragObj); }
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        const prevO = item.children[0];
        console.log(prevO, 2);
        if (dragObj.isLeaf && prevO && !prevO.isLeaf) {
          isDone = false;
          return message.warn('不能移动到目录的前面');
        }
        previousId = '';
        parentId = item.key;
        // where to insert 示例添加到头部，可以是随意位置
        // item.children.unshift(dragObj);
        _insert = () => { item.children.unshift(dragObj); }
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        const prevO = ar[i!];
        console.log(prevO, 3);
        if (dragObj.isLeaf && prevO && !prevO.isLeaf) {
          isDone = false;
          return message.warn('不能移动到目录的前面');
        }
        if (prevO && prevO.key) previousId = prevO.key;
        parentId = dropKey;
        // ar.splice(i!, 0, dragObj!);
        _insert = () => { ar.splice(i!, 0, dragObj!); }
      } else {
        const prevO = ar[i! + 1];
        console.log(prevO, 4);
        if (dragObj.isLeaf && prevO && !prevO.isLeaf) {
          isDone = false;
          return message.warn('不能移动到目录的前面');
        }
        if (prevO && prevO.key) previousId = prevO.key;
        // ar.splice(i! + 1, 0, dragObj!);
        _insert = () => { ar.splice(i! + 1, 0, dragObj!); }
        // 作为子元素
        parentId = dropKey;
        if (info.node.isLeaf) {
          findParent(data, dropKey, (item) => {
            console.log(item, 'findParent');
            if (item) parentId = item.key;
          })
        }
      }
    }
    // 能移动 且不能添加自己且不能移动到和知识库同级(info.node.pos != '0-0')；
    ((info.node.pos != '0-0' || !info.dragNode.isLeaf) && isDone && previousId != dragKey) && directoryMove({ parentId, classId: dragKey, isDirectory: !info.dragNode.isLeaf, previousId }).then(res => {
      if (res) {
        _delete && _delete();
        _insert && _insert();
        setTreeData(data);
        // reload && reload();
      }
    });
  };

  const insertDir = (className: string, key: any, isDirectory: boolean) => {
    // const className = '文件';
    return new Promise((r) => {
      knowledgeDirectoryInsert({ isDirectory, parentId: key, className }).then(res => {
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          // setTreeData(origin =>
          //   updateTreeData(origin, key, [{
          //     title: className,
          //     key: res?.data?.classId,
          //     icon: isDirectory ? directory : file,
          //     isLeaf: !isDirectory
          //   }])
          // );
          r(res);
        } else {
          message.error(res?.resultDesc);
          r(false);
        }
      });
    });
  }

  const deleteDirOrFile = (params: any) => {
    return new Promise((r) => {
      directoryDelete(params).then(res => {
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          // setTreeData(origin =>
          //   updateTreeData(origin, key, [{
          //     title: className,
          //     key: res?.data?.classId,
          //     icon: isDirectory ? directory : file,
          //     isLeaf: !isDirectory
          //   }])
          // );
          r(res);
        } else {
          message.error(res?.resultDesc);
          r(false);
        }
      });
    });
  }

  // 重命名;
  const renameDf = (params: any) => {
    return new Promise((r) => {
      rename(params).then(res => {
        const { classId, className } = params;
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          setTreeData(origin =>
            updateTitle(origin, classId, className)
          );
          r(res);
        } else {
          message.error(res?.resultDesc);
          r(false);
        }
      });
    });
  }

  const directoryMove = (params: any) => {
    return new Promise((r) => {
      ondirectoryMove(params).then(res => {
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          r(res);
        } else {
          message.error(res?.resultDesc);
          r(false);
        }
      });
    });
  }

  const onknowledgeAdd = (params: any) => {
    return new Promise((r) => {
      knowledgeAdd(params).then(res => {
        if (res?.resultCode == successCode) {
          message.success(res?.resultDesc);
          r(res);
        } else {
          message.error(res?.resultDesc);
          r(false);
        }
      });
    });
  }

  return {
    topId,
    treeData,
    setTreeData,
    onLoadData,
    getFirstDirectory,
    knowledgeDirectory,
    insertDir,
    deleteDirOrFile,
    onDrop,
    directoryMove,
    renameDf,
    loaded,
    getKgListAll,
    updateTreeData,
    knowledgeUpDown,
    onknowledgeAdd
  }
}

// 内容
export const useContentModel = () => {
  const [content, setContent] = useState<any>({});
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getContent = async (params: any) => {
    console.log(params, 'getContent');
    setLoading(true);
    getKnowledgeDetail(params).then((res: any) => {
      setLoading(false);
      setContent(res?.data);
      getFiles(params);
    });
  }
  // 获取文件列表;
  const getFiles = (params: any) => {
    setLoading(true);
    getKnowledgeFiles(params).then((res: any) => {
      const list = res?.data || [];
      setLoading(false);
      setFiles(list);
    });
  }
  const download = async (params: any) => {
    const res = await downLoadFile(params);
    console.log(res);
  }

  const onknowledgeLike = async (data: any) => {
    const res: any = await knowledgeLike(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  return {
    content,
    getContent,
    setContent,
    files,
    loading,
    knowledgeLike: onknowledgeLike,
    download,
    getPreviewUrl: downLoadFile2,
    setFiles,
  }
};
// 评论;
export const useCommentModel = () => {
  const [commentList, setCommentList] = useState([]);
  // 是否还有评论;
  const [total, setTotal] = useState(0);
  // 评论页数;
  const [pages, setPages] = useState(0);
  // 当前页码;
  const [curPage, setCurPage] = useState(1);

  const pageSize = 10;
  // 获取评论;
  const getCommentList = (params: any) => {
    console.log('getCommentList');
    const page = params.page; // 当前页;
    setCurPage(page);
    getCommentLists({
      ...params,
      pageSize
    }).then(res => {
      const data = res?.data || {};
      console.log(data.list, 'data.list');
      setTotal(data.totalPage);
      setCommentList(data.list);
    });
  }
  // 发布评论
  const publishComment = async (params: any, cb: Function) => {
    console.log('publishComment', params);
    const res = await commentReply(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      cb(); // 重置输入框;
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  const commentTop = async (data: any) => {
    const res: any = await oncommentTop(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  return {
    commentList,
    getCommentList,
    setCommentList,
    publishComment,
    commentLike,
    commentTop,
    total,
    curPage,
    setCurPage,
    commentDelete,
  }
}

// 回复评论列表;
export const useReplyModel = () => {
  const [replyList, setList] = useState<any>([]);
  // 是否还有评论;
  const [total, setTotal] = useState(0);
  // 评论页数;
  const [pages, setPages] = useState(0);
  const [hideItem, setHideItem] = useState(true);
  // 当前页码;
  const [curPage, setCurPage] = useState(1);

  const publishComment = async (params: any, cb: Function) => {
    console.log('publishComment', params);
    const res = await commentReply(params);
    if (res) {
      cb(); // 重置输入框;
    }
  }
  const pageSize = 10;
  // 获取评论;
  const getReplyList = (params: any) => {
    console.log('getReplyList');
    const page = params.page; // 当前页;
    setCurPage(page);
    getCommentMoreLists({
      ...params,
      pageSize
    }).then(res => {
      if (res?.resultCode == successCode) {
        const data = res?.data || {};
        console.log(data.list, 'data.list');
        const pages = Math.ceil(data.totalPage / pageSize);
        setTotal(data.totalPage);
        setPages(pages);
        let prevList: any = [...replyList];
        if (page === 1) {
          prevList = data.list;
          console.log(data.list);
        } else {
          prevList.push(...data.list); // 追加;
        }
        setList(prevList);
      } else {
        message.error(res?.resultDesc);
      }
    });
  }

  return {
    total,
    curPage,
    publishComment,
    getReplyList,
    replyList,
    setList,
    commentLike,
    commentDelete,
    hideItem,
    setHideItem,
  }
}

export const previewModel = () => {
  const download = async (params: any) => {
    const res = await downLoadFile2(params);
    return res;
  }

  return {
    download
  }
}
