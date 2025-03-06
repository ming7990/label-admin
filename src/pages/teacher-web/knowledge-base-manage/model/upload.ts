// 视频上传
import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
// import SparkMD5 from '@/utils/spark-md5.min.js';
import {

} from './api';
//每片的大小 10M;
const chunkSize = 10 * 1024 * 1024;
export const useUploadModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const sliceFile = (file: any) => {
    const chunks = [];
    let start = 0;
    let end;
    while (start < file.size) {
      end = Math.min(start + chunkSize, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    return chunks;
  };

  /**
  * 计算文件md5值
  */
  const getFileMd5 = (file: any) => {
    return new Promise((resolve, reject) => {
      // let fileReader = new FileReader()
      // fileReader.onload = function (event: any) {
      //   let fileMd5 = SparkMD5.ArrayBuffer.hash(event?.target?.result);
      //   resolve(fileMd5);
      // }
      // fileReader.readAsArrayBuffer(file)
    });
  };
  const calculateFileMD5 = (file: any) => {
    return new Promise(r => {
      getFileMd5(file).then((md5) => {
        r(md5);
      });
    });
  };

  const uploadFile = (params: any) => {
    console.log(params, ' uploadFile ');
    return Promise.resolve(true);
  };

  const upload = async (file: any) => {
    if (!file) return;
    const fileMd5 = await calculateFileMD5(file);
    if (!fileMd5) return;
    setLoading(true);
    //获取到文件
    const fileArr = sliceFile(file);
    //保存文件名称
    const fileName: string = file.name;

    const all: any = [];
    fileArr.forEach((e, i: number) => {
      //创建formdata对象
      let data = new FormData();
      // data.append("totalNumber", fileArr.length)
      data.append("chunkSize", chunkSize)
      data.append("chunkNumber", i)
      data.append("md5", fileMd5)
      data.append("file", new File([e], fileName));
      all.push(
        new Promise((r, j) => {
          uploadFile(data).then(res=> {
            r(true);
          })
        })
      )
    });
    Promise.all(all).then(res => {
      console.log(res, 'all');
      const list = [...fileList];
      list.push({name: fileName});
      setFileList(list);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };
  return {
    loading,
    fileList,
    setFileList,
    upload,
    getFileMd5,
  }
}