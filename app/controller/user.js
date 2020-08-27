'use strict';
const { Op } = require('sequelize');
const Controller = require('egg').Controller;
const { getWeChatUsers } = require('../util/index');

module.exports = class UserController extends Controller {
  // 登录验证回调
  async loginCallback(ctx) {
    if (ctx.isAuthenticated()) return ctx.success(ctx.user);

    return ctx.fail('用户名或密码错误！');
  }

  // 退出登录接口
  async logout(ctx) {
    ctx.logout();
    ctx.success(true);
  }

  // 用户注册
  async register(ctx) {
    const requestBody = ctx.request.body;
    const User = ctx.model.User;
    const userService = ctx.service.user;

    ctx.validate({
      username: 'string',
      password: 'string',
    }, requestBody);

    const { password, username } = requestBody;

    const foundUser = await User.findOne({ where: { username } });
    if (foundUser) return ctx.fail('此用户名已存在');

    const ePassword = userService.encryptPassword(password);

    const savedUser = await User.create({ username, password: ePassword });

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
        [ 'updatedAt', 'DESC' ],
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
    const currentUser = ctx.user;

    if (currentUser.permission !== 'admin') return ctx.fail('您无权进行此操作！');

    ctx.validate({
      id: 'string',
    }, ctx.params);
    ctx.validate({
      username: 'string',
      password: 'string?',
      email: 'string',
      permission: 'string?',
    }, ctx.request.body);

    const { username, password, email, permission } = ctx.request.body;

    const { id } = ctx.params;

    const { User } = ctx.model;

    const user = await User.findByPk(id);
    if (!user) return ctx.fail('用户不存在或已删除！');

    const exitName = await User.findOne({ where: { username } });
    if (exitName && exitName.id !== +id) return ctx.fail('此用户名已被占用！');

    const exitEmail = await User.findOne({ where: { email } });
    if (exitEmail && exitEmail.id !== +id) return ctx.fail('此邮箱已被占用！');

    const userData = { username, email, permission };
    if (password) {
      userData.password = User.encryptPassword(password);
    }

    const result = await user.update(userData);

    ctx.success(result);
  }

  // 删除用户
  async del(ctx) {
    const currentUser = ctx.user;

    if (currentUser.permission !== 'admin') return ctx.fail('您无权进行此操作！');

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

    const users = [];
    const departs = [];
    data.forEach(item => {
      const {
        type,
        name,
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

      const username = email ? email.replace('@suixingpay.com', '') : '';

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
          username,
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
          du.password = ctx.service.user.encryptPassword(du.password);
          await department.createUser(du, {
            through: {
              isLeader,
              order,
            },
          });
        }
      }
    }
    ctx.success(true);
  }
};
