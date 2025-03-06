import React, { useState, useEffect, useImperativeHandle } from "react";
import { Button, Modal, Spin, Progress, Tag, Table } from 'antd';

const PieProgress = (props: any) => {
  const { percent, score } = props;
  return (
    <Progress
      strokeColor={'#1890FF'}
      type="circle"
      width={160}
      percent={percent}
      format={(per: any) => {
        return (
          <div className="score-box" style={{
            display: 'flex',
            flex: '1 0 auto',
            'flexDirection': 'column',
            'alignItems': 'center'
          }}>
            <span style={{ fontSize: '40px', color: '#000' }}>{percent}</span>
            <div>
              {percent >= score ? <Tag color="success">合格</Tag> : <Tag color="error">不合格</Tag>}
            </div>
            <p style={{ color: "#00000073", fontSize: 12, marginTop: 10 }}>合格分数：{score}</p>
          </div>
        );
      }}
    ></Progress>
  )
}

export default PieProgress;
