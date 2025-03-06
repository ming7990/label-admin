console.log('process.env.mock');
console.log(process.env.mock);
export default {
  basePath: process.env.mock ? '/dev' : '/ai-teach',
  originPath: '/ai-teach',
  successCode: '100',
};
