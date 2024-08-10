import Joi from 'joi';

export const schema = {
  list: Joi.object({
    page: Joi.number().required(),
    pageSize: Joi.number().optional(),
  }),
};
