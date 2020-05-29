"use strict";
//This file use for get token to access other api.
const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
const JWT = require("jsonwebtoken");
const appConfig = require("../configs/app");
const Crypto = require("crypto");

module.exports = [
  {
    method: "POST",
    path: "/api/getToken",
    config: {
      description: "get a Token",
      notes: "get a Token",
      tags: ["api"],
      auth: false, // ignore authentication
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: async (req, h) => {
        //recieve data from username parameter.
        const username = req.payload.username;
        //recieve data from password parameter and hashing with md5 hash.
        const password = Crypto.createHash("md5")
          .update(req.payload.password)
          .digest("hex");

        const user = await Models.User.findOne({
          where: {
            username: username,
            password: password,
          },
        });

        //If use is null webservice will return error 401
        if (user == null) {
          return Boom.unauthorized("Bad credentials");
        }

        //If data is correct webservice generate token and return token with response.
        const token = JWT.sign(
          {
            data: {
              uid: user.uid,
              username: user.username,
              name: user.name,
              lastname: user.lastname,
            },
          },
          appConfig.SECRET
        );

        const response = h.response({
          token: token,
        });

        response.header("Authorization", token);
        return response;
      },
    },
  },
];
