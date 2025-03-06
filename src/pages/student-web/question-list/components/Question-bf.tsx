import React, { useState } from "react";
import { Form, Radio, Button, Popconfirm, Select, Input } from 'antd';
import style from '../style.less';

const Question = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "What is the largest country in the world?",
      options: ["Russia", "China", "USA", "India"],
      answer: "Russia",
    },
    {
      question: "What is the currency of Japan?",
      options: ["Yen", "Dollar", "Euro", "Pound"],
      answer: "Yen",
    },
  ];
  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };
  const [form] = Form.useForm();
  return (
    <div className={style["question-container"]}>
      <Form form={form} layout="vertical">
        <div className={style["question-box"]}>
          <div className={style["question-block"]}>
            <p className={style["qtle"]}>一、单选题 <span>（每题5分，共计20分）</span></p>
            <section className={style["question-detail"]}>
              <div className={style["answer-index"]}>
                <div className={style["name"]}>1. 这是一段题目文本，这是一段题目文本，这是一段题目文本。</div>
                <div className={style["answer-list"]}>
                  <div className={`${style["answer-btn"]} ${style["selected"]}`}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                  <div className={style["answer-btn"]}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                </div>
              </div>
              <div className={style["answer-index"]}>
                <div className={style["name"]}>2. 这是一段题目文本，这是一段题目文本，这是一段题目文本。</div>
                <div className={style["answer-list"]}>
                  <div className={`${style["answer-btn"]} ${style["selected"]}`}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                  <div className={style["answer-btn"]}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                  <Radio.Group value={'name'}>
                    <Radio.Button value="vertical">
                      <div className={`${style["answer-btn"]} ${style["selected"]}`}>
                        <a href="javascript:void(0);">A. 选项内容</a>
                      </div>
                    </Radio.Button>
                    <Radio.Button value="vertical">Vertical</Radio.Button>
                    <Radio.Button value="vertical">Inline</Radio.Button>
                  </Radio.Group>
                </div>

              </div>
            </section>
          </div>
          <div className={style["question-block"]}>
            <p className={style["qtle"]}>二、多选题 <span>（每题5分，共计20分）</span></p>
            <section className={style["question-detail"]}>
              <div className={style["answer-index"]}>
                <div className={style["name"]}>1. 这是一段题目文本，这是一段题目文本，这是一段题目文本。</div>
                <div className={style["answer-list"]}>
                  <div className={`${style["answer-btn"]} ${style["selected"]}`}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                  <div className={style["answer-btn"]}>
                    <a href="javascript:void(0);">A. 选项内容</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={style["question-block"]}>
            <p className={style["qtle"]}>四、填空题 <span>（每题5分，共计20分）</span></p>
            <section className={style["question-detail"]}>
              <div className={style["answer-index"]}>
                <div className={style["name"]}>1. 这是一段题目文本，这是一段题目文本，这是一段题目文本。</div>
                <div className={style["answer-list"]}>
                  <div className={`${style["input-area"]}`}>
                    <div className={style.index}>(1)：</div>
                    <div className={style.input}>
                      <Input placeholder="请输入" width={'100%'} />
                    </div>
                  </div>
                  <div className={`${style["input-area"]}`}>
                    <div className={style.index}>(1)：</div>
                    <div className={style.input}>
                      <Input placeholder="请输入" width={'100%'} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={style["question-block"]}>
            <p className={style["qtle"]}>五、简单题 <span>（每题5分，共计20分）</span></p>
            <section className={style["question-detail"]}>
              <div className={style["answer-index"]}>
                <div className={style["name"]}>1. 这是一段题目文本，这是一段题目文本，这是一段题目文本。</div>
                <div className={style["answer-list"]}>
                  <div className={`${style["input-area"]}`}>
                    <Input.TextArea cols={8} placeholder="请输入内容" width={'100%'} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default Question;