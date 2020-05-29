"use strict";
const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
module.exports = [
  {
    method: "GET",
    path: "/api/contactList/getContact/{id}",
    config: {
      description: "Get contact detail",
      notes: "Get contact detail",
      tags: ["api"],
      auth: "jwt",
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: async (req, h) => {
        //Find contact by contact id.
        const Contact = await Models.Contact.findAll(
          {
            where: { contact_id: req.params.id },
          },
          { raw: true }
        );

        //If contact is not found webservice will return error not found.
        if (Contact.length <= 0) {
          return Boom.notFound(
            "Contact is not found with id: " + req.params.id
          );
        }

        //Assign new object with custom property and parsing phone, email and url to JSON.
        const resObj = await Contact.map((Contact) => {
          return Object.assign(
            {},
            {
              contactId: Contact.contact_id,
              name: Contact.name,
              lastname: Contact.lastname,
              birthdate: Contact.birthdate,
              groupId: Contact.group_id,
              phone: JSON.parse(Contact.phone),
              email: JSON.parse(Contact.email),
              url: JSON.parse(Contact.url),
            }
          );
        });

        //Return object.
        return resObj;
      },
    },
  },
  {
    method: "POST",
    path: "/api/contactList/createContact",
    config: {
      description: "Create group of contactlist",
      notes: "Create group of contactlist",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          lastname: Joi.any(),
          birthdate: Joi.any(),
          groupId: Joi.number().required(),
          phone: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
          email: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
          url: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
        }),
      },
      handler: async (req, h) => {
        //Insert contact and parsing phone, email and url to JSON string.
        const Contact = await Models.Contact.create({
          name: req.payload.name,
          lastname: req.payload.lastname,
          birthdate: req.payload.birthdate,
          group_id: req.payload.groupId,
          phone: JSON.stringify(req.payload.phone),
          email: JSON.stringify(req.payload.email),
          url: JSON.stringify(req.payload.url),
        });

        //If webservice can't insert it will return error bad request.
        if (Contact == null) {
          return Boom.badRequest("Cannot create a contact");
        }

        //Return contact name.
        return h.response("Created contact: " + Contact.name);
      },
    },
  },
  {
    method: "PUT",
    path: "/api/contactList/editContact",
    config: {
      description: "Edit contact of contact list",
      notes: "Edit contact of contact list",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          lastname: Joi.any(),
          birthdate: Joi.any(),
          groupId: Joi.number().required(),
          phone: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
          email: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
          url: Joi.array().items(
            Joi.object().keys({
              value: Joi.string(),
            })
          ),
        }),
      },
      handler: async (req, h) => {
        //Find contact by primary key.
        const Contact = await Models.Contact.findByPk(req.payload.id);

        //If contact is not found webservice will return error bad request.
        if (Contact == null) {
          return Boom.notFound(
            "Contact is not found with id: " + req.payload.id
          );
        }

        //If found contact it will update.
        await Contact.update(
          {
            name: req.payload.name,
            lastname: req.payload.lastname,
            birthdate: req.payload.birthdate,
            group_id: req.payload.groupId,
            phone: JSON.stringify(req.payload.phone),
            email: JSON.stringify(req.payload.email),
            url: JSON.stringify(req.payload.url),
          },
          {
            where: {
              contact_id: req.payload.id,
            },
          }
        );

        //Return contact name.
        return h.response("Edited contact: " + Contact.name);
      },
    },
  },
  {
    method: "DELETE",
    path: "/api/contactList/deleteContact",
    config: {
      description: "Delete contact of contactlist",
      notes: "Delete contact of contactlist",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: async (req, h) => {
        //Find contact by contact id
        const Contact = await Models.Contact.findAll(
          {
            where: { contact_id: req.payload.id },
          },
          { raw: true }
        );

        //If contact is not found it will return error not found.
        if (Contact.length <= 0) {
          return Boom.notFound(
            "Contact is not found with id: " + req.payload.id
          );
        }

        //If previous condition is not working it will delete.
        Models.Contact.destroy({
          where: {
            contact_id: req.payload.id,
          },
        });

        //Return delete message.
        return h.response("Contact deleted.");
      },
    },
  },
];
