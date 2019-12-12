
module.exports = ({ ajv, router, customerService }) => {

  router.post('/api/customers', async (ctx) => {
    const validate = ajv.compile(createCustomerSchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return
    }

    ctx.body = await customerService.create(ctx.request.body)
  })

};

const createCustomerSchema = {
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
  required: ['firstName', 'lastName', 'email'],
  additionalProperties: false
};
