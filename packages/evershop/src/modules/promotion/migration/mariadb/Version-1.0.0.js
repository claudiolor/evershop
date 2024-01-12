const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');
// TODO: to migrate
// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS coupon (
      coupon_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
      status TINYINT(1) NOT NULL DEFAULT TRUE,
      description TEXT NOT NULL,
      discount_amount DECIMAL(12,2) NOT NULL,
      free_shipping TINYINT(1) NOT NULL DEFAULT FALSE,
      discount_type VARCHAR(20) NOT NULL DEFAULT '1',
      coupon VARCHAR(30) NOT NULL,
      used_time INT NOT NULL DEFAULT 0,
      target_products JSON DEFAULT NULL,
      \`condition\` JSON DEFAULT NULL,
      user_condition JSON DEFAULT NULL,
      buyx_gety JSON DEFAULT NULL,
      max_uses_time_per_coupon INT DEFAULT NULL,
      max_uses_time_per_customer INT DEFAULT NULL,
      start_date TIMESTAMP DEFAULT NULL,
      end_date TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX COUPON_UUID_UNIQUE (uuid),
      INDEX COUPON_UNIQUE (coupon)
    )`
  );

  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER AFTER INSERT ON \`order\`
    FOR EACH ROW 
    BEGIN
     UPDATE coupon SET used_time = used_time + 1 WHERE coupon = NEW.coupon;
    END;
    `
  );
};
