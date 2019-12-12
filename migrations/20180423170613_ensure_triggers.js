const { onUpdateTrigger } = require('../knexfile');
const tables = [
  'policies',
  'customers',
  'internal_events'
];

exports.up = function (db, Promise) {
  return Promise.all(
    tables.map(t => db.raw(onUpdateTrigger.down(t)))
  ).then(() => {
    return Promise.all(
      tables.map(t => db.raw(onUpdateTrigger.up(t)))
    )
  })
};

exports.down = function (db, Promise) {
  return Promise.all(
    tables.map(t => db.raw(onUpdateTrigger.down(t)))
  )
};
