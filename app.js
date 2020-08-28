'use strict';

const bcrypt = require('bcryptjs');

module.exports = app => {
  /** 同步数据库 */
  const isSync = false;
  // const isSync = app.config.env === 'local' || app.config.env === 'unittest';
  if (isSync) {
    app.beforeStart(async () => {
      await app.model.sync({ force: true });

      const { User } = app.model;

      // 创建一个管理员
      await User.create({
        account: 'admin',
        jobNumber: 'admin',
        password: bcrypt.hashSync('admin123', 8),
        name: '管理员',
      });
    });

  }
};
