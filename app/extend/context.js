'use strict';

module.exports = {
  ok(data) {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    this.response.status = 200;
    if (data !== undefined) this.body = data;
  },
  fail(...args) {

    // 自定义code 1000以上，避免与http 状态码冲突
    let [ code = -1, message, data ] = args;

    // 如果是一个参数，直接为message
    if (args.length === 1) {
      message = args[0];
      code = -1;
      data = undefined;
    }

    // 获取错误信息
    const messages = getMessages(code, message, data);
    const firstMessage = messages[0];

    // 设置 http 状态码
    let httpCode = 400;
    if (code > 0 && code < 600) httpCode = code;

    // 使用throw，执行到throw时，此次请求就结束了，ctx.fail 前面不必添加return
    this.throw(httpCode, {
      code,
      message: firstMessage,
      messages,
      detail: message,
      data,
    });
  },
};

const codeMap = {
  '-1': 'fail',
  200: 'success',
  401: 'token expired',
  500: 'server error',
  10001: 'params error',
};

// TODO 各种错误信息，统一整理 传递给前端
function getMessages(code, msg) {
  if (!msg) return [ codeMap[code] ];

  if (Array.isArray(msg)) {
    let messages = [];

    msg.forEach(item => {
      if (typeof item === 'object') {
        if ('message' in item && 'field' in item) {
          messages.push(item);
        } else {
          messages = messages.concat(Object.values(item));
        }
      } else if (typeof item === 'string') {
        messages.push(item);
      }
    });

    return messages;
  }

  if (typeof msg === 'string') return [ msg ];

  if (msg instanceof Error) return [ msg.message ];

  return [];
}
