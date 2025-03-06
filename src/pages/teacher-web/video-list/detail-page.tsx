import { useEffect, useRef, useState } from 'react';
import { Divider, Spin, message } from 'antd';
import { videoInfo, useAddOrEditModel } from './model';
import { DownloadOutlined, LikeOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import style from './style.less';
import { history, Link } from 'umi';

export default function () {
  const query = history?.location?.query || {};
  const pageSource =
    history?.location?.pathname === '/front/teacher/share-manage/video-detail'
      ? 'share'
      : undefined;

  const { taskId, nodeId, courseId, courseTitle } = query;
  const _studyId: any = query.studyId;
  const [loading, setLoading] = useState(false);
  const [isLimit, setIsLimit] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [videoName, setVideoName] = useState('');
  const videoUrl = useRef('');
  const goBack = () => {
    // 回到管理列表页面
    history.goBack();
  };

  const { info, getInfo, fetchInfo, submitInfo, createId } = videoInfo();
  const videoElement = useRef(null);
  const flvPlayer = useRef<any>(null);
  const isProgressLimit = useRef<boolean>(false); // 是否可拖动进度条;

  useEffect(() => {
    setLoading(true);
    let timeid: any = null;
    getInfo({ courseId, courseVideoId: query.id, pageSource }, (list: any) => {
      setLoading(false);
      setFiles(list);
    });
    return () => {
      destroyVideo();
    };
  }, []);

  const destroyVideo = () => {
    console.log(flvPlayer, 'flvPlayer--');
    if (flvPlayer.current != null) {
      console.log('-- destroyVideo --');
      try {
        flvPlayer.current.pause();
        flvPlayer.current.unload();
        flvPlayer.current.detachMediaElement();
        flvPlayer.current.destroy();
        flvPlayer.current = null;
      } catch (error) {
        console.log(error, 'destroyVideo fail');
      }
    }
  };

  const autoSubmit = (e: any, studyId: string | undefined, videoId: string) => {
    if (taskId && nodeId) {
      submitInfo({
        taskId,
        studyId,
        courseId,
        process: e.target.currentTime,
        taskNodeId: nodeId,
        titleId: info.id,
        videoId
      });
    }
  };

  const getPlayUrl = (item: any, index: number, play: boolean = true) => {
    const list: any[] = typeof item.urlList === 'string' ? [item.urlList] : item.urlList;
    if (flvjs.isSupported()) {
      let i = 0;
      const fn = function () {
        destroyVideo();
        const url = list[i++] || '';
        if (videoElement.current) {
          flvPlayer.current = flvjs.createPlayer({
            type: 'flv',
            isLive: false,
            hasVideo: true,
            url,
          });
          flvPlayer.current.attachMediaElement(videoElement.current);
          flvPlayer.current.load();
          play && flvPlayer.current.play();
          flvPlayer.current.on('error', (e) => {
            console.log('error', e);
            flvPlayer.current.destroy();
            i < list.length && fn();
          });

          const _files = [...files];
          _files.forEach((item: any, i: number) => {
            if (i === index) item.playing = true;
            else item.playing = false;
          });
          // setFiles(_files);
          // flvPlayer.current = flvPlayer;
        }
      };
      fn();
    }
  };

  const onPlayVideo = (item: any, index: number, play: boolean = true) => {
    getPlayUrl(item, index, play);
    setVideoName(item.fileName);
    // 如果不是查看的;
    if (taskId && nodeId && videoElement.current) {
      let studyId = _studyId;
      let isInit = false,
        currentTime = 0,
        apiTime = 0;
      videoElement.current?.addEventListener('timeupdate', (e: any) => {
        // 该事件会在视频播放开始时触发一次;
        console.log('timeupdate', e, e.target.currentTime);
        const { duration } = e.target;
        const now = e.target.currentTime;

        // 进度条控制;
        // const prg = (now / duration); // 播放进度;
        if (isProgressLimit.current && now - currentTime > 3) {
          // if ((currentTime / duration) < .9) {
          message.warn('不能拖动进度条');
          e.target.currentTime = currentTime;
          // }
        }
        currentTime = e.target.currentTime;

        if (currentTime - apiTime >= 10) {
          console.log(now, apiTime);
          apiTime = currentTime; // 调api的时间;
          autoSubmit(e, studyId, item.id);
        }

        if (currentTime / duration >= 0.9 && !isInit) {
          console.log('播放进度超过90%');
          isInit = true;
          autoSubmit(e, studyId, item.id);
        }
      });
      videoElement.current?.addEventListener('ended', (e) => {
        console.log('播放结束', e);
        // autoSubmit(e, studyId, item.id);
        if (videoElement.current) videoElement.current.currentTime = 0;
        setTimeout(() => {
          videoUrl.current && onPlayVideo(item, index, play);
        }, 10);
      });
    }

    // 获取视频限制;
    if (taskId && courseId) {
      fetchInfo({ taskId, courseId, titleId: info.id, videoId: item.id }, (res: any) => {
        isProgressLimit.current = !res.canMove;
        setIsLimit(!res.canMove);
      });
    }
  };

  return (
    <div className={style['content-detail-box']}>
      <Spin spinning={loading}>
        <div className={style['title-infor']}>
          <h3>
            {goBack ? <ArrowLeftOutlined style={{ fontSize: 24 }} onClick={goBack} /> : null}{' '}
            {pageSource === 'share' ? info.name : courseTitle}
          </h3>
          {pageSource === 'share' ? null : <>
            <div className="title" style={{ lineHeight: '16px', marginBottom: 10, 'white-space': 'normal', 'word-wrap': 'break-word' }}>
              {info.title}
            </div>
            <div className="content" style={{ lineHeight: '16px', marginBottom: 10, 'white-space': 'normal', 'word-wrap': 'break-word' }}>
              {info.content}
            </div>
          </>}
          <div className="audio-type">
            <div className={style['audio-box']}>
              <div className={`${style['video-play']} ${isLimit ? 'isLimit' : ''}`}>
                <video width="100%" ref={videoElement} controls muted></video>
              </div>
              <div className={`${style['file-list']} ${style['audio-list']}`}>
                <div className={style['tle']}>文件列表</div>
                <ul className={style['file-ul']}>
                  {files?.map((item: any, i: number) => (
                    <li
                      className={`${style['file-name']} ${item.playing ? style.playing : ''}`}
                      key={i}
                    >
                      <div className={style['name-infor']} onClick={() => onPlayVideo(item, i)}>
                        <p className={style['name']} style={{ flex: 1 }}>
                          {item.fileName}
                        </p>
                        <p>{item.storage}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={style['u-infor']}>
            {info.userName}
            <Divider type="vertical" />
            {info.createTime}
          </div>
        </div>
      </Spin>
    </div>
  );
}
