"use strict";

module.exports = function (sequelize, DataTypes) {
  const Url = sequelize.define(
    "Url",
    {
      url_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      url_add: {
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
      tableName: "Url",
    }
  );

  return Url;
};
