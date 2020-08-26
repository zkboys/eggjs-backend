/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const exports = {};

  // use for cookie sign key, should change to your own and keep security
  exports.keys = appInfo.name + '_1597806902764_7388';

  // add your middleware config here
  exports.middleware = [
    'authenticate',
    'errorHandler',
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  exports.session = {
    key: 'SESSION_ID',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  // 静态文件
  exports.static = {
    prefix: '/public/',
    dir: [
      path.join(appInfo.baseDir, 'app/public'),
      {
        prefix: '/public/static',
        dir: path.join(appInfo.baseDir, 'app/public/static'),
        maxAge: 31536000,
      },
    ],
  };

  // 页面模板引擎
  exports.view = {
    root: path.join(appInfo.baseDir, 'app/public'),
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs',
    },
  };

  exports.security = {
    domainWhiteList: [
      'localhost:4200',
    ],
    csrf: {
      enable: false,
    },
  };

  exports.cors = {
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs'),
  };

  // 登录 请求中字段配置
  exports.passportLocal = {
    usernameField: 'username',
    passwordField: 'password',
  };

  return {
    ...exports,
    ...userConfig,
  };
};
