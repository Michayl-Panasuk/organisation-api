
CREATE TABLE Client (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    private BOOLEAN DEFAULT (true),
    phone   STRING  NOT NULL,
    address STRING  NOT NULL,
    fax     STRING,
    fio     STRING  NOT NULL
);

CREATE TABLE Typgraphy (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          STRING  NOT NULL,
    address       STRING  NOT NULL,
    phone         STRING  NOT NULL,
    contactPerson STRING  NOT NULL
);

CREATE TABLE Edition (
    number   INTEGER PRIMARY KEY AUTOINCREMENT,
    code     STRING  UNIQUE ON CONFLICT ROLLBACK,
    author   STRING  NOT NULL,
    name     STRING  NOT NULL,
    size     INTEGER NOT NULL
                     CHECK (size > 0),
    quantity INTEGER NOT NULL
                     CHECK (quantity > 0) 
);


CREATE TABLE EditionType (
    type STRING PRIMARY KEY
);

CREATE TABLE PrintOrder (
    number        INTEGER PRIMARY KEY AUTOINCREMENT,
    editionNumber INTEGER REFERENCES Edition (number) ON UPDATE RESTRICT
                          NOT NULL,
    clientId      INTEGER REFERENCES Client (id) ON UPDATE RESTRICT
                          NOT NULL,
    typographyId  INTEGER REFERENCES Typography (id) ON UPDATE RESTRICT
                          NOT NULL,
    editionType   STRING  REFERENCES EditionType (type) ON UPDATE RESTRICT
                          NOT NULL,
    createdAt     TEXT    DEFAULT (DATETIME('now') ),
    completedAt   TEXT,
    completed     BOOLEAN DEFAULT (false),
    responsible   STRING  NOT NULL
);

