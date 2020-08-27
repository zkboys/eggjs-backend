'use strict';

module.exports = app => {
  const { router, controller } = app;
  const { user } = controller;
  const apiRouter = router.namespace('/api'); // api开头的为接口

  // 登录
  apiRouter.post('/login', user.login);

  // 退出登录
  apiRouter.post('/logout', user.logout);
  // 登录回调
  apiRouter.get('/loginCallback', user.loginCallback);

  // 注册请求
  apiRouter.post('/register', user.register);

  // 同步微信用户、组织架构
  apiRouter.get('/syncWeChatUsers', user.syncWeChat);

  // 获取所有用户
  apiRouter.get('/users', user.getAll);

  // 根据id查询用户
  apiRouter.get('/users/:id', user.getById);

  // 更新用户
  apiRouter.put('/users/:id', user.update);

  // 删除用户
  apiRouter.del('/users/:id', user.del);

  // 修改密码
  apiRouter.put('/usersPassword', user.updatePassword);


  // 所有页面请求 返回首页
  // TODO 区分是页面请求，还是其他ajax 请求、静态文件请求
  router.get('/*', async ctx => ctx.render('index.html'));
};
