exports.up = knex => {
  return Promise.all([
    knex('policies').whereNull('contractsVersion').update({ contractsVersion: 'Not Specified' }),
    knex('policies').whereNull('apiVersion').update({ apiVersion: 'Not Specified' })
  ])
};

exports.down = () => {
  return Promise.resolve([])
};
