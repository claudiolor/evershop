const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE cms_page (
        cms_page_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
        layout VARCHAR(20) NOT NULL,
        status TINYINT(1) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY CMS_PAGE_UUID (uuid)
    )`
    );

    // Create cms_page_description table
    await execute(
    connection,
    `CREATE TABLE cms_page_description (
        cms_page_description_id INT AUTO_INCREMENT PRIMARY KEY,
        cms_page_description_cms_page_id INT,
        url_key VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        content TEXT DEFAULT NULL,
        meta_title VARCHAR(255) DEFAULT NULL,
        meta_keywords VARCHAR(255) DEFAULT NULL,
        meta_description TEXT DEFAULT NULL,
        UNIQUE KEY PAGE_ID_UNIQUE (cms_page_description_cms_page_id),
        UNIQUE KEY URL_KEY_UNIQUE (url_key),
        CONSTRAINT FK_CMS_PAGE_DESCRIPTION FOREIGN KEY (cms_page_description_cms_page_id) REFERENCES cms_page (cms_page_id) ON DELETE CASCADE ON UPDATE CASCADE
    )`
    );
};
