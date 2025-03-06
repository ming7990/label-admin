import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  primaryColor: '#1890ff',
  navTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '教辅培训系统',
  pwa: false,
  logo: '/ai-teach/logo.png',
  iconfontUrl: '',
};

export default Settings;
