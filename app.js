'use strict';

module.exports = (app) => {
  /** 同步数据库 */
  // if (app.config.env === 'local' || app.config.env === 'unittest') {
  //   app.beforeStart(async () => {
  //     await app.model.sync({ force: true });
  //   });
  // }
};
