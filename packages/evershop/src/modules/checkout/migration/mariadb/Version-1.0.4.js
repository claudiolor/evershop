const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS shipping_zone (
          shipping_zone_id INT AUTO_INCREMENT PRIMARY KEY,
          uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
          name VARCHAR(40) NOT NULL,
          country VARCHAR(40) NOT NULL,
          UNIQUE KEY SHIPPING_ZONE_UUID_UNIQUE (uuid)
        )`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS cart (
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        sid VARCHAR(255) DEFAULT NULL,
        currency VARCHAR(3) NOT NULL,
        customer_id INT DEFAULT NULL,
        customer_group_id SMALLINT DEFAULT NULL,
        customer_email VARCHAR(100) DEFAULT NULL,
        customer_full_name VARCHAR(150) DEFAULT NULL,
        user_ip VARCHAR(40) DEFAULT NULL,
        status BOOLEAN NOT NULL DEFAULT FALSE,
        coupon VARCHAR(30) DEFAULT NULL,
        shipping_fee_excl_tax DECIMAL(12,2) DEFAULT NULL,
        shipping_fee_incl_tax DECIMAL(12,2) DEFAULT NULL,
        discount_amount DECIMAL(12,2) DEFAULT NULL,
        sub_total DECIMAL(12,2) NOT NULL,
        sub_total_incl_tax DECIMAL(12,2) NOT NULL,
        total_qty INT NOT NULL,
        total_weight DECIMAL(12,2) DEFAULT NULL,
        tax_amount DECIMAL(12,2) NOT NULL,
        grand_total DECIMAL(12,2) NOT NULL,
        shipping_method VARCHAR(30) DEFAULT NULL,
        shipping_method_name VARCHAR(30) DEFAULT NULL,
        shipping_zone_id INT DEFAULT NULL,
        shipping_address_id INT DEFAULT NULL,
        payment_method VARCHAR(30) DEFAULT NULL,
        payment_method_name VARCHAR(30) DEFAULT NULL,
        billing_address_id INT DEFAULT NULL,
        shipping_note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY CART_UUID_UNIQUE (uuid),
        CONSTRAINT FK_CART_SHIPPING_ZONE FOREIGN KEY (shipping_zone_id) REFERENCES shipping_zone (shipping_zone_id) ON DELETE SET NULL
      )`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS cart_address (
        cart_address_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        full_name VARCHAR(150) DEFAULT NULL,
        postcode VARCHAR(7) DEFAULT NULL,
        telephone VARCHAR(40) DEFAULT NULL,
        country VARCHAR(40) DEFAULT NULL,
        province VARCHAR(40) DEFAULT NULL,
        city VARCHAR(40) DEFAULT NULL,
        address_1 VARCHAR(255) DEFAULT NULL,
        address_2 VARCHAR(255) DEFAULT NULL,
        CONSTRAINT CART_ADDRESS_UUID_UNIQUE UNIQUE (uuid)
      )`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS cart_item (
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        product_sku VARCHAR(20) NOT NULL,
        product_name TEXT NOT NULL,
        thumbnail VARCHAR(255) DEFAULT NULL,
        product_weight DECIMAL(12,2) DEFAULT NULL,
        product_price DECIMAL(12,2) NOT NULL,
        product_price_incl_tax DECIMAL(12,2) NOT NULL,
        qty INT NOT NULL,
        final_price DECIMAL(12,2) NOT NULL,
        final_price_incl_tax DECIMAL(12,2) NOT NULL,
        tax_percent DECIMAL(12,2) NOT NULL,
        tax_amount DECIMAL(12,2) NOT NULL,
        discount_amount DECIMAL(12,2) NOT NULL,
        sub_total DECIMAL(12,2) NOT NULL,
        total DECIMAL(12,2) NOT NULL,
        variant_group_id INT DEFAULT NULL,
        variant_options TEXT DEFAULT NULL,
        product_custom_options TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY CART_ITEM_UUID_UNIQUE (uuid),
        CONSTRAINT FK_CART_ITEM FOREIGN KEY (cart_id) REFERENCES cart (cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT FK_CART_ITEM_PRODUCT FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE ON UPDATE NO ACTION
      )`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_CART_ITEM ON cart_item (cart_id)`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_CART_ITEM_PRODUCT ON cart_item (product_id)`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS \`order\` (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        integration_order_id VARCHAR(100) DEFAULT NULL,
        sid VARCHAR(255) DEFAULT NULL,
        order_number VARCHAR(10) NOT NULL,
        cart_id INT NOT NULL,
        currency VARCHAR(3) NOT NULL,
        customer_id INT DEFAULT NULL,
        customer_email VARCHAR(100) DEFAULT NULL,
        customer_full_name VARCHAR(150) DEFAULT NULL,
        user_ip VARCHAR(40) DEFAULT NULL,
        user_agent VARCHAR(50) DEFAULT NULL,
        coupon VARCHAR(30) DEFAULT NULL,
        shipping_fee_excl_tax DECIMAL(12,2) DEFAULT NULL,
        shipping_fee_incl_tax DECIMAL(12,2) DEFAULT NULL,
        discount_amount DECIMAL(12,2) DEFAULT NULL,
        sub_total DECIMAL(12,2) NOT NULL,
        sub_total_incl_tax DECIMAL(12,2) NOT NULL,
        total_qty INT NOT NULL,
        total_weight DECIMAL(12,2) DEFAULT NULL,
        tax_amount DECIMAL(12,2) NOT NULL,
        shipping_note TEXT DEFAULT NULL,
        grand_total DECIMAL(12,2) NOT NULL,
        shipping_method VARCHAR(30) DEFAULT NULL,
        shipping_method_name VARCHAR(30) DEFAULT NULL,
        shipping_address_id INT DEFAULT NULL,
        payment_method VARCHAR(30) DEFAULT NULL,
        payment_method_name VARCHAR(30) DEFAULT NULL,
        billing_address_id INT DEFAULT NULL,
        shipment_status VARCHAR(30) DEFAULT NULL,
        payment_status VARCHAR(30) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY ORDER_UUID_UNIQUE (uuid),
        UNIQUE KEY ORDER_NUMBER_UNIQUE (order_number)
      )`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS order_activity (
            order_activity_id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
            order_activity_order_id INT NOT NULL,
            comment TEXT NOT NULL,
            customer_notified TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY ORDER_ACTIVITY_UUID_UNIQUE (uuid),
            CONSTRAINT FK_ORDER_ACTIVITY FOREIGN KEY (order_activity_order_id) REFERENCES \`order\` (order_id) ON DELETE CASCADE
          )`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_ORDER_ACTIVITY ON order_activity (order_activity_order_id)`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS order_address (
            order_address_id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
            full_name VARCHAR(100) DEFAULT NULL,
            postcode VARCHAR(7) DEFAULT NULL,
            telephone VARCHAR(40) DEFAULT NULL,
            country VARCHAR(40) DEFAULT NULL,
            province VARCHAR(40) DEFAULT NULL,
            city VARCHAR(40) DEFAULT NULL,
            address_1 VARCHAR(255) DEFAULT NULL,
            address_2 VARCHAR(255) DEFAULT NULL,
            UNIQUE KEY ORDER_ADDRESS_UUID_UNIQUE (uuid)
          )`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS order_item (
            order_item_id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
            order_item_order_id INT NOT NULL,
            product_id INT NOT NULL,
            referer INT DEFAULT NULL,
            product_sku VARCHAR(20) NOT NULL,
            product_name TEXT NOT NULL,
            thumbnail VARCHAR(255) DEFAULT NULL,
            product_weight DECIMAL(12,2) DEFAULT NULL,
            product_price DECIMAL(12,2) NOT NULL,
            product_price_incl_tax DECIMAL(12,2) NOT NULL,
            qty INT NOT NULL,
            final_price DECIMAL(12,2) NOT NULL,
            final_price_incl_tax DECIMAL(12,2) NOT NULL,
            tax_percent DECIMAL(12,2) NOT NULL,
            tax_amount DECIMAL(12,2) NOT NULL,
            discount_amount DECIMAL(12,2) NOT NULL,
            sub_total DECIMAL(12,2) NOT NULL,
            total DECIMAL(12,2) NOT NULL,
            variant_group_id INT DEFAULT NULL,
            variant_options TEXT DEFAULT NULL,
            product_custom_options TEXT DEFAULT NULL,
            requested_data TEXT DEFAULT NULL,
            UNIQUE KEY ORDER_ITEM_UUID_UNIQUE (uuid),
            CONSTRAINT FK_ORDER FOREIGN KEY (order_item_order_id) REFERENCES \`order\` (order_id) ON DELETE CASCADE
          )`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_ORDER ON order_item (order_item_order_id)`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS payment_transaction (
            payment_transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
            payment_transaction_order_id INT NOT NULL,
            transaction_id VARCHAR(100) DEFAULT NULL,
            transaction_type VARCHAR(40) NOT NULL,
            amount DECIMAL(12,2) NOT NULL,
            parent_transaction_id VARCHAR(255) DEFAULT NULL,
            payment_action VARCHAR(40) DEFAULT NULL,
            additional_information TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY PAYMENT_TRANSACTION_UUID_UNIQUE (uuid),
            UNIQUE KEY UNQ_PAYMENT_TRANSACTION_ID_ORDER_ID (payment_transaction_order_id, transaction_id),
            CONSTRAINT FK_PAYMENT_TRANSACTION_ORDER FOREIGN KEY (payment_transaction_order_id) REFERENCES \`order\` (order_id) ON DELETE CASCADE ON UPDATE CASCADE
          )`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_PAYMENT_TRANSACTION_ORDER ON payment_transaction (payment_transaction_order_id)`
    );

    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS shipment (
            shipment_id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
            shipment_order_id INT NOT NULL,
            carrier_name VARCHAR(40) DEFAULT NULL,
            tracking_number VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY SHIPMENT_UUID_UNIQUE (uuid),
            CONSTRAINT FK_ORDER_SHIPMENT FOREIGN KEY (shipment_order_id) REFERENCES \`order\` (order_id) ON DELETE CASCADE
          )`
    );
    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_ORDER_SHIPMENT ON shipment (shipment_order_id)`
    );

    // Reduce product stock when order is placed if product manage stock is true
    await execute(
        connection,
        `CREATE TRIGGER IF NOT EXISTS TRIGGER_AFTER_INSERT_ORDER_ITEM AFTER INSERT ON order_item
        FOR EACH ROW
        BEGIN
            UPDATE product_inventory SET qty = qty - NEW.qty WHERE product_inventory_product_id = NEW.product_id AND manage_stock = 1;
        END`
    );

    /**
     * FROM version 1.0.1
     */
    await execute(
        connection,
        `CREATE TABLE IF NOT EXISTS shipping_zone_province (
          shipping_zone_province_id INT AUTO_INCREMENT PRIMARY KEY,
          uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
          zone_id INT NOT NULL,
          province VARCHAR(40) NOT NULL,
          UNIQUE KEY SHIPPING_ZONE_PROVINCE_UUID_UNIQUE (uuid),
          UNIQUE KEY SHIPPING_ZONE_PROVINCE_PROVINCE_UNIQUE (province),
          CONSTRAINT FK_SHIPPING_ZONE_PROVINCE FOREIGN KEY (zone_id) REFERENCES shipping_zone (shipping_zone_id) ON DELETE CASCADE
        )`
    );


    await execute(
        connection,
        `CREATE INDEX IF NOT EXISTS FK_SHIPPING_ZONE_PROVINCE ON shipping_zone_province (zone_id)`
    );

    await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS shipping_method (
        shipping_method_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        name VARCHAR(30) NOT NULL,
        UNIQUE KEY SHIPPING_METHOD_UUID_UNIQUE (uuid),
        UNIQUE KEY SHIPPING_METHOD_NAME_UNIQUE (name)
    )`
    );

    // Create shipping_zone_method table
    await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS shipping_zone_method (
        shipping_zone_method_id INT AUTO_INCREMENT PRIMARY KEY,
        method_id INT NOT NULL,
        zone_id INT NOT NULL,
        is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        cost DECIMAL(12,2) DEFAULT NULL,
        calculate_api VARCHAR(255) DEFAULT NULL,
        condition_type VARCHAR(10) DEFAULT NULL,
        max DECIMAL(12,2) DEFAULT NULL,
        min DECIMAL(12,2) DEFAULT NULL,
        UNIQUE KEY METHOD_ZONE_UNIQUE (zone_id, method_id),
        CONSTRAINT FK_ZONE_METHOD FOREIGN KEY (zone_id) REFERENCES shipping_zone (shipping_zone_id) ON DELETE CASCADE,
        CONSTRAINT FK_METHOD_ZONE FOREIGN KEY (method_id) REFERENCES shipping_method (shipping_method_id) ON DELETE CASCADE
    )`
    );
};
