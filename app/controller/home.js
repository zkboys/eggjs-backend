'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
    // ctx.ok('你好 eggjs');
    // 必须添加 await
    await ctx.render('index.ejs');
  }
}

module.exports = HomeController;
