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
        const Contact = await Models.Contact.findAll(
          {
            where: { contact_id: req.params.id },
          },
          { raw: true }
        );

        if (Contact.length <= 0) {
          return Boom.notFound(
            "Contact is not found with id: " + req.params.id
          );
        }

        const resObj = await Contact.map((Contact) => {
          return Object.assign(
            {},
            {
              contactId: Contact.contact_id,
              name: Contact.name,
              lastname: Contact.lastname,
              birthdate: Contact.birthdate,
              phone: JSON.parse(Contact.phone),
              email: JSON.parse(Contact.email),
              url: JSON.parse(Contact.url),
            }
          );
        });
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
        const Contact = await Models.Contact.create({
          name: req.payload.name,
          lastname: req.payload.lastname,
          birthdate: req.payload.birthdate,
          group_id: req.payload.groupId,
          phone: JSON.stringify(req.payload.phone),
          email: JSON.stringify(req.payload.email),
          url: JSON.stringify(req.payload.url),
        });

        if (Contact == null) {
          return Boom.badRequest("Cannot create a contact");
        }

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
        const Contact = await Models.Contact.findByPk(req.payload.id);
        if (Contact == null) {
          return Boom.notFound(
            "Contact is not found with id: " + req.payload.id
          );
        }
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
        const Contact = await Models.Contact.findAll(
          {
            where: { contact_id: req.payload.id },
          },
          { raw: true }
        );

        if (Contact.length <= 0) {
          return Boom.notFound(
            "Contact is not found with id: " + req.payload.id
          );
        }

        Models.Contact.destroy({
          where: {
            contact_id: req.payload.id,
          },
        });

        return h.response("Contact deleted.");
      },
    },
  },
];
