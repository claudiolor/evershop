const { execute, insert } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {

  // Create attribute table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`attribute\` (
            \`attribute_id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
            \`attribute_code\` VARCHAR(100) NOT NULL,
            \`attribute_name\` VARCHAR(100) NOT NULL,
            \`type\` VARCHAR(100) NOT NULL,
            \`is_required\` TINYINT(1) NOT NULL DEFAULT FALSE,
            \`display_on_frontend\` TINYINT(1) NOT NULL DEFAULT FALSE,
            \`sort_order\` INT NOT NULL DEFAULT 0,
            \`is_filterable\` TINYINT(1) NOT NULL DEFAULT FALSE,
            CONSTRAINT \`ATTRIBUTE_CODE_UNIQUE\` UNIQUE (\`attribute_code\`),
            CONSTRAINT \`ATTRIBUTE_CODE_UUID_UNIQUE\` UNIQUE (\`uuid\`)
          );`
  );

  // Create the table for the options of each of the attributes
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`attribute_option\` (
            \`attribute_option_id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
            \`attribute_id\` INT NOT NULL,
            \`attribute_code\` VARCHAR(100) NOT NULL,
            \`option_text\` VARCHAR(255) NOT NULL,
            CONSTRAINT \`ATTRIBUTE_OPTION_UUID_UNIQUE\` UNIQUE (\`uuid\`),
            CONSTRAINT \`FK_ATTRIBUTE_OPTION\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE
          );`
  );

  await execute(
    connection,
    `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_OPTION\` ON \`attribute_option\` (\`attribute_id\`)`
  );

  // Create attribute_group table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`attribute_group\` (
            \`attribute_group_id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
            \`group_name\` VARCHAR(50) NOT NULL,
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT \`ATTRIBUTE_GROUP_UUID_UNIQUE\` UNIQUE (\`uuid\`)
        )`
  );

  // Insert the default group to the attribute groups
  const defaultGroup = await insert('attribute_group')
    .given({ group_name: 'Default' })
    .execute(connection);

  // Create attribute_group_link table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`attribute_group_link\` (
        \`attribute_group_link_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`attribute_id\` INT NOT NULL,
        \`group_id\` INT NOT NULL,
        CONSTRAINT \`ATTRIBUTE_GROUP_LINK_UNIQUE\` UNIQUE (\`attribute_id\`, \`group_id\`),
        CONSTRAINT \`FK_ATTRIBUTE_LINK\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_GROUP_LINK\` FOREIGN KEY (\`group_id\`) REFERENCES \`attribute_group\` (\`attribute_group_id\`) ON DELETE CASCADE
        )`
  );

  // Create indexes for attribute_group_link table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_GROUP_LINK\` ON \`attribute_group_link\` (\`group_id\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_LINK\` ON \`attribute_group_link\` (\`attribute_id\`)`);

  // Create variant_group table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`variant_group\` (
        \`variant_group_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
        \`attribute_group_id\` INT NOT NULL,
        \`attribute_one\` INT DEFAULT NULL,
        \`attribute_two\` INT DEFAULT NULL,
        \`attribute_three\` INT DEFAULT NULL,
        \`attribute_four\` INT DEFAULT NULL,
        \`attribute_five\` INT DEFAULT NULL,
        \`visibility\` BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT \`VARIANT_GROUP_UUID_UNIQUE\` UNIQUE (\`uuid\`),
        CONSTRAINT \`FK_ATTRIBUTE_GROUP_VARIANT\` FOREIGN KEY (\`attribute_group_id\`) REFERENCES \`attribute_group\` (\`attribute_group_id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_ATTRIBUTE_VARIANT_FIVE\` FOREIGN KEY (\`attribute_five\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_ATTRIBUTE_VARIANT_FOUR\` FOREIGN KEY (\`attribute_four\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_ATTRIBUTE_VARIANT_ONE\` FOREIGN KEY (\`attribute_one\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_ATTRIBUTE_VARIANT_THREE\` FOREIGN KEY (\`attribute_three\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_ATTRIBUTE_VARIANT_TWO\` FOREIGN KEY (\`attribute_two\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        )`
  );

  // Create indexes for variant_group table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VARIANT_ONE\` ON \`variant_group\` (\`attribute_one\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VARIANT_TWO\` ON \`variant_group\` (\`attribute_two\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VARIANT_THREE\` ON \`variant_group\` (\`attribute_three\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VARIANT_FOUR\` ON \`variant_group\` (\`attribute_four\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VARIANT_FIVE\` ON \`variant_group\` (\`attribute_five\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_GROUP_VARIANT\` ON \`variant_group\` (\`attribute_group_id\`)`);


  // Create category table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`category\` (
        \`category_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
        \`status\` TINYINT(1) NOT NULL,
        \`parent_id\` INT DEFAULT NULL,
        \`include_in_nav\` BOOLEAN NOT NULL,
        \`position\` SMALLINT DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT \`CATEGORY_UUID_UNIQUE\` UNIQUE (\`uuid\`),
        CONSTRAINT \`PARENT_CATEGORY\` FOREIGN KEY (\`parent_id\`) REFERENCES \`category\` (\`category_id\`) ON DELETE CASCADE
      )`
  );

  // Create product table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`product\` (
        \`product_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
        \`type\` VARCHAR(20) NOT NULL DEFAULT 'simple',
        \`variant_group_id\` INT DEFAULT NULL,
        \`visibility\` BOOLEAN NOT NULL DEFAULT TRUE,
        \`group_id\` INT DEFAULT 1,
        \`category_id\` INT DEFAULT NULL,
        \`sku\` VARCHAR(20) NOT NULL,
        \`price\` DECIMAL(12, 2) NOT NULL,
        \`weight\` DECIMAL(12, 2) DEFAULT NULL,
        \`tax_class\` INT DEFAULT NULL,
        \`status\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT \`PRODUCT_UUID_UNIQUE\` UNIQUE (\`uuid\`),
        CONSTRAINT \`PRODUCT_SKU_UNIQUE\` UNIQUE (\`sku\`),
        CONSTRAINT \`UNSIGNED_PRICE\` CHECK (price >= 0),
        CONSTRAINT \`UNSIGNED_WEIGHT\` CHECK (weight >= 0),
        CONSTRAINT \`FK_PRODUCT_ATTRIBUTE_GROUP\` FOREIGN KEY (\`group_id\`) REFERENCES \`attribute_group\` (\`attribute_group_id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_PRODUCT_VARIANT_GROUP\` FOREIGN KEY (\`variant_group_id\`) REFERENCES \`variant_group\` (\`variant_group_id\`) ON DELETE SET NULL,
        CONSTRAINT \`PRODUCT_CATEGORY_ID_CONSTRAINT\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\` (\`category_id\`) ON DELETE SET NULL
        )`
  );

  // Create product_attribute_value_index table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`product_attribute_value_index\` (
        \`product_attribute_value_index_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`product_id\` INT NOT NULL,
        \`attribute_id\` INT NOT NULL,
        \`option_id\` INT DEFAULT NULL,
        \`option_text\` TEXT DEFAULT NULL,
        CONSTRAINT \`OPTION_VALUE_UNIQUE\` UNIQUE (\`product_id\`, \`attribute_id\`, \`option_id\`),
        CONSTRAINT \`FK_ATTRIBUTE_OPTION_VALUE_LINK\` FOREIGN KEY (\`option_id\`) REFERENCES \`attribute_option\` (\`attribute_option_id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_ATTRIBUTE_VALUE_LINK\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attribute\` (\`attribute_id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_PRODUCT_ATTRIBUTE_LINK\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\` (\`product_id\`) ON DELETE CASCADE
      )`
  );

  // Create indexes for product_attribute_value_index table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_VALUE_LINK\` ON \`product_attribute_value_index\` (\`attribute_id\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_ATTRIBUTE_OPTION_VALUE_LINK\` ON \`product_attribute_value_index\` (\`option_id\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_PRODUCT_ATTRIBUTE_LINK\` ON \`product_attribute_value_index\` (\`product_id\`)`);


  // Create product_description table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`product_description\` (
        \`product_description_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`product_description_product_id\` INT NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`short_description\` TEXT DEFAULT NULL,
        \`url_key\` TEXT NOT NULL,
        \`meta_title\` TEXT DEFAULT NULL,
        \`meta_description\` TEXT DEFAULT NULL,
        \`meta_keywords\` TEXT DEFAULT NULL,
        CONSTRAINT \`PRODUCT_ID_UNIQUE\` UNIQUE (\`product_description_product_id\`),
        CONSTRAINT \`PRODUCT_URL_KEY_UNIQUE\` UNIQUE (\`url_key\`),
        CONSTRAINT \`FK_PRODUCT_DESCRIPTION\` FOREIGN KEY (\`product_description_product_id\`) REFERENCES \`product\` (\`product_id\`) ON DELETE CASCADE
      )`
  );

  // Create index for product_description table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_PRODUCT_DESCRIPTION\` ON \`product_description\` (\`product_description_product_id\`)`);

  // Create product_image table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`product_image\` (
        \`product_image_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`product_image_product_id\` INT NOT NULL,
        \`origin_image\` VARCHAR(255) NOT NULL,
        \`thumb_image\` VARCHAR(255),
        \`listing_image\` VARCHAR(255),
        \`single_image\` VARCHAR(255),
        \`is_main\` TINYINT(1) DEFAULT 0,
        CONSTRAINT \`FK_PRODUCT_IMAGE_LINK\` FOREIGN KEY (\`product_image_product_id\`) REFERENCES \`product\` (\`product_id\`) ON DELETE CASCADE
      )`
  );

  // Create index for product_image table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_PRODUCT_IMAGE_LINK\` ON \`product_image\` (\`product_image_product_id\`)`);

  // Create category_description table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`category_description\` (
        \`category_description_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`category_description_category_id\` INT NOT NULL,
        \`name\` VARCHAR(50) NOT NULL,
        \`short_description\` TEXT DEFAULT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`image\` VARCHAR(255) DEFAULT NULL,
        \`meta_title\` TEXT DEFAULT NULL,
        \`meta_keywords\` TEXT DEFAULT NULL,
        \`meta_description\` TEXT DEFAULT NULL,
        \`url_key\` VARCHAR(255) NOT NULL,
        CONSTRAINT \`CATEGORY_ID_UNIQUE\` UNIQUE (\`category_description_category_id\`),
        CONSTRAINT \`CATEGORY_URL_KEY_UNIQUE\` UNIQUE (\`url_key\`),
        CONSTRAINT \`FK_CATEGORY_DESCRIPTION\` FOREIGN KEY (\`category_description_category_id\`) REFERENCES \`category\` (\`category_id\`) ON DELETE CASCADE
      )`
  );

  // Create index for category_description table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_CATEGORY_DESCRIPTION\` ON \`category_description\` (\`category_description_category_id\`)`);

  // Create 3 default categories, Kids, Men, Women
  const kids = await insert('category')
    .given({
      status: 1,
      include_in_nav: 1
    })
    .execute(connection);

  await insert('category_description')
    .given({
      category_description_category_id: kids.insertId,
      name: 'Kids',
      url_key: 'kids',
      meta_title: 'Kids',
      meta_description: 'Kids',
      meta_keywords: 'Kids',
      description: 'Kids'
    })
    .execute(connection);

  const women = await insert('category')
    .given({
      status: 1,
      include_in_nav: 1
    })
    .execute(connection);

  await insert('category_description')
    .given({
      category_description_category_id: women.insertId,
      name: 'Women',
      url_key: 'women',
      meta_title: 'Women',
      meta_description: 'Women',
      meta_keywords: 'Women',
      description: 'Women'
    })
    .execute(connection);

  const men = await insert('category')
    .given({
      status: 1,
      include_in_nav: 1
    })
    .execute(connection);

  await insert('category_description')
    .given({
      category_description_category_id: men.insertId,
      name: 'Men',
      url_key: 'men',
      meta_title: 'Men',
      meta_description: 'Men',
      meta_keywords: 'Men',
      description: 'Men'
    })
    .execute(connection);

  // Create collection table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`collection\` (
        \`collection_id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
        \`name\` VARCHAR(50) NOT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`code\` VARCHAR(75) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT \`COLLECTION_CODE_UNIQUE\` UNIQUE (\`code\`),
        CONSTRAINT \`COLLECTION_UUID_UNIQUE\` UNIQUE (\`uuid\`)
      )`
  );

  // Create product_collection table
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`product_collection\` (
      \`product_collection_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`collection_id\` INT NOT NULL,
      \`product_id\` INT NOT NULL,
      CONSTRAINT \`PRODUCT_COLLECTION_UNIQUE\` UNIQUE (\`collection_id\`, \`product_id\`),
      CONSTRAINT \`FK_COLLECTION_PRODUCT_LINK\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\` (\`collection_id\`) ON DELETE CASCADE,
      CONSTRAINT \`FK_PRODUCT_COLLECTION_LINK\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\` (\`product_id\`) ON DELETE CASCADE
    )`
  );

  // Create indexes for product_collection table
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_COLLECTION_PRODUCT_LINK\` ON \`product_collection\` (\`collection_id\`)`);
  await execute(connection, `CREATE INDEX IF NOT EXISTS \`FK_PRODUCT_COLLECTION_LINK\` ON \`product_collection\` (\`product_id\`)`);

  /* CREATE SOME TRIGGERS */
  // Prevent deleting a default attribute group
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS \`PREVENT_DELETING_THE_DEFAULT_ATTRIBUTE_GROUP\`
            BEFORE DELETE ON \`attribute_group\`
            FOR EACH ROW
            BEGIN
                IF OLD.attribute_group_id = 1 THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot delete default attribute group';
                END IF;
            END`
  );

  // Prevent changing product attribute group if product has variants 
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS \`PREVENT_CHANGING_ATTRIBUTE_GROUP_OF_PRODUCT_WITH_VARIANTS\`
        BEFORE UPDATE ON \`product\`
        FOR EACH ROW
        BEGIN
        IF OLD.group_id != NEW.group_id AND OLD.variant_group_id IS NOT NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot change attribute group of product with variants';
        END IF;
    END;`
  );

  // Delete product attribute value and variant group when attribute is removed from group
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS \`TRIGGER_AFTER_REMOVE_ATTRIBUTE_FROM_GROUP\` AFTER DELETE ON \`attribute_group_link\`
     FOR EACH ROW 
     BEGIN
        DELETE FROM product_attribute_value_index WHERE product_attribute_value_index.attribute_id = OLD.attribute_id AND product_attribute_value_index.product_id IN (SELECT product.product_id FROM product WHERE product.group_id = OLD.group_id);
        DELETE FROM variant_group WHERE variant_group.attribute_group_id = OLD.group_id AND (variant_group.attribute_one = OLD.attribute_id OR variant_group.attribute_two = OLD.attribute_id OR variant_group.attribute_three = OLD.attribute_id OR variant_group.attribute_four = OLD.attribute_id OR variant_group.attribute_five = OLD.attribute_id);
     END`
  );

  // Update product attribute value option text when option is updated  
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS \`TRIGGER_AFTER_ATTRIBUTE_OPTION_UPDATE\` AFTER UPDATE ON \`attribute_option\` FOR EACH ROW
    BEGIN
        UPDATE \`product_attribute_value_index\` SET \`option_text\` = NEW.option_text
        WHERE \`product_attribute_value_index\`.option_id = NEW.attribute_option_id AND \`product_attribute_value_index\`.attribute_id = NEW.attribute_id;
    END`
  );

  // Delete product attribute value index after option is deleted 
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS \`TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION\` AFTER DELETE ON \`attribute_option\` FOR EACH ROW
    BEGIN
        DELETE FROM \`product_attribute_value_index\` WHERE \`product_attribute_value_index\`.option_id = OLD.attribute_option_id AND \`product_attribute_value_index\`.\`attribute_id\` = OLD.attribute_id;
    END`
  );

  // Create delete_variant_group_after_attribute_type_changed function
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS TRIGGER_AFTER_UPDATE_ATTRIBUTE AFTER UPDATE ON attribute FOR EACH ROW
      BEGIN
        IF (OLD.type = 'select' AND NEW.type <> 'select') THEN
          DELETE FROM \`variant_group\` WHERE (\`variant_group\`.attribute_one = OLD.attribute_id OR \`variant_group\`.attribute_two = OLD.attribute_id OR \`variant_group\`.attribute_three = OLD.attribute_id OR \`variant_group\`.attribute_four = OLD.attribute_id OR \`variant_group\`.attribute_five = OLD.attribute_id);
        END IF;
      END`
  );

  /**
   * From version 1.0.1
   */
  // Update product attribute index, variant group visibility and product visibility after product is updated
  await execute(
    connection,
    `CREATE TRIGGER IF NOT EXISTS TRIGGER_PRODUCT_AFTER_UPDATE AFTER UPDATE ON product
     FOR EACH ROW
     BEGIN
     DELETE FROM product_attribute_value_index
     WHERE product_attribute_value_index.product_id = NEW.product_id 
       AND product_attribute_value_index.attribute_id NOT IN (SELECT attribute_group_link.attribute_id FROM attribute_group_link WHERE attribute_group_link.group_id = NEW.group_id);
     
     UPDATE variant_group
     SET visibility = COALESCE((SELECT product.status FROM product WHERE product.variant_group_id = NEW.variant_group_id AND product.status = 1 GROUP BY product.variant_group_id), 0)
     WHERE variant_group.variant_group_id = NEW.variant_group_id;
     END`
  );

  /**
   * From version 1.0.2
   */
  await execute(
    connection,
    `CREATE TABLE url_rewrite (
    url_rewrite_id INT AUTO_INCREMENT PRIMARY KEY,
    language VARCHAR(2) NOT NULL DEFAULT 'en',
    request_path VARCHAR(255) NOT NULL,
    target_path VARCHAR(255) NOT NULL,
    entity_uuid VARCHAR(128) DEFAULT NULL,
    entity_type VARCHAR(50) DEFAULT NULL,
    CONSTRAINT URL_REWRITE_PATH_UNIQUE UNIQUE (language, entity_uuid)
  )`
  );

  // Create `product_inventory` table and copy data
  await execute(
    connection,
    `CREATE TABLE product_inventory (
    product_inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_inventory_product_id INT NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    manage_stock BOOLEAN NOT NULL DEFAULT false,
    stock_availability BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT PRODUCT_INVENTORY_PRODUCT_ID_CONSTRAINT FOREIGN KEY (product_inventory_product_id) REFERENCES product (product_id) ON DELETE CASCADE,
    CONSTRAINT PRODUCT_INVENTORY_PRODUCT_ID_UNIQUE UNIQUE (product_inventory_product_id)
  )`
  );

}