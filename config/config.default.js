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
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1597806902764_7388';

  // add your middleware config here
  config.middleware = [
    'authenticate',
    'errorHandler',
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 页面模板引擎
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  config.security = {
    domainWhiteList: [
      'localhost:4200',
    ],
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs'),
  };

  // 登录 请求中字段配置
  config.passportLocal = {
    usernameField: 'username',
    passwordField: 'password',
  };

  return {
    ...config,
    ...userConfig,
  };
};
