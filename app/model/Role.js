'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Role = app.model.define('role', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    name: STRING(200),
    description: STRING(500),
  });

  // Role.sync({force: true});

  Role.associate = function() {
    // 与User表是多对多关系
    app.model.Role.belongsToMany(app.model.User, {
      through: app.model.RoleUser,
      foreignKey: 'roleId',
      otherKey: 'userId',
    });

    // 与permission表示多对多关系
    app.model.Role.belongsToMany(app.model.Permission, {
      through: app.model.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
    });
  };

  return Role;
};
