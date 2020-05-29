"use strict";

const appConfig = require("../configs/app");
const Joi = require("Joi");
const taxCaculation = require("../libs/taxCalculator");

module.exports = [
  {
    method: "POST",
    path: "/api/taxCalculate",
    config: {
      description: "Tax calculation api",
      notes: "This api use for tax calculation by tax step",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          netIncome: Joi.number().required(),
        }),
      },
      handler: async (req, h) => {
        const { netIncome } = req.payload;

        //This object of tax step to calculate.
        const taxStep = [
          {
            percent: 0,
            initValue: 0,
            targetValue: 150000,
          },
          {
            percent: 5,
            initValue: 150000,
            targetValue: 300000,
          },
          {
            percent: 10,
            initValue: 300000,
            targetValue: 500000,
          },
          {
            percent: 15,
            initValue: 500000,
            targetValue: 750000,
          },
          {
            percent: 20,
            initValue: 750000,
            targetValue: 1000000,
          },
          {
            percent: 25,
            initValue: 1000000,
            targetValue: 2000000,
          },
          {
            percent: 30,
            initValue: 2000000,
            targetValue: 5000000,
          },
          {
            percent: 35,
            initValue: 5000000,
            targetValue: 0,
          },
        ];

        const result = taxCaculation(netIncome, taxStep);

        return result;
      },
    },
  },
];
