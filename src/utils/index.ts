export function formatePercent(val: number): string {
  if (typeof val === 'number') {
    let str1 = (val * 100).toFixed(0);
    let str2 = (val * 100).toFixed(2);
    return (Number(str1) === Number(str2) ? str1 : str2) + '%';
  }
  return '0%';
}

export const handleKeyPress = (e: any) => {
  // 如果用户按下了空格或制表符，则防止它们被输入
  if (e.key === ' ' || e.key === 'Tab') {
    e.preventDefault();
  }
};

export const validateSpaces = (rule: any, value: any, callback: any) => {
  const regex = /\s/;
  if (regex.test(value)) {
    callback('输入值中不允许包含空格字符');
  } else {
    callback();
  }
};

// 两数相乘;
export const accMul = (arg1: number, arg2: number) => {
  var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
  try {
      m += s1.split(".")[1].length;
  } catch (e) {}
  try {
      m += s2.split(".")[1].length;
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

export function objectToGetParams(obj: any) {
  let params = '';
  if (!obj) return '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (params !== '') {
        params += '&';
      }
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          params += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key][i]) + '&';
        }
        params = params.slice(0, -1); // 移除最后一个多余的&
      } else {
        params += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
      }
    }
  }

  return params;
}
