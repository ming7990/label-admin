import { Descriptions } from 'antd';
import { Fragment } from 'react';
import styles from './index.less';

export default (props: any) => {
  const { disCountList } = props;
  return (
    <Fragment>
      {disCountList?.map((item: any, index: any) => {
        return (
          <div key={index}>
            <div className={styles.title_box}>
              <div className={styles.sortNum}>{index + 1}</div>
              <div>扣分点</div>
            </div>
            <Descriptions column={2} layout="vertical" bordered>
              <Descriptions.Item label="扣分项目">{item?.deductModel}</Descriptions.Item>
              <Descriptions.Item label="扣分">{item?.deductScore}</Descriptions.Item>
              <Descriptions.Item label="扣分点" span={2}>
                {item?.deductPoint}
              </Descriptions.Item>
            </Descriptions>
          </div>
        );
      })}
    </Fragment>
  );
};
