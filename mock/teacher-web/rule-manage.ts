import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const gradeConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '1',
      actionRate: '10',
      serviceRate: '12',
      serviceSingleRate: '13',
      dialogueRate: '14',
      dialogueSingleRate: '15',
    },
  });
};

const ruleConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '1',
      speechSwitch: '1',
      wordage: '1,5',
      toneSwitch: '1',
      toneWords: '语气词1,语气词2,语气词3',
      repeatTime: 5,
      emotionnalSwitch: '0',
      sensation: '0',
    },
  });
};

const dialogConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '1',
      similarNum: '80',
    },
  });
};

export default {
  [`POST ${baseUrl}/services/setting/gradeConfig`]: gradeConfig,
  [`POST ${baseUrl}/services/setting/gradeConfigSave`]: normalDeal,
  [`POST ${baseUrl}/services/setting/ruleConfig`]: ruleConfig,
  [`POST ${baseUrl}/services/setting/ruleConfigSave`]: normalDeal,
  [`POST ${baseUrl}/services/setting/actionConfig`]: dialogConfig,
  [`POST ${baseUrl}/services/setting/actionConfigSave`]: normalDeal,
};
