import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import routers from '../config/routes';
import Page403 from '@/pages/403';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/ai-teach/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const routersFilter: any[] = [];

const getNoAuthPage = (routers: any[], flag?: boolean) => {
  // 递归找到 noAuth 为 true 的页面
  routers.forEach((route: any, index: number) => {
    if (route.noAuth || flag) {
      routersFilter.push(route.path);
    }
    if (route.routes) {
      getNoAuthPage(route.routes, route.noAuth || flag);
    }
  });
};
// 加入无需权限页面列表
getNoAuthPage(routers);

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  routersFilter?: any[];
  isLogin?: boolean;
  hadDone?: boolean; // 表示是否初始化信息接口
  userAuth?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  // 抓去用户信息
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({ skipErrorHandler: true });
      return msg || {};
    } catch (error) {
      // 回登陆界面
      if (process.env.UMI_ENV == 'dev') {
        history.push(`/login`);
      } else {
        window.location.href = loginPath;
      }
    }
    return undefined;
  };

  // 判断该页面是否需要进行抓取用户信息
  if (routersFilter.indexOf(history.location.pathname) > -1) {
    console.log('初始页面为不需权限页面, 不尝试抓去用户信息');
    // 提前返回
    return {
      fetchUserInfo,
      routersFilter,
      currentUser: {}, // 用户信息
      userAuth: [], // 权限信息
      isLogin: false,
      hadDone: false,
      settings: {},
    };
  }

  // 用户信息结果
  let userMsg: any = await fetchUserInfo();

  userMsg = userMsg?.data || {};

  const orz = userMsg?.organizations?.[0]?.name || '';

  // 目前权限
  let userAuth: any = userMsg && Array.isArray(userMsg.role) ? userMsg?.role : [];

  // ------------
  // admin 管理员
  // teacher 教师端
  // student 学生端

  return {
    fetchUserInfo,
    routersFilter,
    currentUser: {
      ...userMsg.data,
      userName: userMsg?.userName,
      userCode: userMsg?.userCode,
      department: orz,
      userInfoAll: userMsg,
    }, // 用户信息  部门信息

    userAuth: userAuth, // 权限信息   userType 用户类型
    isLogin: userMsg?.principal?.userName ? true : false,
    hadDone: userMsg?.principal?.userName ? true : false,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    title: '教辅培训系统',
    footerRender: () => '', // <Footer />
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
          <a key="antd-component" href="https://pro.ant.design/zh-CN/" target="_blank">
            <LinkOutlined />
            <span>业务组组件</span>
          </a>,
          <a
            key="docs"
            href="https://is35svcbne.feishu.cn/wiki/wikcnmka9a34JEzgLbEhWrcXiJC"
            target="_blank"
          >
            <BookOutlined />
            <span>需求文档</span>
          </a>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <Page403 />,
    // 增加一个 loading 的状态

    ...initialState?.settings,
  };
};
