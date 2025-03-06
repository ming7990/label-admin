import Condition from '@/components/Condition';
import config from '@/config';
import { QuestionTypeList, questionTypeText } from '@/type/question';
import { handleKeyPress, validateSpaces } from '@/utils';
import { Modal, Input, Table, Switch, Form, InputNumber, Checkbox, Select, message } from 'antd';
import { useEffect, useImperativeHandle, useState } from 'react';

const ScoreComponent: React.FC<any> = (props: any) => {
  const { cref, courseId, questionTypeList, setQuestionTypeList, setScore } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const open = () => {
    setVisible(true);
    getTotal(questionTypeList);
  }
  const onCancel = () => {
    setVisible(false);
  }
  const onOk = async () => {
    if (total == 100) {
      const list: any = [];
      questionTypeList.forEach((item: any) => {
        list.push({
          score: item.score,
          courseId,
          questionType: item.questionType
        })
      })
      const res = await setScore(list);
      if (res) setVisible(false);
    } else message.warn('总分合计需要等于100');
  }

  useImperativeHandle(cref, () => ({
    open,
  }));

  const getTotal = (list: any = []) => {
    let total = 0;
    list.forEach(item => {
      if (item.score) {
        total += item.score;
      }
    })
    setTotal(total);
  }
  const changInput = (v: string, index: number) => {
    const newData = [...questionTypeList];
    newData[index].score = v;
    setQuestionTypeList(newData);
    getTotal(newData);
  }
  const columns: any = [
    {
      title: '题目顺序',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (val: any, row: any, index: number) => {
        return index + 1;
      }
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      key: 'questionType',
      render: (val: any, row: any, index: number) => {
        return questionTypeText[val]
      },
      width: 90,
    },
    {
      title: '总分',
      dataIndex: 'score',
      key: 'score',
      width: 150,
      render: (val: any, row: any, index: number) => {
        return (
          <InputNumber
            style={{ width: 140 }}
            value={val}
            min={0}
            max={100}
            onChange={(v) => changInput(v, index)}
            placeholder='请输入总分'
          ></InputNumber>
        )
      }
    },
    {
      title: '题量',
      dataIndex: 'num',
      key: 'num',
      width: 80,
    },
    {
      title: '平均单题分数',
      dataIndex: 'average',
      key: 'average',
      render: (val: any, row: any, index: number) => {
        if (row.score) return (row.score / row.num).toFixed(1);
        return 0;
      }
    },
  ];

  return (
    <Modal
      width={600}
      title="分数设置"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Table
        size="middle"
        columns={columns}
        rowKey={'id'}
        dataSource={questionTypeList}
        pagination={false}
        summary={(data) => {
          let num = 0;
          data.forEach(item => {
            num += item.num;
          })
          return (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell key={0} index={0}>合计</Table.Summary.Cell>
                <Table.Summary.Cell key={1} index={1}>-</Table.Summary.Cell>
                <Table.Summary.Cell key={2} index={2}>{total}</Table.Summary.Cell>
                <Table.Summary.Cell key={3} index={3}>{num}</Table.Summary.Cell>
                <Table.Summary.Cell key={4} index={4}>-</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
        footer={() => '*总分合计需要等于100。'}
      ></Table>
    </Modal>
  )
}

export default ScoreComponent;
