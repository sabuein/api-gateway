CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role ENUM('admin', 'user', 'moderator', 'guest') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    lastLogin DATETIME,
    failedLoginAttempts INT DEFAULT 0,
    settings TEXT;
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

-- Creating an Admin User:
INSERT INTO User (username, email, password, firstName, lastName, role)
VALUES (
    'sabuein',
    'sabuein@gmail.com',
    '0123456789',
    'Salaheddin',
    'AbuEin',
    'admin'
);

-- Creating a New User:
INSERT INTO User (username, email, password, firstName, lastName, role)
VALUES (
    'aabuein',
    'abuein@msn.com',
    '0123456789',
    'AlMutasemBellah',
    'AbuEin',
    'user'
);
