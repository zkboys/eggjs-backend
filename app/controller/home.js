'use strict';

const Controller = require('egg').Controller;
const { getWeChatUsers } = require('../util/index');


class HomeController extends Controller {

  async index() {
    const { ctx } = this;

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
    ctx.body = 'ok';
  }
}

module.exports = HomeController;
