"use strict";

module.exports = function (sequelize, DataTypes) {
  const Phone = sequelize.define(
    "Phone",
    {
      phone_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      phone_number: {
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
      tableName: "Phone",
    }
  );

  return Phone;
};
