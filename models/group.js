"use strict";

module.exports = function (sequelize, DataTypes) {
  const Group = sequelize.define(
    "Group",
    {
      gid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
      tableName: "Group",
    }
  );

  return Group;
};
