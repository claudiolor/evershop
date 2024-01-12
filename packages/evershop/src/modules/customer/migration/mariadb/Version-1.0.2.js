const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS customer_group (
        customer_group_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        group_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
  );

  // Add default customer group
  await execute(
    connection,
    "INSERT INTO customer_group ( group_name ) VALUES ('Default')"
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS customer (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        status TINYINT(1) NOT NULL DEFAULT 1,
        group_id INT DEFAULT 1,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(60) NOT NULL,
        full_name VARCHAR(150) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY EMAIL_UNIQUE (email),
        UNIQUE KEY CUSTOMER_UUID_UNIQUE (uuid),
        CONSTRAINT FK_CUSTOMER_GROUP FOREIGN KEY (group_id) REFERENCES customer_group (customer_group_id) ON DELETE SET NULL
      )`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS customer_address (
        customer_address_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        customer_id INT NOT NULL,
        full_name VARCHAR(150) DEFAULT NULL,
        telephone VARCHAR(40) DEFAULT NULL,
        address_1 VARCHAR(255) DEFAULT NULL,
        address_2 VARCHAR(255) DEFAULT NULL,
        postcode VARCHAR(7) DEFAULT NULL,
        city VARCHAR(40) DEFAULT NULL,
        province VARCHAR(40) DEFAULT NULL,
        country VARCHAR(40) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_default SMALLINT DEFAULT NULL,
        UNIQUE KEY CUSTOMER_ADDRESS_UUID_UNIQUE (uuid),
        INDEX FK_CUSTOMER_ADDRESS (customer_id),
        CONSTRAINT FK_CUSTOMER_ADDRESS FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE CASCADE
      )`
  );

  // Prevent deleting a default customer group
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS PREVENT_DELETING_THE_DEFAULT_CUSTOMER_GROUP
    BEFORE DELETE ON customer_group
    FOR EACH ROW
    BEGIN
        IF OLD.customer_group_id = 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot delete default customer group';
        END IF;
    END`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS reset_password_token (
      reset_password_token_id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX FK_RESET_PASSWORD_TOKEN_CUSTOMER (customer_id),
      CONSTRAINT FK_RESET_PASSWORD_TOKEN_CUSTOMER FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE CASCADE
    )`
  );
};
