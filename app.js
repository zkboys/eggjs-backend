'use strict';
const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
  /** 同步数据库 */
  // if (app.config.env === 'local' || app.config.env === 'unittest') {
  //   app.beforeStart(async () => {
  //     await app.model.sync({ force: true });
  //   });
  // }

  /** 挂载 strategy */
  app.passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    // format user
    const user = {
      provider: 'local',
      username,
      password,
    };
    app.passport.doVerify(req, user, done);
  }));

  /** 验证用户 */
  app.passport.verify(async (ctx, user) => {
    // 先退出登录，如果存在有效cookie，无论什么用户名密码，都会登录成功，这里返回false无效
    // 有可能是个bug
    ctx.logout();

    // 查找数据库，并验证密码是否正确
    const User = ctx.model.User;
    const userService = ctx.service.user;

    const foundUser = await User.findOne({ where: { username: user.username } });
    console.log(user.password);
    if (!foundUser || !userService.comparePassword(user.password, foundUser.password)) return false;

    return foundUser;
  });

  /** 序列化用户 存放在cookie中的用户信息，尽量少 */
  app.passport.serializeUser(async (ctx, user) => {
    return {
      id: user.id,
    };
  });

  /** 反序列化用户 存储到ctx.user中的用户 */
  app.passport.deserializeUser(async (ctx, user) => {
    const User = ctx.model.User;
    const userId = user.id;

    return await User.findByPk(userId);
  });
};
