exports.up = (db) => {
  return db.raw(`
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW."updatedAt" = now();
        RETURN NEW;  
    END;
    $$ language 'plpgsql';
  `);
};

exports.down = (db) => {
  return db.raw(`
    DROP FUNCTION IF EXISTS on_update_timestamp() RESTRICT;
  `);
};
