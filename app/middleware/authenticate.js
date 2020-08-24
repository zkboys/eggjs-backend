'use strict';

const { pathToRegexp } = require('path-to-regexp');

/** 鉴权拦截 */

// 可通过
function canPass(ctx) {
  if (/^\/api/.test(ctx.path)) {
    return pathToRegexp([
      '/api/login',
      '/api/logout',
      '/api/loginCallback',
      '/api/register',
    ]).test(ctx.path);
  }

  return true;
}

/** 验证用户是否已经登录，做统一拦截 */
module.exports = () => {
  return async function auth(ctx, next) {
    if (!ctx.isAuthenticated() && !canPass(ctx)) {
      ctx.status = 401;
      return;
    }
    return next();
  };
};
