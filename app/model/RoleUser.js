'use strict';
module.exports = app => {
  const { INTEGER } = app.Sequelize;

  return app.model.define('role_user', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    userId: INTEGER,
    roleId: INTEGER,
  });
};
