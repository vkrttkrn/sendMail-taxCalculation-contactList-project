"use strict";

module.exports = function (sequelize, DataTypes) {
  const Email = sequelize.define(
    "Email",
    {
      email_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      email_add: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Email",
    }
  );

  return Email;
};
