'use strict';

module.exports = app => {
  const { router, controller } = app;

  const { user } = controller;

  // 页面
  router.get('/', async ctx => ctx.render('index.ejs'));
  router.get('/login', async ctx => await ctx.render('login.ejs'));
  router.get('/register', async ctx => ctx.render('register.ejs'));

  // api开头的为接口

  // 退出登录
  router.post('/api/logout', user.logout);

  // 登录
  router.post('/api/login', app.passport.authenticate('local', { successRedirect: '/api/loginCallback', failureRedirect: '/api/loginCallback' }));

  // 登录回调
  router.get('/api/loginCallback', user.loginCallback);

  // 注册请求
  router.post('/api/register', user.register);

  // 获取所有用户
  router.get('/api/users', user.getAll);

  // 根据id查询用户
  router.get('/api/users/:id', user.getById);

  // 更新用户
  router.put('/api/users/:id', user.update);

  // 删除用户
  router.del('/api/users/:id', user.del);

  // 修改密码
  router.put('/api/usersPassword', user.updatePassword);
};
