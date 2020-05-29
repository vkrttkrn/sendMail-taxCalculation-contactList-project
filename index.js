"use strict";

const Hapi = require("@hapi/hapi");

//Configs
const appConfig = require("./configs/app");

//Models
const Models = require("./models");

//Routes
const Routes = require("./routes");

const config = {
  port: appConfig.NODE_PORT,
  host: appConfig.HOST,
};

const server = Hapi.server(config);

const start = async () => {
  /* Start Plugin Section */

  // hapi-auth-jwt2 is Json Web Token authentication plugin
  await server.register(require("hapi-auth-jwt2"));

  // good is process monitor plugin
  await server.register({
    plugin: require("good"),
    options: {
      ops: {
        interval: 1000,
      },
      reporters: {
        myConsoleReporter: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [{ log: "*", response: "*" }],
          },
          {
            module: "good-console",
          },
          "stdout",
        ],
      },
    },
  });

  /* End Plugins Section */

  /* Start Authentication Section */

  // validate variable is function for validate Json Web Token every request from clients
  const validate = async function (decoded, request, h) {
    const user = await Models.User.findOne({
      where: {
        uid: decoded.data.uid,
        username: decoded.data.username,
        name: decoded.data.name,
        lastname: decoded.data.lastname,
      },
    });

    if (user != null) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
      };
    }
  };
  // end validate variable.

  // This is a pre-configured instance of a scheme for authentication.
  server.auth.strategy("jwt", "jwt", {
    key: appConfig.SECRET,
    urlKey: false,
    cookieKey: false,
    verifyOptions: {
      algorithms: ["HS256"],
    },
    validate: validate,
  });

  //Set default strategy
  await server.auth.default("jwt");

  /* End Authentication Section */

  /* Start Route Section */

  for (const i in Routes) {
    server.route(Routes[i]);
  }

  /* End Route Section */

  //starting server
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

//start server
Models.sequelize.sync().then(start);
