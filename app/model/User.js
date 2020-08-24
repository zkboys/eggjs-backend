'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    username: STRING(20),
    password: STRING(100),
    email: STRING(100),
  });

  // User.sync({force: true});

  User.associate = function() {
    // 与Role存在多对多关系，使用belongsToMany()
    app.model.User.belongsToMany(app.model.Role, {
      through: app.model.RoleUser,
      foreignKey: 'userId',
      otherKey: 'roleId',
    });
  };

  return User;
};
