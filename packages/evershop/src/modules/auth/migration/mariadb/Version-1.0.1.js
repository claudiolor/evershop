const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`admin_user\` (
      \`admin_user_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
      \`status\` TINYINT(1) NOT NULL DEFAULT TRUE,
      \`email\` VARCHAR(100) NOT NULL,
      \`password\` VARCHAR(60) NOT NULL,
      \`full_name\` VARCHAR(100),
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`ADMIN_USER_EMAIL_UNIQUE\` UNIQUE (\`email\`),
      CONSTRAINT \`ADMIN_USER_UUID_UNIQUE\` UNIQUE (\`uuid\`));`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`session\` (
      \`sid\` VARCHAR(100) NOT NULL PRIMARY KEY,
      \`sess\` JSON NOT NULL,
      \`expire\` TIMESTAMP(6) NOT NULL
    );`
  );
  
  // Create for storing the sessions
  await execute(
    connection,
    `CREATE PROCEDURE IF NOT EXISTS PUT_SESSION(IN p_sid VARCHAR(100), IN p_sess JSON, IN p_expire TIMESTAMP(6))
    BEGIN
      DECLARE session_count INT;
    
      -- Check if the session already exists
      SELECT COUNT(*) INTO session_count FROM \`session\` WHERE sid = p_sid;
    
      IF session_count > 0 THEN
        -- Update existing session
        UPDATE \`session\` SET sess = p_sess, expire = p_expire WHERE sid = p_sid;
      ELSE
        -- Insert new session
        INSERT INTO \`session\` (sid, sess, expire) VALUES (p_sid, p_sess, p_expire);
      END IF;
    END;`
  );

  await execute(
    connection,
    `CREATE INDEX IF NOT EXISTS \`IDX_SESSION_EXPIRE\` ON \`session\` (\`expire\`);`
  );


};
