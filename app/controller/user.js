'use strict';
const { Op } = require('sequelize');
const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const { getWeChatUsers } = require('../util/index');

module.exports = class UserController extends Controller {
  // 登录验证回调
  async loginCallback(ctx) {
    if (ctx.isAuthenticated()) return ctx.success(ctx.user);

    return ctx.fail('用户名或密码错误！');
  }

  // 登录
  async login(ctx) {
    ctx.validate({
      account: 'string',
      password: 'string',
    }, ctx.request.body);

    const { User } = ctx.model;
    const { user: userService } = ctx.service;
    const errorMessage = '用户名或密码错误';

    const { account, password } = ctx.request.body;

    const user = await User.findOne({ where: { account } });
    if (!user) return ctx.fail(errorMessage);

    const verifyPassword = userService.comparePassword(password, user.password);
    if (!verifyPassword) return ctx.fail(errorMessage);

    const { secret, expire, cookieName } = ctx.app.config.jwt;
    const { redis } = ctx.app;
    // expiresIn 单位 秒
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: expire });
    user.token = token;

    ctx.cookies.set(cookieName, token,
      {
        maxAge: expire * 1000, // cookie有效时长 单位 毫秒s
        httpOnly: true, // 是否只用于http请求中获取
        overwrite: false, // 是否允许重写
      });

    // 存储到redis，退出登录会用到
    await redis.set(token, token);

    return ctx.success(userService.safeUser(user));
  }

  // 退出登录接口
  async logout(ctx) {
    const { redis } = ctx.app;
    const { cookieName } = ctx.app.config.jwt;

    const token = ctx.userToken;

    await redis.del(token);

    ctx.cookies.set(cookieName, null);

    ctx.success();
  }

  // 用户注册
  async register(ctx) {
    const requestBody = ctx.request.body;
    const User = ctx.model.User;
    const userService = ctx.service.user;

    ctx.validate({
      account: 'string',
      name: 'string',
      password: 'string',
    }, requestBody);

    const { password, account } = requestBody;

    const foundUser = await User.findOne({ where: { account } });
    if (foundUser) return ctx.fail('此用户名已存在');

    const ePassword = userService.encryptPassword(password);

    const savedUser = await User.create({ ...requestBody, password: ePassword });

    return ctx.success(savedUser);
  }

  // 获取所有用户
  async getAll(ctx) {
    const { pageNum = 1, pageSize = 10, name, position } = ctx.query;

    const { User, Role, Permission } = ctx.model;

    const conditions = [];

    if (name) conditions.push({ name: { [Op.like]: `%${name.trim()}%` } });

    if (position) conditions.push({ position: { [Op.like]: `%${position.trim()}%` } });

    const options = {
      offset: (pageNum - 1) * pageSize,
      limit: +pageSize,
      include: {
        model: Role,
        include: Permission,
      },
      where: {
        [Op.and]: [ conditions ],
      },
      order: [
        [ 'jobNumber', 'ASC' ],
      ],
    };

    const { count, rows } = await User.findAndCountAll(options);

    ctx.success({ rows, count });
  }

  // 获取用户详情
  async getById(ctx) {
    ctx.validate({
      id: 'string',
    }, ctx.params);

    const { id } = ctx.params;

    const { User } = ctx.model;

    const result = await User.findByPk(id);

    ctx.success(result);
  }

  // 更新用户
  async update(ctx) {
    const requestBody = ctx.request.body;

    ctx.validate({
      id: 'string',
      account: 'string',
      password: 'string?',
      email: 'string',
    }, requestBody);

    const { id, account, password, email } = requestBody;

    const { User } = ctx.model;
    const { user: userService } = ctx.service;

    const user = await User.findByPk(id);
    if (!user) return ctx.fail('用户不存在或已删除！');

    const exitName = await User.findOne({ where: { account } });
    if (exitName && exitName.id !== id) return ctx.fail('此用户名已被占用！');

    const exitEmail = await User.findOne({ where: { email } });
    if (exitEmail && exitEmail.id !== id) return ctx.fail('此邮箱已被占用！');

    const userData = { ...requestBody };
    if (password) {
      userData.password = userService.encryptPassword(password);
    }

    const result = await user.update(userData);

    ctx.success(result);
  }

  // 删除用户
  async del(ctx) {
    ctx.validate({
      id: 'string',
    }, ctx.params);

    const { id } = ctx.params;
    const { User } = ctx.model;
    const result = await User.destroy({ where: { id } });

    ctx.success(result);
  }

  // 修改密码
  async updatePassword(ctx) {
    ctx.validate({
      oldPassword: 'string',
      password: 'string?',
    }, ctx.request.body);

    const { oldPassword, password } = ctx.request.body;

    const currentUser = ctx.user;
    const userService = ctx.service.user;

    const isSame = userService.comparePassword(oldPassword, currentUser.password);

    if (!isSame) return ctx.fail('原密码输入错误！');

    const hashPassword = userService.encryptPassword(password);

    await currentUser.update({ password: hashPassword });

    ctx.success(true);
  }

  // 同步微信用户
  async syncWeChat(ctx) {
    const data = await getWeChatUsers();
    const { Department, User, DepartmentUser } = ctx.model;
    const { user: userService } = ctx.service;

    // 删除所有用户 以及 部门
    await User.destroy({
      where: {},
    });
    await Department.destroy({
      where: {},
    });
    await DepartmentUser.destroy({
      where: {},
    });

    const users = [];
    const departs = [];
    data.forEach(item => {
      const {
        type,
        name,
        alias,
        id,
        parentId,
        order,
        department,
        mobile,
        gender,
        email,
        avatar,
        position,
        status,
        enable,
        is_leader_in_dept,
        qr_code,
      } = item;

      const account = email ? email.replace('@suixingpay.com', '') : '';

      if (type === 'depart') {
        departs.push({
          id,
          parentId,
          order,
          name,
        });
      } else {
        users.push({
          id,

          department,
          order,
          is_leader_in_dept,

          name,
          jobNumber: alias,
          account,
          password: '123456',
          mobile,
          gender,
          email,
          avatar,
          position,
          status,
          enable,
          qrCode: qr_code,
        });
      }
    });

    for (const d of departs) {
      const dId = +d.id;
      const duss = users.filter(u => u.department.includes(dId));

      // 去重
      const dus = [];
      duss.forEach(item => {
        if (!dus.find(it => it.id === item.id)) dus.push(item);
      });

      // 创建组织架构
      const department = await Department.create(d);


      // 创建组织架构对应的用户
      for (const du of dus) {
        const index = du.department.indexOf(dId);

        const isLeader = du.is_leader_in_dept[index];
        const order = du.order[index];

        const existUser = await User.findByPk(du.id);

        if (existUser) {
          DepartmentUser.create({
            userId: du.id,
            departmentId: department.id,
            isLeader,
            order,
          });
        } else {
          du.password = userService.encryptPassword(du.password);
          await department.createUser(du, {
            through: {
              isLeader,
              order,
            },
          });
        }
      }
    }

    // 创建一个管理员
    await User.create({
      account: 'admin',
      jobNumber: 'admin',
      password: userService.encryptPassword('admin123'),
      name: '管理员',
    });

    ctx.success(true);
  }
};
