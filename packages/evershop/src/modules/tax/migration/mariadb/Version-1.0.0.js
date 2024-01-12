const { execute, insert } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS tax_class (
      tax_class_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
      name VARCHAR(40) NOT NULL,
      UNIQUE INDEX TAX_CLASS_UUID_UNIQUE (uuid)
    )`
  );

  // Create default tax class
  const taxClass = await insert('tax_class')
    .given({
      name: 'Taxable Goods'
    })
    .execute(connection);

  // Add a constraint to product table
  await execute(
    connection,
    `ALTER TABLE product ADD CONSTRAINT FK_TAX_CLASS FOREIGN KEY (tax_class) REFERENCES tax_class (tax_class_id) ON DELETE SET NULL`
  );

  // Prevent deleting the default tax class
  await execute(
    connection,
    `CREATE TRIGGER PREVENT_DELETING_THE_DEFAULT_TAX_CLASS
      BEFORE DELETE ON tax_class
      FOR EACH ROW
      BEGIN
        IF OLD.tax_class_id = 1 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Cannot delete default tax class';
        END IF;
      END`
  );

  await execute(
    connection,
    `CREATE TABLE tax_rate (
      tax_rate_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
      name VARCHAR(40) NOT NULL,
      tax_class_id INT DEFAULT NULL,
      country VARCHAR(40) NOT NULL DEFAULT '*',
      province VARCHAR(40) NOT NULL DEFAULT '*',
      postcode VARCHAR(7) NOT NULL DEFAULT '*',
      rate DECIMAL(12,2) NOT NULL,
      is_compound TINYINT(1) NOT NULL DEFAULT FALSE,
      priority INT NOT NULL,
      UNIQUE (uuid),
      UNIQUE (priority, tax_class_id),
      FOREIGN KEY (tax_class_id) REFERENCES tax_class (tax_class_id) ON DELETE CASCADE
    )`
  );

  // Create default tax rate for tax class
  await insert('tax_rate')
    .given({
      name: 'Tax',
      tax_class_id: taxClass.insertId,
      country: '*',
      province: '*',
      postcode: '*',
      rate: 0,
      is_compound: false,
      priority: 0
    })
    .execute(connection);
};
