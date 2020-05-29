"use strict";
const Models = require("../models");
const Joi = require("joi");
const Boom = require("boom");
module.exports = [
  {
    method: "GET",
    path: "/api/contactList/getGroup",
    config: {
      description: "Get all group",
      notes: "Get all group and count contact that dependent on group",
      tags: ["api"],
      auth: "jwt",
      handler: async (req, h) => {
        //Query all of group in database.
        const Group = await Models.Group.findAll(
          {
            include: [{ model: Models.Contact }],
          },
          { raw: true }
        );

        //Assign new variable with custom property
        const resObj = await Group.map((Group) => {
          return Object.assign(
            {},
            {
              groupId: Group.gid,
              groupName: Group.group_name,
              totalContact: Group.Contacts.length,
            }
          );
        });
        return resObj;
      },
    },
  },
  {
    method: "GET",
    path: "/api/contactList/getGroup/{id}",
    config: {
      description: "Get all contact by groupid",
      notes: "Get all contact that dependent on group",
      tags: ["api"],
      auth: "jwt",
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: async (req, h) => {
        //Find group with group id.
        const Group = await Models.Group.findAll(
          {
            where: { gid: req.params.id },
            include: [{ model: Models.Contact }],
          },
          { raw: true }
        );

        //If group id is not found webservice will return error not found
        if (Group.length <= 0) {
          return Boom.notFound("Group is not found with id: " + req.params.id);
        }

        //Assign new object with custom property
        const resObj = await Group.map((Group) => {
          return Object.assign(
            {},
            {
              groupId: Group.gid,
              groupName: Group.group_name,
              Contact: Group.Contacts.map((Contact) => {
                return Object.assign(
                  {},
                  {
                    contactId: Contact.contact_id,
                    contactName: Contact.name,
                    contactLastname: Contact.lastname,
                  }
                );
              }),
            }
          );
        });

        //Return result object.
        return resObj;
      },
    },
  },
  {
    method: "POST",
    path: "/api/contactList/createGroup",
    config: {
      description: "Create group of contactlist",
      notes: "Create group of contactlist",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          groupName: Joi.string().required(),
        }),
      },
      handler: async (req, h) => {
        //Insert in to database group table.
        const Group = await Models.Group.create({
          group_name: req.payload.groupName,
        });

        //If webservice can't insert it will return error bad request
        if (Group == null) {
          return Boom.badRequest("Cannot create a group");
        }

        //Return group name.
        return h.response("Created group: " + Group.group_name);
      },
    },
  },
  {
    method: "PUT",
    path: "/api/contactList/editGroup",
    config: {
      description: "Edit group of contact list",
      notes: "Edit group of contact list",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
          groupName: Joi.string().required(),
        }),
      },
      handler: async (req, h) => {
        //Find group by primary key.
        const Group = await Models.Group.findByPk(req.payload.id);

        //If group is not found webservice will return error not found.
        if (Group == null) {
          return Boom.notFound("Group is not found with id: " + req.payload.id);
        }

        //If group is found update it.
        await Group.update(
          {
            group_name: req.payload.groupName,
          },
          {
            where: {
              gid: req.payload.id,
            },
          }
        );

        //return group name after update.
        return h.response("Edited group: " + Group.group_name);
      },
    },
  },
  {
    method: "DELETE",
    path: "/api/contactList/deleteGroup",
    config: {
      description: "Delete group of contactlist",
      notes: "Delete group of contactlist",
      tags: ["api"],
      auth: "jwt",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: async (req, h) => {
        //Find group by group id.
        const Group = await Models.Group.findAll(
          {
            where: { gid: req.payload.id },
            include: [{ model: Models.Contact }],
          },
          { raw: true }
        );

        //If group is not found webservice will return error not found.
        if (Group.length <= 0) {
          return Boom.notFound("Group is not found with id: " + req.payload.id);
        }

        //If group is dependent by contact it will return error bad request.
        if (Group[0].Contacts.length > 0) {
          return Boom.badRequest(
            "Can't delete group because contact is not empty."
          );
        }

        //If previous condition is not working. It can delete it.
        Models.Group.destroy({
          where: {
            gid: req.payload.id,
          },
        });

        //Return delete message.
        return h.response("Group deleted.");
      },
    },
  },
];
