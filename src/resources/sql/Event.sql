CREATE TABLE Event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    [description] TEXT,
    hostId INT,
    [location] VARCHAR(1024),
    isPinned BOOLEAN DEFAULT FALSE,
    eventType ENUM('public', 'private', 'followers') DEFAULT 'public',
    [status] ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    ticketPrice DECIMAL(5, 2),
    poster VARCHAR(1024) DEFAULT '/public/no-image-placeholder.jpg',
    startTime DATETIME,
    endTime DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    updatedBy INT,
    deletedAt DATETIME,
    deletedBy INT,
    FOREIGN KEY (hostId) REFERENCES Host(id) ON DELETE SET NULL,
    FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (updatedBy) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (deletedBy) REFERENCES User(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO Event (title, [description], hostId, [location], startTime, endTime, createdBy) 
VALUES (
    'Community Meetup',
    'A casual meetup for the local community.',
    1,
    '123 Main Street, Cityville',
    '2024-12-01 10:00:00',
    '2024-12-01 14:00:00',
    1
);