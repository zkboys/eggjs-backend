'use strict';
module.exports = app => {
  const { INTEGER } = app.Sequelize;

  return app.model.define('role_permission', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    roleId: INTEGER,
    permissionId: INTEGER,
  });
};
