'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Permission = app.model.define('permission', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    name: STRING(200),
    code: STRING(20),
    description: STRING(500),
  });

  // Permission.sync({force: true});

  Permission.associate = function() {
    // 与Role表是多对多关系
    app.model.Permission.belongsToMany(app.model.Role, {
      through: app.model.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
    });
  };
  return Permission;
};
