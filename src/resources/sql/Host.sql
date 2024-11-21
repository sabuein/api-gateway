CREATE TABLE Host (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('individual', 'organisation') NOT NULL,
    contactEmail VARCHAR(255),
    contactPhone VARCHAR(15),
    address TEXT,
    website VARCHAR(1024),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    updatedBy INT,
    deletedAt DATETIME,
    deletedBy INT,
    FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (updatedBy) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (deletedBy) REFERENCES User(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Adding an Organisation Host:
INSERT INTO Host (name, type, contactEmail, contactPhone, address, website, createdBy)
VALUES (
    'Tech Conference Ltd.',
    'organisation',
    'contact@techconf.com',
    '+442071234567',
    '123 Innovation Street, London, UK',
    'https://www.techconf.com',
    1
);

-- Adding an Individual Host:
INSERT INTO Host (name, type, contactEmail, createdBy)
VALUES (
    'Jane Smith',
    'individual',
    'jane.smith@gmail.com',
    1
);