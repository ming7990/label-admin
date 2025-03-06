import Condition from '@/components/Condition';
import config from '@/config/index';
import { Button, Modal, Input, Radio, Switch, Upload, Cascader, Form, message, Spin } from 'antd';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import jsPreviewDocx from "@js-preview/docx";
import '@js-preview/docx/lib/index.css';
import jsPreviewExcel from "@js-preview/excel";
import '@js-preview/excel/lib/index.css';
import jsPreviewPdf from "@js-preview/pdf";

const baseUrl: string = config.basePath;
const ModelPreview: React.FC<any> = (props: any) => {
  const { cref } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [doc, setDoc] = useState<string>('pic');
  const [width, setWidth] = useState<number>(600);
  const [loading, setLoading] = useState<boolean>(false);

  const open = async (url: string, type: string = 'pic') => {
    setVisible(true);
    setUrl(url);
    setDoc(type);
    if (['docx', 'xlsx', 'pdf'].includes(type)) {
      setWidth(window.innerWidth - 20);
    } else if (type == 'pic') {
      setWidth(600);
    }
  }
  const onCancel = () => {
    setVisible(false);
  }

  useImperativeHandle(cref, () => ({
    open,
  }));
  useEffect(() => {
    if (doc == 'docx') {
      setLoading(true);
      setTimeout(() => {
        const myDocxPreviewer = jsPreviewDocx.init(document.getElementById('docx'));
        //传递要预览的文件地址即可
        myDocxPreviewer.preview(url).then(res => {
          console.log('预览完成');
          setLoading(false);
        }).catch(e => {
          setLoading(false);
          console.log('预览失败', e);
        });
      }, 1000);
    } else if (doc == 'xlsx') {
      setLoading(true);
      setTimeout(() => {
        const myExcelPreviewer = jsPreviewExcel.init(document.getElementById('excel'));
        myExcelPreviewer.preview(url).then(res => {
          console.log('预览完成');
          setLoading(false);
        }).catch(e => {
          console.log('预览失败', e);
          setLoading(false);
        });
      }, 1000);
    } else if (doc == 'pdf') {
      setLoading(true);
      setTimeout(() => {
        const myPdfPreviewer = jsPreviewPdf.init(document.getElementById('pdf'));
        myPdfPreviewer.preview(url).then(res => {
          console.log('预览完成');
          setLoading(false);
        }).catch(e => {
          setLoading(false);
          console.log('预览失败', e);
        });
      }, 1000);
    }
  }, [doc, url]);
  return (
    <Modal bodyStyle={{ maxHeight: window.innerHeight - 20, overflow: 'auto' }} width={width} visible={visible} title={'预览'} footer={null} onCancel={onCancel}>
      {
        doc == 'pic' && (<div style={{ textAlign: 'center' }}><img alt="图片预览" style={{ maxWidth: '100%' }} src={url} /></div>)
      }
      <Spin spinning={loading}>
        {
          doc == 'docx' && <div id='docx'></div>
        }
        {
          doc == 'xlsx' && <div id='excel' style={{ height: 600 }}></div>
        }
        {
          doc == 'pdf' && <div id='pdf'></div>
        }
      </Spin>
    </Modal>
  )
}

export default ModelPreview;
