CREATE TABLE IF NOT EXISTS `session` (
      `sid` VARCHAR(100) NOT NULL PRIMARY KEY,
      `sess` JSON NOT NULL,
      `expire` TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS `IDX_SESSION_EXPIRE` ON `session` (`expire`);

CREATE PROCEDURE IF NOT EXISTS PUT_SESSION(IN p_sid VARCHAR(100), IN p_sess JSON, IN p_expire TIMESTAMP(6))
BEGIN
  DECLARE session_count INT;

  -- Check if the session already exists
  SELECT COUNT(*) INTO session_count FROM `session` WHERE sid = p_sid;

  IF session_count > 0 THEN
    -- Update existing session
    UPDATE `session` SET sess = p_sess, expire = p_expire WHERE sid = p_sid;
  ELSE
    -- Insert new session
    INSERT INTO `session` (sid, sess, expire) VALUES (p_sid, p_sess, p_expire);
  END IF;
END;