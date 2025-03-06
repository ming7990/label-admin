import { useState, useImperativeHandle, Fragment, useEffect, useRef } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Checkbox,
  Space,
  Radio,
  Upload,
  Popconfirm,
  Tag,
  Pagination,
} from 'antd';
import { useTableModel } from '../model';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '@/config/index';
import style from '../style.less';

export default (props: any) => {
  const { cref, tableRef } = props;

  const { getClassList, addClass, editClass, deleteClass } = useTableModel();
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>('');
  const [addVal, setAddVal] = useState<string>('');
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [active, setActive] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const inputRef = useRef<any>();

  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<any>({});
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useImperativeHandle(cref, () => ({
    classId: active,
    search: search,
  }));

  useEffect(() => {
    search();
  }, []);

  const search = () => {
    const params = {
      page: 1,
    };
    setPage(1);
    getList(params);
  };

  const pageChange = (v: number) => {
    const params = {
      page: v,
    };
    setPage(v);
    getList(params);
  };

  const getList = async (params: any) => {
    const res = await getClassList({ className: searchVal, type: 'file', pageSize: 10, ...params });
    setList(res.data);
    setTotal(res.total);
  };

  const addClassify = async () => {
    if (!addVal) {
      setAddVal('');
      setInputVisible(false);
      return;
    }
    const params = {
      className: addVal,
      type: 'file',
    };
    const res = await addClass(params);
    if (res) {
      search();
    }
    setAddVal('');
    setInputVisible(false);
  };

  const showEditModal = async (row: any) => {
    console.log('editClassify', row);
    setEditVisible(true);
    setEditValue(row);
    form.setFieldsValue({ className: row.className });
  };

  const editClassify = async () => {
    let formVal = await form.validateFields();
    const params = {
      className: formVal.className,
      id: editValue.id,
      type: 'file',
    };
    setEditLoading(true);
    const res = await editClass(params);
    setEditLoading(false);

    if (res) {
      editClose();
      pageChange(page);
    }
  };

  const editClose = () => {
    setEditVisible(false);
    setEditValue({});
  };

  const deleteClassify = async (row: any) => {
    const params = {
      id: row.id,
    };
    const res = await deleteClass(params);
    if (res) {
      search();
      if (row.id === active) {
        await setActive('all');
        tableRef?.current?.reload();
      }
    }
  };

  const change = async (id: any) => {
    await setActive(id);
    tableRef?.current?.reloadAndRest();
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef?.current?.focus();
    }
  }, [inputVisible]);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <div className={style['video-classify']}>
      <div className={style['header']}>
        <span>文件分类</span>
        <div className={style['searchClassify']}>
          <Input
            placeholder="请输入"
            value={searchVal}
            onChange={(v) => setSearchVal(v.target.value)}
            size="small"
            style={{ marginRight: 5 }}
          />
          <Button type="primary" size="small" onClick={search}>
            搜索
          </Button>
        </div>
        <div style={{ height: 30 }}>
          {inputVisible ? (
            <Input
              ref={inputRef}
              onBlur={addClassify}
              value={addVal}
              onChange={(v) => setAddVal(v.target.value)}
              maxLength={15}
              showCount
              placeholder="请输入"
              style={{ marginRight: 5 }}
            />
          ) : (
            <Button block size="small" onClick={() => setInputVisible(true)}>
              + 新增文件分类
            </Button>
          )}
        </div>
      </div>
      <div style={{ width: '100%', padding: '15px 5px 10px 5px', textAlign: 'center' }}>
        <Tag
          style={{
            width: '100%',
            marginBottom: 8,
            borderRadius: 5,
          }}
          color={active === 'all' ? 'blue' : ''}
          onClick={() => change('all')}
        >
          <div style={{ padding: '3px 0px' }}>全部</div>
        </Tag>
        {list.map((row: any) => (
          <Tag
            key={row.id}
            style={{
              width: '100%',
              marginBottom: 8,
              borderRadius: 5,
            }}
            color={active === row.id ? 'blue' : ''}
            title={row.className}
            onClick={() => change(row.id)}
          >
            <div style={{ padding: '3px 0px', position: 'relative' }}>
              <div className={style['tagText']}>{row.className}</div>
              <div className={style['tagOperation']}>
                <EditOutlined
                  className={style['el-icon-edit']}
                  onClick={(event) => {
                    event.stopPropagation();
                    showEditModal(row);
                  }}
                />
                {` | `}
                <Popconfirm
                  title="是否确定删除"
                  onConfirm={(event) => {
                    event.stopPropagation();
                    deleteClassify(row);
                  }}
                >
                  <DeleteOutlined
                    className={style['el-icon-delete']}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  />
                </Popconfirm>
              </div>
            </div>
          </Tag>
        ))}
      </div>
      <div style={{ width: '100%', padding: '0 5px', textAlign: 'center' }}>
        <Pagination current={page} size="small" total={total} onChange={pageChange} />
      </div>
      <Modal
        title="编辑文件分类"
        width={572}
        centered
        onCancel={editClose}
        visible={editVisible}
        footer={
          <Space>
            <Button onClick={editClose} loading={editLoading}>
              取消
            </Button>
            <Button type="primary" onClick={editClassify} loading={editLoading}>
              确定
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Form form={form} {...layout}>
          <Form.Item
            label="名称"
            name="className"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input maxLength={15} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
