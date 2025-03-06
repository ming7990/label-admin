import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Modal, Tree, Menu, Radio, Button, message, Input, Space, Popconfirm, Dropdown } from 'antd';
import { UnorderedListOutlined, FolderOutlined, FileOutlined, DoubleLeftOutlined, DoubleRightOutlined, FileTextOutlined } from '@ant-design/icons';
import style from '../style.less';
import initImg from '../../../../asset/image/study.jpg';
import ContentDetail from './components/contentDetail';
import CommentDetail from './components/commentDetail';
import AddKnowLedge from './components/addKnowLedge';
import { useDirectoryModel } from '../model';

import { useModel } from 'umi';

const KnowledgeDetail = (props: any) => {
  const [showTree, setTreeShow] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [renameVisible, setRnVisible] = useState<boolean>(false);
  const [renameVisible2, setRnVisible2] = useState<boolean>(false);
  const [id, setId] = useState(''); // 知识id;
  const [dfName, setName] = useState(''); // 文件名称;
  const [renameNode, setRenameNode] = useState({}); // 文件名称;
  const [nameIndex, setNameIndex] = useState(0); // 文件夹序号;

  const [statusVal, setStatusVal] = useState<any>(undefined);
  const dirkey = useRef(''); // 要删除的文件目录id;
  const addKnowNode = useRef({});
  const contentRef = useRef({});

  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { menuBtns } = userInfoAll || {};
  // const authKey = props['authKey'];
  // const rif = authKey ? menuBtns?.includes(authKey) : false;

  const {
    topId, insertDir, getFirstDirectory, treeData, onLoadData, setTreeData,
    deleteDirOrFile, directoryMove, onDrop, renameDf, loaded, getKgListAll, knowledgeUpDown, onknowledgeAdd
  } = useDirectoryModel(<UnorderedListOutlined />, <FileTextOutlined />);
  useEffect(() => {
    getFirstDirectory();
  }, []);
  const onToggle = () => {
    setTreeShow(!showTree);
  };

  const reload = () => {
    getFirstDirectory();
    setId('');
  };

  const onSelect = (a: string[], { node }: any) => {
    // 知识id;
    if (node.isLeaf) {
      setId(node.key); // 最后一个
    }
  }

  const deleteDir = (key: string) => {
    setVisible(true);
    dirkey.current = key;
  }

  const add = ({ key, isDirectory }) => {
    const index = nameIndex + 1;
    setRnVisible2(true);
    setName('文件夹' + (nameIndex + 1));
    setRenameNode({ key, isLeaf: !isDirectory });
    setNameIndex(index);
  };
  // 添加知识;
  const addKnow = ({ key }: any) => {
    addKnowNode.current = { parentId: key };
    cref.current?.open();
  };
  const onSelectId = (knowledgeIdList: any[]) => {
    const { parentId }: any = addKnowNode.current;
    let previousId = '';
    onknowledgeAdd({ parentId, knowledgeIdList, isDirectory: false, previousId }).then((res: any) => {
      if (res) {
        reload();
      }
    });
  };

  const menu = ({ title, key, isLeaf }: any) => {
    let items: any[] = [];
    if (!isLeaf) {
      // 目录;
      // items.push(
      //   {
      //     key: 'add-dir', label: <span onClick={() => add({ title, key, isDirectory: true })}>添加子文件夹</span>,
      //   },
      //   {
      //     key: 'add-file', label: <span onClick={() => addKnow({ title, key, isDirectory: false })}>添加知识</span>,
      //   },
      // );
      // 权限判断;
      if (menuBtns.includes('add_sub_directory_btn')) {
        items.push({
          key: 'add-dir', label: <span onClick={() => add({ title, key, isDirectory: true })}>添加子文件夹</span>,
        });
      }
      if (menuBtns.includes('add_knowledge_btn')) {
        items.push({
          key: 'add-file', label: <span onClick={() => addKnow({ title, key, isDirectory: false })}>添加知识</span>,
        });
      }
      if (topId != key) {
        // 不是顶级目录;
        // items.push(
        //   {
        //     key: 'rename-dir', label: <span onClick={() => rename({ title, key, isLeaf })}>重命名</span>,
        //   },
        //   {
        //     key: 'delete-dir', label: <span onClick={() => deleteDir(key)}>删除</span>,
        //   },
        // );
        if (menuBtns.includes('rename_directory_btn')) {
          items.push({
            key: 'rename-dir', label: <span onClick={() => rename({ title, key, isLeaf })}>重命名</span>,
          });
        }
        if (menuBtns.includes('delete_directory_btn')) {
          items.push({
            key: 'delete-dir', label: <span onClick={() => deleteDir(key)}>删除</span>,
          });
        }
      }
    } else {
      if (menuBtns.includes('rename_directory_btn')) {
        items.push({
          key: 'rename-file', label: <span onClick={() => rename({ title, key, isLeaf })}>重命名</span>,
        });
      }
      if (menuBtns.includes('down_knowledge_btn')) {
        items.push({
          key: 'up-file', label: <Popconfirm
            title="确定要下架吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              const res: any = await knowledgeUpDown({ status: 1, knowledgeId: key });
              if (res) { reload() }
            }}
          >
            <span>下架</span>
          </Popconfirm>
        });
      }
      if (menuBtns.includes('delete_directory_btn')) {
        items.push({
          key: 'delete-file', label: <Popconfirm
            title="删除后，该知识无法找回，确定要删除吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              const res: any = await deleteDirOrFile({ isDirectory: false, status: 1, classId: key });
              if (res) { reload() }
            }}
          >
            <span>删除</span>
          </Popconfirm>,
        });
      }
    }
    return (
      <Menu
        items={items}
      />
    )
  };

  const rename = (node: any) => {
    setRnVisible(true);
    setRenameNode(node);
    setName(node.title);
  }
  const onRename = () => {
    renameDf({ classId: renameNode?.key, className: dfName, isDirectory: !renameNode?.isLeaf }).then(res => {
      if (res) {
        setRnVisible(false);
        setName('');
        if (renameNode?.isLeaf) {
          // 更新右边的名称
          contentRef?.current?.setName(dfName);
        }
      }
    });
  }
  const onDeleteDirOrFile = async () => {
    const res: any = await deleteDirOrFile({ isDirectory: true, status: statusVal, classId: dirkey.current });
    if (res) {
      reload();
      setVisible(false);
    }
  }

  const titleRender = (nodeData: any) => {
    return (
      <Dropdown overlay={() => menu(nodeData)} trigger={['contextMenu']}>
        <span>{nodeData.title}</span>
      </Dropdown>
    );
  };

  const cref = useRef(null);
  return (
    <PageContainer
      header={{
        title: '知识查看',
        breadcrumb: {},
      }}
    >
      <div className={style["knowledge-detail"]}>
        <div className={`${style["directory-box"]} ${!showTree && style.toggleBtnHide}`}>
          <div className={style["toggle-btn"]} onClick={onToggle}>
            {
              showTree ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
            }
          </div>
          {loaded &&
            <div className={style["tree-content"]} style={{ display: showTree ? 'block' : 'none' }}>
              <Tree
                rootClassName="directoryTreeNode"
                showIcon
                titleRender={titleRender}
                className="draggable-tree"
                draggable={(node: any) => {
                  if (menuBtns.includes('move_knowledge_btn')) {
                    if (node.key == topId) return false;
                    return true;
                  } else {
                    return false;
                  }
                }}
                blockNode
                onDrop={(e) => onDrop(e, reload)}
                loadData={onLoadData}
                treeData={treeData}
                onSelect={onSelect}
              />
              <Modal
                title={null}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                  <Button
                    disabled={statusVal == undefined}
                    type="primary"
                    onClick={onDeleteDirOrFile}>确定</Button>,
                ]}
              >
                <Radio.Group onChange={(e) => setStatusVal(e.target.value)}>
                  <Space direction="vertical" size="middle">
                    <Radio key={0} value={0}>仅删除文件夹</Radio>
                    <Radio key={1} value={1}>删除文件夹及其内所有内容</Radio>
                    <Radio key={2} value={2}>删除文件夹及下架所有内容</Radio>
                  </Space>
                </Radio.Group>
              </Modal>
              <Modal
                title={null}
                visible={renameVisible}
                onCancel={() => setRnVisible(false)}
                footer={[
                  <Button
                    disabled={!dfName}
                    type="primary"
                    onClick={onRename}>确定</Button>,
                ]}
              >
                <Input value={dfName} style={{ marginTop: 15 }} placeholder="名称" onChange={(e) => setName(e.target.value)}></Input>
              </Modal>
              <Modal
                title={null}
                visible={renameVisible2}
                onCancel={() => setRnVisible2(false)}
                footer={[
                  <Button
                    disabled={!dfName}
                    type="primary"
                    onClick={async () => {
                      const res = await insertDir(dfName, renameNode.key, !renameNode.isLeaf);
                      if (res) {
                        setRnVisible2(false);
                        setName('');
                        reload();
                      }
                    }}>确定</Button>,
                ]}
              >
                <Input value={dfName} style={{ marginTop: 15 }} placeholder="名称" onChange={(e) => setName(e.target.value)}></Input>
              </Modal>
            </div>
          }
          <AddKnowLedge cref={cref} getKgListAll={getKgListAll} callback={onSelectId} />
        </div>
        <div className={style["detail-box"]}>
          {
            id !== '' ?
              <div className={style["knowledge-box"]}>
                <ContentDetail cref={contentRef} id={id}></ContentDetail>
                <CommentDetail id={id}></CommentDetail>
              </div> :
              <div className={style["not-selected"]}>
                <h2>欢迎来到知识库</h2>
                <img style={{ width: 502 }} src={initImg} alt="" />
              </div>
          }
        </div>
      </div>
    </PageContainer>
  );
};

export default KnowledgeDetail;
