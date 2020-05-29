"use strict";

const sendGrid = require("@sendgrid/mail");
const appConfig = require("../configs/app");
const Joi = require("Joi");

module.exports = [
  {
    method: "POST",
    path: "/api/sendMail",
    config: {
      description: "Send mail api by sendgrid service",
      notes: "Send mail api by sendgrid service",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          from: Joi.string().required(),
          to: Joi.string().required(),
          message: Joi.string().required(),
          templateID: Joi.string(),
        }),
      },
      handler: async (req, h) => {
        //Init msg json data.
        //msg is data for request to sendgrid api to send mail.
        const subject = "Test send mail";
        const msg = {
          to: req.payload.to,
          from: req.payload.from,
          subject: subject,
        };

        //This section is condition for detect templateID. The templateID is id for specify a template on sendgrid.
        if (req.payload.templateID != null) {
          //If payload have no templateID it will set templateId and dynamic_template_data property.
          msg.templateId = req.payload.templateID;
          msg.dynamic_template_data = {
            message: req.payload.message,
            subject: subject,
          };
        } else {
          //If payload have no templateID it will set html property.
          msg.content = [
            {
              type: "text/html",
              value: req.payload.message,
            },
          ];
        }
        console.log(msg);
        console.log(req.payload);
        sendGrid.setApiKey(appConfig.MAIL_API_KEY);

        const response = (async () => {
          try {
            const result = await sendGrid.send(msg);
            return result
              ? {
                  message: "sent!",
                  data: result,
                }
              : {
                  message: "Cannot send mail.",
                  data: result,
                };
          } catch (error) {
            console.error(error);
            if (error.response) {
              console.error(error.response.body);
              return error.response.body;
            }
          }
        })();

        return response;
      },
    },
  },
];
