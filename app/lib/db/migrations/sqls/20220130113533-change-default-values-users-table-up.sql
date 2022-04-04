DROP TABLE IF EXISTS users;
CREATE TABLE users (
     user_id        NUMERIC NOT NULL PRIMARY KEY,
     username       VARCHAR (50) NULL DEFAULT NULL,
     first_name     VARCHAR (50) NULL DEFAULT NULL,
	second_name    VARCHAR (50) NULL DEFAULT NULL,
	phone          VARCHAR (50) NULL DEFAULT NULL,
     active         BOOLEAN NOT NULL DEFAULT TRUE,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
     updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS tracked_phones;
CREATE TABLE tracked_phones (
     user_id        NUMERIC NOT NULL,
	tracked_phone  VARCHAR (50) NULL DEFAULT NULL,
     tracked        BOOLEAN NOT NULL DEFAULT TRUE,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
     updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE statuses (
     status_id        NUMERIC NOT NULL PRIMARY KEY,
     user       VARCHAR (50) NULL DEFAULT NULL,
     user_name     VARCHAR (30) NULL DEFAULT NULL,
	was_online     TIMESTAMP NOT NULL DEFAULT NULL,
     check_date    TIMESTAMP NOT NULL DEFAULT NOW()
);