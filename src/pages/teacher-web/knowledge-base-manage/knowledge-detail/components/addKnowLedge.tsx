import Condition from '@/components/Condition';
import config from '@/config/index';
import { KnowledgeType, KnowledgeTypeList } from '@/type/knowledge';
import { Button, Modal, Input, Radio, Switch, Upload, Cascader, Form, message, Select } from 'antd';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import style from '../../style.less';
const { successCode } = config;
const allList = [KnowledgeType.Pic, KnowledgeType.Audio, KnowledgeType.Video, KnowledgeType.Doc];

const Add: React.FC<any> = (props: any) => {
  const { cref, getKgListAll, callback } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<any>('');
  const [knowledgeIds, setKnowledgeIds] = useState<any>([]);
  const [knowledgeType, setKnowledgeType] = useState<any>([...allList]);
  const [knowledgeList, setknowledgeList] = useState<any>([]);
  const onOk = () => {
    callback?.(knowledgeIds);
    setVisible(false);
    setKnowledgeIds([]);
  };

  const getData = (status = '', knowledgeType: any[] = [], isSelect?: boolean) => {
    // if (knowledgeType.includes('all')) {
    //   knowledgeType = allList;
    // }
    // if (isSelect) {
    //   const ar = knowledgeType.filter(key => key != 'all');
    //   if (ar.length === allList.length) {
    //     setKnowledgeType(['all', ...allList]);
    //   } else {
    //     setKnowledgeType([...knowledgeType]);
    //   }
    // }
    setLoading(true);
    setTimeout(() => {
      getKgListAll({ status, knowledgeTypeList: knowledgeType }).then((res: any) => {
        setknowledgeList(res?.data || []);
        setLoading(false);
      });
    }, 10);
  };
  const open = () => {
    setVisible(true);
    setKnowledgeIds([]);
    getData('', allList);
  }

  const statusList: any[] = [
    { value: '', label: '全部状态' },
    { value: 0, label: '已上架' },
    { value: 1, label: '已下架' },
  ];
  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Modal
      width={600}
      bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
      title="添加知识"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button
          disabled={knowledgeIds.length === 0}
          type="primary"
          onClick={async () => {
            onOk();
          }}>确定</Button>,
      ]}
    >
      <div className={style.addboxForm}>
        <div className={style.formLabel}>知识选择：</div>
        <div className={style.formRow}>
          <div className={style.formItem}>
            <Select
              allowClear
              value={status}
              style={{ width: 200 }}
              onChange={(value) => { setStatus(value); getData(value, knowledgeType); }}
            >
              {statusList?.map((item: any, index: any) => (
                <Select.Option key={index} value={item.value} item={item}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              mode='multiple'
              value={knowledgeType}
              onChange={(value) => { setKnowledgeType(value); getData(status, value, true); }}
              style={{ marginLeft: 10, width: 250 }}
            >
              {/* <Select.Option key={'all'} value={[]}>全部类型</Select.Option> */}
              {KnowledgeTypeList?.map((item: any, index: any) => (
                <Select.Option key={item.value} value={item.value} item={item}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={style.formItem} style={{ marginTop: 10 }}>
            <Select
              allowClear
              mode='multiple'
              value={knowledgeIds}
              onChange={(value) => setKnowledgeIds(value)}
              showSearch
              optionFilterProp="label"
              style={{ width: 460 }}
              loading={loading}
              filterOption={(input, option) => {
                console.log(input, option);
                return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }}
            >
              {knowledgeList?.map((item: any, index: any) => (
                <Select.Option key={item.id} value={item.id} item={item}>
                  {item.knowledgeName}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Modal >
  )
}

export default Add;
