import Condition from '@/components/Condition';
import config from '@/config';
import { QuestionType, QuestionTypeList, QuestionIndex, letter_index } from '@/type/question';
import { handleKeyPress, validateSpaces } from '@/utils';
import { Button, Modal, Input, Radio, Space, Switch, Form, InputNumber, Checkbox, Select, message } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTableModel } from '../../model';


// 字符串char部分出现第n次的位置;
const findStrPos = function (str: string, char: string, n: number) {
  let x = str.indexOf(char);
  if (n === 1) return x;
  for (let i = 1; i < n; i += 1) {
    x = str.indexOf(char, x + 1);
  }
  return x;
}

const ModelComponent: React.FC<any> = (props: any) => {
  const {
    questionInsert,
    qualityQuestionDetail,
    questionUpdate,
    editQualityQuestion,
  } = useTableModel();

  const { courseId = '', cref, reload } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<string>('add');
  const [id, setId] = useState<string>('');
  const [maxQuestionNumberMap, setMaxQuestionNumber] = useState<any>({});
  const [tableInfo, setTableInfo] = useState<any>({
    optionList: [
      { option: '', order: 'A', answer: false, /* 是否为答案;*/ },
      { option: '', order: 'B', answer: false, /* 是否为答案;*/ },
      { option: '', order: 'C', answer: false, /* 是否为答案;*/ },
      { option: '', order: 'D', answer: false, /* 是否为答案;*/ },
    ]
  });
  const [form] = Form.useForm();
  const questionType = Form.useWatch('questionType', form);
  const optionList = Form.useWatch('optionList', form) || [];
  const pointList = Form.useWatch('pointList', form) || [];
  console.log('optionList', optionList);
  const { questionNumber } = useTableModel();
  /* 布局 */
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const formItemLayout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 22, offset: 0 },
      sm: { span: 16, offset: 6 },
    },
  };
  const fillZero = (str: any = '') => {
    let strNum = str.slice(1);
    if (strNum.length < 3) {
      strNum = '0'.repeat(3 - strNum.length) + strNum;
    }
    return strNum;
  }
  /* 切换select */
  const onChange = (v: any) => {
    let optionList = ['正确', '错误'];
    let pointList: any = [];
    if ([QuestionType.Radio, QuestionType.Multi].includes(v)) {
      optionList = ['', '', '', ''];
    }
    if ([QuestionType.Fill].includes(v)) {
      optionList = [];
      const { question = '' } = form.getFieldsValue();
      console.log(question);
      const arr = question.match(/（）/g);
      if (arr) arr.forEach(() => optionList.push(''));
    }
    if ([QuestionType.ShortAnswer, QuestionType.Essay].includes(v)) {
      optionList = [''];
    }
    form.setFieldsValue({
      optionList, pointList
    });

    if (maxQuestionNumberMap[v]) {
      form.setFieldsValue({
        questionNumber: maxQuestionNumberMap[v]
      });
    } else {
      questionNumber({ questionType: v, courseId }).then(res => {
        const { questionNumber } = res.data || {};
        const o = {
          ...maxQuestionNumberMap,
          [v]: fillZero(questionNumber)
        };
        setMaxQuestionNumber(o);
        form.setFieldsValue({
          questionNumber: o[v]
        });
        console.log('maxQuestionNumberMap', o);
      });
    }
  }
  /* 题目 */
  const questionChange = (e: any) => {
    const question: string = e.target.value;
    if (questionType === QuestionType.Fill) {
      const arr = question.match(/（）/g);
      const oldOpt = form.getFieldsValue().optionList || [];
      let optionList: any = [];
      if (arr) {
        optionList = [];
        arr.forEach(() => optionList.push(''));
        oldOpt.forEach((txt: string, i: number) => {
          optionList[i] = txt;
        });
      }
      form.setFieldsValue({
        optionList
      });
    }
  };
  const open = async (type: string, row: any) => {
    setMaxQuestionNumber({});
    setFormType(type);
    if (type == 'edit') {
      await qualityQuestionDetail({ id: row?.id }).then((res: any) => {
        setTableInfo(res?.data || row);
        const { id, question, questionType, questionNumber, optionList = [], similarity, keyPointList = [] } = res?.data || {};
        setId(id);
        const list: string[] = [];
        let answer: any = '';
        optionList.forEach((item: any, index: number) => {
          list.push(item.option);
        });
        if ([QuestionType.Radio, QuestionType.Judge].includes(questionType)) {
          optionList.forEach((item: any) => {
            if (item.answer) answer = item.order;
          });
        }
        if ([QuestionType.Multi].includes(questionType)) {
          answer = [];
          optionList.forEach((item: any) => {
            if (item.answer) answer.push(item.order);
          })
        }

        form.setFieldsValue({
          question,
          questionType,
          questionNumber, // 去掉前面的字母
          optionList: list,
          answer,
          similarity,
          pointList: keyPointList.map((item: any) => item.keyPoint)
        });
      });
    } else {
      form.resetFields();
    }
    setVisible(true);
  }
  const onCancel = () => {
    form.resetFields(); // 重置所有表单字段  
    setVisible(false);
  }
  const onOk = async () => {
    let valid = await form.validateFields();
    console.log(form.getFieldsValue());
    if (valid) {
      const { question, questionType, questionNumber, optionList = [], answer, similarity, pointList = [] } = form.getFieldsValue();
      if (QuestionType.Fill == questionType && !optionList.length) return message.error('请配置选项或填写项');
      const list: any = [];
      let answers = answer;
      if (!Array.isArray(answer)) answers = [answer];
      (questionType === QuestionType.Judge ? ['正确', '错误'] : optionList).forEach((txt: string, i: number) => {
        if ([QuestionType.Fill, QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)) {
          list.push({
            order: i, answer: true, option: txt
          });
        } else {
          const order = letter_index[i]; // answer: A|B|C...
          list.push({
            order, answer: answers.includes(order), option: txt
          });
        }
      })
      const keyPointList: Array<{ keyPoint: string, order: number }> = [];
      if ([QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)) {
        pointList.forEach((keyPoint: string, order: number) => {
          keyPointList.push({
            keyPoint, order
          });
        })
      }
      const params = {
        courseId,
        question,
        questionType, questionNumber: QuestionIndex[questionType] + questionNumber,
        optionList: list,
        similarity,
        keyPointList
      };
      if (formType == 'add') {
        // const res = await questionInsert(params);
        // if (res) {
        //   onCancel();
        //   reload();
        // }
      } else {
        const res = await editQualityQuestion({ id, ...params });
        if (res) {
          onCancel();
          reload();
        }
      }
    }
  }

  useImperativeHandle(cref, () => ({
    open,
  }));

  const onDelete = (index: number): any => {
    const list = [...optionList];
    let { answer } = form.getFieldsValue();
    if (questionType === QuestionType.Radio) {
      if (list.length <= 2) return message.warn('最少存在2个选项');
      if (answer === letter_index[index]) answer = '';
    } else if (questionType === QuestionType.Multi) {
      if (list.length <= 3) return message.warn('最少存在3个选项');
      const aIndex = answer.findIndex((a: string) => a === letter_index[index]);
      if (aIndex !== -1) answer.splice(aIndex, 1); // 删除答案
    } else if ([QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)) {
      if (list.length <= 1) return message.warn('最少存在1个答案');
    }
    form.setFieldsValue({ answer });
    list.splice(index, 1);

    if (questionType === QuestionType.Fill) {
      // 填空题;
      let { question = '' } = form.getFieldsValue();
      const pos = findStrPos(question, '（）', index + 1);
      console.log('第' + pos + '个');
      const before = question.substring(0, pos);
      const after = question.substring(pos).replace('（）', '');  // 删除括号;
      question = before + after;
      form.setFieldsValue({ question, optionList: list });
    } else {
      form.setFieldsValue({ optionList: list });
    }
  }
  const onDeletePoint = (index: number) => {
    const list = [...pointList];
    list.splice(index, 1);
    form.setFieldsValue({ pointList: list });
  }
  const onAdd = () => {
    const list = [...optionList];
    list.push('');
    form.setFieldsValue({ optionList: list });
  }
  // 关键点
  const onAddPoint = () => {
    const list = [...pointList];
    list.push('');
    form.setFieldsValue({ pointList: list });
    console.log(list);
  }
  /* 校验; */
  const numberValidator = (rule, value: any, callback) => {
    console.log(value);
    if (!value) return Promise.reject(new Error('请输入题目序号'));
    if (!/^\d+$/.test(value)) return Promise.reject(new Error('请输入数字'));
    if (value.length !== 3 || value < 1 || value > 999) return Promise.reject(new Error('请输入001-999范围的数字'));
    callback();
  }
  const answerValidator = (rule, value: any, callback) => {
    if (!value) return Promise.reject(new Error('请选择答案'));
    if (questionType === QuestionType.Radio) {
      if (!value) return Promise.reject(new Error('请选择答案'));
    } else {
      if (Array.isArray(value) && value.length < 2) return Promise.reject(new Error('至少选两个'));
    }
    callback();
  }

  return (
    <Modal
      bodyStyle={{ maxHeight: '450px', overflow: 'auto' }}
      width={650}
      title={formType == 'add' ? '新建题目' : '编辑题目'}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="horizontal" {...formItemLayout}>
        <Form.Item
          label={'知识点名称'}
          name={'knowledgePoints'}
        >
          <Input
            style={{ width: '100%' }}
            placeholder={'请输入知识点名称'}
          />
        </Form.Item>
        <Form.Item
          label={'试题难易等级'}
          name={'dell'}
        >
          <Input
            style={{ width: '100%' }}
            placeholder={'请输入试题难易等级'}
          />
        </Form.Item>
        <Form.Item
          name="questionType"
          label="题型"
          rules={[{ required: true, message: '请选择题型' }]}
        >
          <Select
            placeholder="请选择题型"
            disabled={formType == 'edit'}
            onChange={onChange}
          >
            {QuestionTypeList?.map((item: any) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Condition r-if={questionType !== undefined}>
          <Form.Item
            label={'题目序号'}
            name={'questionNumber'}
            initialValue={'001'}
            rules={[{ required: true, validator: numberValidator }]}
          >
            <Input
              disabled={false}
              precision={0}
              controls={false}
              style={{ width: '185px' }}
              maxLength={3}
              placeholder={'请输入1-999整数'}
              addonBefore={QuestionIndex[questionType]}
            />
          </Form.Item>
        </Condition>
        <Condition r-if={[QuestionType.Radio, QuestionType.Multi, QuestionType.Judge, QuestionType.Fill, QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)}>
          <Form.Item name="question" label="题干" rules={[{ required: true, message: '请输入题目内容' }]}>
            <Input.TextArea onChange={questionChange} rows={2} showCount maxLength={500} placeholder="请输入题目内容" />
          </Form.Item>
        </Condition>
        <Condition r-if={[QuestionType.Radio, QuestionType.Multi].includes(questionType)}>
          <div style={{ position: 'relative' }}>
            <Form.Item name="answer" label="答案" rules={[{ required: true, validator: answerValidator }]}>
              {
                questionType === QuestionType.Multi ?
                  <Checkbox.Group disabled={false}>
                    <Space direction="vertical" size="large">
                      {
                        optionList.map((item: any, i: number) => (
                          <Checkbox key={letter_index[i]} value={letter_index[i]}>{letter_index[i]}:</Checkbox>
                        ))
                      }
                    </Space>
                  </Checkbox.Group> :
                  <Radio.Group disabled={false}>
                    <Space direction="vertical" size="large">
                      {
                        optionList.map((item: any, i: number) => (
                          <Radio key={letter_index[i]} value={letter_index[i]}>{letter_index[i]}:</Radio>
                        ))
                      }
                    </Space>
                  </Radio.Group>
              }
            </Form.Item>
            <Form.Item label="" {...formItemLayoutWithOutLabel}>
              <Button style={{ marginTop: 12 }} type="dashed" onClick={onAdd} block icon={<PlusOutlined />}>添加选项</Button>
            </Form.Item>
            <div style={{ position: 'absolute', top: 0, left: 200 }} className="def-form-item">
              <Form.List name="optionList">
                {(fields) =>
                  fields.map((field, index) => (
                    <div style={{}} key={index}>
                      <Form.Item rules={[{ required: true, message: '' }]} {...field} {...formItemLayout2} style={{ display: 'inline-block', marginBottom: 12 }}>
                        <Input style={{ width: 310 }} />
                      </Form.Item>
                      <DeleteOutlined
                        onClick={() => onDelete(index)}
                        style={{
                          color: 'rgba(0,0,0,0.45)', marginLeft: 2
                        }}
                      />
                    </div>
                  ))
                }
              </Form.List>
            </div>
          </div>
        </Condition>
        {/* 判断题 */}
        <Condition r-if={[QuestionType.Judge].includes(questionType)}>
          <Form.Item name="answer" label="答案" rules={[{ required: true, message: '请选择答案' }]}>
            <Radio.Group>
              <Radio value={'A'}>正确</Radio>
              <Radio value={'B'}>错误</Radio>
            </Radio.Group>
          </Form.Item>
        </Condition>
        {/* 简答、论述 */}
        <Condition r-if={[QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)}>
          <Form.Item name="similarity" initialValue={80} label="相似度标准" rules={[{ required: true, message: '请输入相似度标准' }]}>
            <InputNumber
              precision={0}
              controls={false}
              style={{ width: '185px' }}
              min={1}
              max={100}
              maxLength={3}
              placeholder={'请输入1-100整数'}
              addonAfter="%"
            />
          </Form.Item>
        </Condition>
        {/* 填空题 简答、论述 */}
        <Condition r-if={[QuestionType.Fill, QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)}>
          <Form.List name="optionList">
            {(fields) =>
              fields.map((field, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <span style={{ position: "absolute", left: "24%" }}>{index + 1}.</span>
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? "答案" : ""}
                    rules={[{ required: true, message: '' }]} {...field}
                  >
                    <Input.TextArea style={{ maxWidth: "92%", margin: "0 4%" }} rows={2} maxLength={500} placeholder="请输入内容" />
                  </Form.Item>
                  <DeleteOutlined
                    onClick={() => onDelete(index)}
                    style={{
                      color: 'rgba(0,0,0,0.45)', position: "absolute", right: "8%", top: 5
                    }}
                  />
                </div>
              ))
            }
          </Form.List>
        </Condition>
        <Condition r-if={[QuestionType.ShortAnswer, QuestionType.Essay].includes(questionType)}>
          <Form.Item label="" {...formItemLayoutWithOutLabel} style={{ marginBottom: 12 }}>
            <Button type="dashed" onClick={onAdd} block icon={<PlusOutlined />}>添加答案</Button>
          </Form.Item>
          {/* 关键点 */}
          <Form.List name="pointList">
            {(fields) =>
              fields.map((field, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <span style={{ position: "absolute", left: "24%" }}>{index + 1}.</span>
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? "答案关键点" : ""}
                    rules={[{ required: true, message: '' }]} {...field}
                  >
                    <Input style={{ maxWidth: "92%", margin: "0 4%" }} maxLength={500} placeholder="请输入答案关键点，可使用,号分割，添加多个关键词" />
                  </Form.Item>
                  <DeleteOutlined
                    onClick={() => onDeletePoint(index)}
                    style={{
                      color: 'rgba(0,0,0,0.45)', position: "absolute", right: "8%", top: 5
                    }}
                  />
                </div>
              ))
            }
          </Form.List>
          <Form.Item {...(pointList.length === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={pointList.length === 0 ? "答案关键点" : ""} style={{ marginBottom: 12 }}>
            <Button type="dashed" onClick={onAddPoint} block icon={<PlusOutlined />}>添加答案关键点</Button>
          </Form.Item>
        </Condition>
      </Form>
    </Modal >
  )
}

export default ModelComponent;
