"use strict";

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      uid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "User",
    }
  );

  return User;
};
