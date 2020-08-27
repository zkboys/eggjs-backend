'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  // 鉴权
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportLocal: {
    enable: true,
    package: 'egg-passport-local',
  },

  // 跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },

  // 模板
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },

  // 路由
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
};
