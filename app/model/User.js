'use strict';

module.exports = app => {
  const { STRING, UUID, UUIDV4 } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: UUIDV4,
    },
    username: STRING(20),
    password: STRING(100),
    email: STRING(100),
  });

  // User.sync({force: true});

  User.associate = function() {
    // 与Role存在多对多关系，使用belongsToMany()
    app.model.User.belongsToMany(app.model.Role, {
      through: 'RoleUser',
    });
  };

  return User;
};
