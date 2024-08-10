import Joi from 'joi';
import moment from 'moment';

const commonSchema = {
  customerName: Joi.string().trim().required(),
  customerMobile: Joi.string().trim().required(),
  totalPrice: Joi.number().greater(0).required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        itemID: Joi.string().required(),
        quantity: Joi.number().greater(0).required(),
      }),
    )
    .unique((a, b) => {
      return a.itemID === b.itemID;
    })
    .min(1)
    .required(),
};

export const schema = {
  add: Joi.object({
    ...commonSchema,
  }),
  edit: Joi.object({
    ...commonSchema,
  }),
  list: Joi.object({
    page: Joi.number().required(),
    pageSize: Joi.number().optional(),
  }),
  generateDailyReport: Joi.object({
    day: Joi.date().less(moment().format('YYYY-MM-DD')).required(),
    timezoneOffset: Joi.number().required(),
  }),
};
