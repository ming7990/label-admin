import React, { useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react';
import { KnowledgeType } from '@/type/knowledge';
import Condition from '@/components/Condition';
import { Divider, Button, message, Spin, Space } from 'antd';
import { DownloadOutlined, LikeOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useContentModel } from '../../model';
import PreviewModal from '../../components/modal/previewModal';
import style from './content.less';
import { history } from 'umi';

const ContentDetail: React.FC<any> = (props: any) => {
  const { id, goBack, cref } = props;
  const { loading, content = {}, files = [], getContent, setContent, knowledgeLike, download, getPreviewUrl, setFiles } = useContentModel();
  const [mediaUrl, setUrl] = useState('');
  // const [flvPlayer, setFlvPlayer] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const videoElement = useRef(null);
  const flvPlayer = useRef<any>(null);
  const tid = useRef<any>(null);
  const previewCref = useRef();
  const query: any = history.location.query || {};
  useEffect(() => {
    console.log(id, 'id');
    getContent({ id: props.id, tab: query.tab ? +query.tab : 1 });
  }, [props.id]);

  useEffect(() => {
    if (content.knowledgeType === KnowledgeType.Video && files.length) {
      onPlayVideo(files[0], 0, false);
    }
  }, [files]);
  useEffect(() => {
    return () => {
      destroyVideo();
    }
  }, []);

  const destroyVideo = () => {
    console.log(flvPlayer, 'flvPlayer--');
    if (flvPlayer.current != null) {
      console.log('-- destroyVideo --');
      try {
        // setFlvPlayer(null);
        // flvPlayer.current.off();
        // flvPlayer.current.off('statistics_info');
        flvPlayer.current.unload();
        flvPlayer.current.detachMediaElement();
        flvPlayer.current.destroy();
        flvPlayer.current = null;
      } catch (error) {
        console.log(error, 'destroyVideo fail');
      }
    }
  };

  // 重命名后 更新;
  const setName = (knowledgeName: string) => {
    setContent({ ...content, knowledgeName });
  };
  useImperativeHandle(cref, () => ({
    setName,
  }));

  const onLike = () => {
    knowledgeLike({ knowledgeId: props.id, type: content.isLike ? 'cancel' : 'like', id: content.likeId }).then(res => {
      if (res) {
        const o = { ...content };
        const { likeCount, isLike } = o;
        o.likeCount = likeCount + (isLike ? -1 : 1);
        o.isLike = !o.isLike;
        o.likeId = res.data?.likeId;
        setContent(o);
      }
    });
  };
  const onPlay = ({ fileName, fileNumber }: any) => {
    const url = getPreviewUrl({ fileNumber, knowledgeId: props.id });
    setUrl(url);
    const dom = document.querySelector('#audioDom');
    if (dom) {
      setTimeout(() => {
        dom?.pause();
        dom?.play();
      }, 200);
    }
  };
  const onDownLoad = (fileNumber: any, url?: string) => {
    download({ knowledgeId: props.id, fileNumber });
  };
  const onDownLoadVideo = async (item: any) => {
    const list: string[] = item.urlList;
    let flag: boolean = false;
    for (var i = 0; i < list.length; i++) {
      const res: boolean = await new Promise(function (resolve, reject) {
        var dom = document.createElement('link');
        dom.href = list[i++];
        dom.rel = 'stylesheet';
        document.head.appendChild(dom);
        const id = setTimeout(function () {
          document.head.removeChild(dom);
          resolve(true);
        }, 1000);
        dom.onerror = function (e) {
          id && clearTimeout(id);
          document.head.removeChild(dom);
          resolve(false);
        }
      });
      if (res) {
        flag = res;
        break;
      }
    }
    console.log(i, 'i', flag);
    let url = list[0];
    if (flag) url = list[i - 1];
    window.open(url, '_blank');
  }

  // 图片预览;
  const onPreviewImg = (url: string) => {
    previewCref?.current?.open(url);
  };
  // 预览;
  const onPreview = ({ fileName, fileNumber }: any) => {
    const url = getPreviewUrl({ fileNumber, knowledgeId: props.id });
    const dotIndex = fileName.lastIndexOf('.');
    const type = (fileName.slice(dotIndex + 1) || '').toLowerCase();
    if (['docx', 'xlsx', 'pdf'].includes(type)) {
      previewCref?.current?.open(url, type);
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
      onPreviewImg(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const onPlayVideo = (item: any, index: number, play: boolean = true) => {
    const list: any[] = typeof item.urlList === 'string' ? [item.urlList] : item.urlList
    if (flvjs.isSupported()) {
      let i = 0;
      const fn = function () {
        destroyVideo();
        const url = list[i++] || '';
        setUrl(url);
        if (videoElement.current) {
          flvPlayer.current = flvjs.createPlayer({
            type: 'flv',
            isLive: false,
            hasVideo: true,
            url
          });
          flvPlayer.current.attachMediaElement(videoElement.current);
          flvPlayer.current.load();
          play && flvPlayer.current.play();
          flvPlayer.current.on('error', (e) => {
            console.log('error', e);
            flvPlayer.current.destroy();
            i < list.length && fn();
          });
          tid.current && clearTimeout(tid.current);
          flvPlayer.current.on('statistics_info', function (res: any) {
            setSpeed(Math.floor(res?.speed || 0));
            tid.current && clearTimeout(tid.current);
            tid.current = setTimeout(() => {
              setSpeed(0);
            }, 2000);
          });
          const _files = [...files];
          _files.forEach((item: any, i: number) => {
            if (i === index) item.playing = true;
            else
              item.playing = false;
          });
          // setFiles(_files);
          // flvPlayer.current = flvPlayer;
        }
      };
      fn();
    }
  };
  return (
    <div className={style['content-detail-box']}>
      <Spin spinning={loading}>
        <div className={style['title-infor']}>
          <h3>{goBack ? <ArrowLeftOutlined style={{ fontSize: 24 }} onClick={goBack} /> : null} {content.knowledgeName}</h3>
          <div className={style['u-infor']}>{content.creator}<Divider type="vertical" />{content.releaseTime}</div>
        </div>
        <div className={style['text-infor']}>{content.knowledge}</div>
        <div className="resource-box">
          <Condition r-if={content.knowledgeType === KnowledgeType.Pic}>
            <div className="pic-type">
              <div className={style['pic-list']}>
                {
                  files.map((item: any, i: number) => (
                    <div className={style['pic-box']} key={i}>
                      <div className={style['img-padding']}>
                        <div className={style['img-box']} style={{ cursor: 'pointer' }} onClick={() => onPreviewImg(item.url)}>
                          <img src={item.url} />
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className={style['file-list']}>
                <div className={style['tle']}>文件列表</div>
                <ul className={style['file-ul']}>
                  {
                    files.map((item: any, i: number) => (
                      <li className={style['file-name']} key={i}>
                        <div className={style['name']}><p>{item.fileName}</p></div>
                        <p className={style['size']}>{item.storage}</p>
                        <a onClick={() => onDownLoad(item.fileNumber, item.url)} className={style['btn']}><DownloadOutlined />下载</a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </Condition>
          {/* 文档 */}
          <Condition r-if={content.knowledgeType === KnowledgeType.Doc}>
            <div className="doc-type">
              <div className={style['file-list']}>
                <div className={style['tle']}>文件列表</div>
                <ul className={style['file-ul']}>
                  {
                    files.map((item: any, i: number) => (
                      <li className={style['file-name']} key={i}>
                        <div className={style['name']}><p>{item.fileName}</p></div>
                        <p className={style['size']}>{item.storage}</p>
                        <div onClick={() => onPreview(item)} className={style['btn']} style={{ marginRight: 15 }}><EyeOutlined />预览</div>
                        <a onClick={() => onDownLoad(item.fileNumber)} className={style['btn']}><DownloadOutlined />下载</a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </Condition>
          {/* 音频 */}
          <Condition r-if={content.knowledgeType === KnowledgeType.Audio}>
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
          {/* 视频频 */}
          <Condition r-if={content.knowledgeType === KnowledgeType.Video}>
            <div className="audio-type">
              <div className={style['audio-box']}>
                <div className={style['video-play']}>
                  <video width="100%" ref={videoElement} controls muted></video>
                  <p>当前加载速度：<span>{speed}</span>kb/s</p>
                </div>
                <div className={`${style['file-list']} ${style['audio-list']}`}>
                  <div className={style['tle']}>文件列表</div>
                  <ul className={style['file-ul']}>
                    {
                      files.map((item: any, i: number) => (
                        <li className={`${style['file-name']} ${item.playing ? style.playing : ''}`} key={i}>
                          <div className={style['name']} onClick={() => onPlayVideo(item, i)}><p>{item.fileName}</p></div>
                          <div className={style['infor']}>
                            <p style={{ flex: 1 }}>{item.storage}</p>
                            <a onClick={() => onDownLoadVideo(item)} className={style['btn']}><DownloadOutlined />下载</a>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </Condition>
          {/* 点赞 */}
          <div className={style['like-box']}>
            <div className={`${style['like-btn']} ${content.isLike && style['liked']}`} onClick={onLike}>
              <LikeOutlined className={style.icon} />
            </div>
            <p className={style['like-nums']}>{content.likeCount}人点赞</p>
            <Divider style={{ fontSize: 12, color: "#00000040" }}>真诚点赞，手留余香</Divider>
          </div>
        </div>
      </Spin>
      <PreviewModal cref={previewCref} />
    </div >
  )
};
export default ContentDetail;
