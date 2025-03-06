import { Request, Response } from 'express';
import config from '../src/config';
import routers from '../config/routes';
const successCode = config.successCode;

const baseUrl = config.basePath;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let menus: string[] = [];
let menuBtns: string[] = [];
const getMenu = (routers: any) => {

  routers.forEach((item: any) => {
    if (item.access === 'routerAuth') {
      menus.push(item.path);
      if (item.btnMenu) {
        getMenuBtns(item.btnMenu);
      }
      if (item.routes) {
        getMenu(item.routes);
      }
    }
  });
  return menus;
};
const getMenuBtns = (btnMenu: any) => {
  btnMenu.forEach((btn: any) => {
    menuBtns.push(btn.key);
    console.log(btn.key);
    if (btn.children) {
      getMenuBtns(btn.children);
    }
  });
};
getMenu(routers);

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 获取用户信息
  [`GET ${baseUrl}/services/loginInfo`]: (req: Request, res: Response) => {
    // res.sendStatus(401);
    res.send({
      resultCode: successCode,
      data: {
        alias: '',
        account: 'JeffyLiang',
        userName: '梁山伯',
        userCode: '1000',
        signInTime: '8:58:58',
        // role: ['admin', 'teacher', 'student'],
        role: ['admin'],
        menus: menus,
        menuBtns: menuBtns,
        organizations: [
          {
            id: 1137,
            code: 'zyjr00004',
            name: '科技发展部',
          },
        ],
      },
    });
  },
  // ------------------
  // ------------------
  // ------------------
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
