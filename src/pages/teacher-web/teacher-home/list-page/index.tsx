import React, { useEffect, useState, useImperativeHandle } from 'react';
import style from './style.less';
import { Tag, Empty } from 'antd';
import { Link, history } from 'umi';
import coursePic from '@/asset/image/course-pic.png';
import Process from '../component/process';

import { formatePercent } from '@/utils';

const ListPage: React.FC<any> = (props: any) => {
  const { courselist, loading } = props;

  return (
    <div className={style['page-context_bg']}>
      {courselist.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {courselist.map((item: any, index: number) => {
            const {
              taskType,
              taskName,
              completeRate,
              taskUserCount,
              timesAvg,
              completeCount,
              scoreAvg,
            } = item;
            let tagType = null;
            let firstInfoName = '';
            if (taskType === 1) {
              tagType = (
                <Tag color="blue" style={{ borderRadius: '2px' }}>
                  培训课程
                </Tag>
              );
              firstInfoName = '培训人数';
            }
            if (taskType === 2) {
              tagType = (
                <Tag color={'orange'} style={{ borderRadius: '2px' }}>
                  考试课程
                </Tag>
              );
              firstInfoName = '考试人数';
            }
            return (
              <div className={style['card-container']} key={index}>
                <div className={style['top-container']}>
                  <img src={coursePic} className={style['icon']} />
                  <div className={style['top-rightContainer']}>
                    <div className={style['title-container']}>
                      <span className={style['task-title']}>{taskName}</span>
                      <div style={{ marginLeft: '8px' }}>{tagType}</div>
                    </div>
                    <div className={style['process-container']}>
                      <div className={style['process-bar']}>
                        <Process percent={completeRate} />
                      </div>
                      <div className={style['process-text']}>
                        完成进度：{formatePercent(item.completeRate)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style['bottom-container']}>
                  <div className={style['counter-info-container']}>
                    <div className={style['counter-info-l-text']}>{firstInfoName}</div>
                    <div className={style['counter-info-r-text']}>{taskUserCount}</div>
                  </div>
                  <div className={style['counter-info-container']}>
                    <div className={style['counter-info-l-text']}>人均训练次数</div>
                    <div className={style['counter-info-r-text']}>{timesAvg}</div>
                  </div>
                  <div className={style['counter-info-container']}>
                    <div className={style['counter-info-l-text']}>完成人数</div>
                    <div className={style['counter-info-r-text']}>{completeCount}</div>
                  </div>
                  <div className={style['counter-info-container']}>
                    <div className={style['counter-info-l-text']}>平均分</div>
                    <div className={style['counter-info-r-text']}>{scoreAvg}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!courselist?.length && (
        <Empty
          style={{
            height: '650px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      {/* <Condition r-if={!loading && courselist.length === 0}>
        <div className={style['page-error']}>
          <img src={coursePic} className={style['course-pic']} />
          <div style={{ marginTop: '18px' }}>暂无数据</div>
        </div>
      </Condition> */}
    </div>
  );
};
export default ListPage;
