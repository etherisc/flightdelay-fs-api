exports.up = (knex, Promise) => {
  return knex.schema.table('policies', (table) => {
    table.string('network')
  }).then(() => {
    return Promise.all([
      knex('policies').where('contract', '0x3b11719dbf04b228e6f20944c6771ae676851a61').update({network: '42'}),
      knex('policies').where('contract', '0x5f9605823c32a09bfaeb7e744784705f4b7e2f59').update({network: '1'}),
      knex('policies').where('contract', '0x96874229b94d91c1c2b5a7b93ffc57fddac3278e').update({network: '3'})
    ])
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.table('policies', (table) => {
    table.dropColumns(
      'network'
    )
  })
};
