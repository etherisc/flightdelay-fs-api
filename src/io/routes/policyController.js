
module.exports = ({ router, createPolicyService, policyService, ajv }) => {

  router.post('/api/policies', async (ctx) => {
    const applyCommand = ctx.request.body;
    const validate = ajv.compile(applyPolicySchema);

    if (!validate(applyCommand)) {
      ctx.badRequest({ error: validate.errors });
      return
    }

    try {
      ctx.ok(await createPolicyService.applyForPolicy(applyCommand))
    } catch (error) {
      ctx.badRequest(error)
    }
  });

  router.post('/api/policies/create', async (ctx) => {
    const validate = ajv.compile(createPolicySchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return
    }

    const { txHash } = ctx.request.body;
    await createPolicyService.startPolicyCreationProcess(txHash);

    ctx.ok({ status: 'JobCreated' });

    createPolicyService
      .executePolicyCreationProcess(txHash)
      .catch(console.log)
  });

  router.post('/api/policies/checkPolicyJob', async (ctx) => {
    const validate = ajv.compile(checkPolicyJobSchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return
    }

    const { txHash } = ctx.request.body;
    const result = await createPolicyService.checkPolicyJob(txHash);

    ctx.ok(result)
  });

  router.get('/api/policies/:id', async (ctx) => {
    const id = ctx.params.id;

    const certificate = await policyService.getPolicy(id);

    if (!certificate) {
      ctx.notFound();
      return
    }

    ctx.body = certificate
  });

  router.get('/api/customers/:id/policies', async (ctx) => {
    const customerId = ctx.params.id;

    const policies = await policyService.findAllByCustomerId(customerId);

    ctx.ok(policies)
  });

  router.post('/api/policies/payouts', async (ctx) => {
    const validate = ajv.compile(policyPayoutsSchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return
    }

    const policyIds = ctx.request.body;
    const payouts = await policyService.getAllPayouts(policyIds);

    ctx.ok(payouts)
  })

};

const applyPolicySchema = {
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    amount: { type: 'integer', exclusiveMinimum: 0 },
    carrier: { type: 'string' },
    flightNumber: { type: 'string' },
    origin: {type: 'string'},
    destination: {type: 'string'},
    departsAt: { type: 'string' },
    arrivesAt: { type: 'string' },
    currency: { type: 'string' },
    ethereumAccountId: { type: 'string' },
    stripeSourceId: { type: 'string' },
    couponCode: { type: 'string' },
    txHash: {type: 'string'}
  },
  required: ['firstName', 'lastName', 'email', 'carrier', 'flightNumber', 'departsAt', 'arrivesAt', 'origin',
    'destination', 'amount', 'currency'],
  dependencies: {
    ethereumAccountId: {
      properties: { currency: { type: 'string', enum: ['eth'] } }
    },
    txHash: {
      properties: { currency: { type: 'string', enum: ['eth'] } }
    },
    stripeSourceId: {
      properties: {
        currency: { type: 'string', enum: ['usd', 'eur', 'gbp'] }
      }
    }
  },
  oneOf: [
    { required: ['ethereumAccountId'] },
    { required: ['stripeSourceId'] }
  ],
  additionalProperties: false
};

const createPolicySchema = {
  properties: {
    txHash: { type: 'string' }
  },
  required: ['txHash'],
  additionalProperties: false
};

const checkPolicyJobSchema = {
  properties: {
    txHash: { type: 'string' }
  },
  required: ['txHash'],
  additionalProperties: false
};

const policyPayoutsSchema = {
  type: 'array',
  items: [
    { type: 'string', format: 'uuid' }
  ]
};
