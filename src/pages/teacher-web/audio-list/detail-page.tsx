import React, { useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react';
import Condition from '@/components/Condition';
import { Divider, Button, message, Spin, Space } from 'antd';
import { DownloadOutlined, LikeOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import style from './content.less';
import { history } from 'umi';
import { downLoadFile, downLoadFile2, getKnowledgeFiles } from '../knowledge-base-manage/model/api';

const ContentDetail: React.FC<any> = (props: any) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const [files, setFiles] = useState<any>([]);
  const query: any = history.location.query || {};
  useEffect(() => {
    getFiles({ id: query.id, tab: query.tab ? + query.tab : 1 })
  }, [query.id]);

  const goBack = () => {
    // 回到数据管理列表页面
    history.goBack();
  };

  const download = async (params: any) => {
    const res = await downLoadFile(params);
    console.log(res);
  }

  // 获取文件列表;
  const getFiles = (params: any) => {
    getKnowledgeFiles(params).then((res: any) => {
      const list = res?.data || [];
      setFiles(list);
    });
  }

  const onPlay = ({ fileName, fileNumber }: any) => {
    const url = downLoadFile2({ fileNumber, knowledgeId: query.id });
    setMediaUrl(url);
    const dom = document.querySelector('#audioDom');
    if (dom) {
      setTimeout(() => {
        dom?.pause();
        dom?.play();
      }, 200);
    }
  };
  const onDownLoad = (fileNumber: any, url?: string) => {
    download({ knowledgeId: query.id, fileNumber });
  };

  return (
    <div className={style['content-detail-box']} style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '5px' }}>
      <Spin spinning={loading}>
        <div className={style['title-infor']}>
          <h3>{goBack ? <ArrowLeftOutlined style={{ fontSize: 24 }} onClick={goBack} /> : null} {query.title}</h3>
        </div>
        <div className={style['text-infor']}>{query.content}</div>
        <div className="resource-box">
          {/* 音频 */}
          <Condition r-if={true}>
            <div className="audio-type">
              <div className={style['audio-box']}>
                <div className={style['audio-play']}>
                  <audio id="audioDom" src={mediaUrl} controls ></audio>
                </div>
                <div className={`${style['file-list']} ${style['audio-list']}`}>
                  <div className={style['tle']}>文件列表</div>
                  <ul className={style['file-ul']}>
                    {
                      files.map((item: any, i: number) => (
                        <li className={style['file-name']} key={i}>
                          <div className={style['name']} onClick={() => onPlay(item)}><p>{item.fileName}</p></div>
                          <div className={style['infor']}>
                            <p style={{ flex: 1 }}>{item.storage}</p>
                            <a onClick={() => onDownLoad(item.fileNumber)} className={style['btn']}><DownloadOutlined />下载</a>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </Condition>
        </div>
        <div className={style['u-infor']}>{query.creator}<Divider type="vertical" />{query.createTime}</div>
      </Spin>
    </div >
  )
};
export default ContentDetail;
