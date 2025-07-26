BEGIN;

-- USER 1, WALLET COMMON
INSERT INTO
	users (id, name, document, email, password, created_at, updated_at)
VALUES
	(
		'14fae17b-73c8-49f8-92b9-e7cd8ac75324',
		'user1',
		'91315209012',
		'user1@wallet.io',
		'$2a$10$Z3uc8uP/EbXUSft1Giod7.PsIm12riWaH0RPIxxRIh7.Q5.MCC5du',
		NOW(),
		NOW()
	);

INSERT INTO
	wallets (id, type, user_id, balance, version, updated_at)
VALUES
	(
		'a7ff5d70-2162-40a3-a559-edafe5012398',
		'COMMON',
		'14fae17b-73c8-49f8-92b9-e7cd8ac75324',
		0,
		1,
		NOW()
	);

-- USER 2, WALLET MERCHANT
INSERT INTO
	users (id, name, document, email, password, created_at, updated_at)
VALUES
	(
		'6191182a-22ce-4f28-9efc-963005effa72',
		'user2',
		'73987832053',
		'user2@wallet.io',
		'$2a$10$Z3uc8uP/EbXUSft1Giod7.PsIm12riWaH0RPIxxRIh7.Q5.MCC5du',
		NOW(),
		NOW()
	);

INSERT INTO
	wallets (id, type, user_id, balance, version, updated_at)
VALUES
	(
		'5765171b-e3f8-4f09-8a36-89018d64e4d2',
		'MERCHANT',
		'6191182a-22ce-4f28-9efc-963005effa72',
		0,
		1,
		NOW()
	);

-- USER 3
INSERT INTO
	users (id, name, document, email, password, created_at, updated_at)
VALUES
	(
		'8db661c0-fc6e-4dd0-93f0-358db0f930dc',
		'user3',
		'00972928006',
		'user3@wallet.io',
		'$2a$10$Z3uc8uP/EbXUSft1Giod7.PsIm12riWaH0RPIxxRIh7.Q5.MCC5du',
		NOW(),
		NOW()
	);

INSERT INTO
	wallets (id, type, user_id, balance, version, updated_at)
VALUES
	(
		'cb661203-a81f-43ce-8c90-03b6f93aa093',
		'COMMON',
		'8db661c0-fc6e-4dd0-93f0-358db0f930dc',
		0,
		1,
		NOW()
	);

-- TRANSFER FROM USER 1 TO USER 2
INSERT INTO
	transfers (id, origin_id, target_id, amount, created_at)
VALUES
	(
		'51ac15b4-a7e8-4cd9-84c9-a87ec7b053ee',
		'a7ff5d70-2162-40a3-a559-edafe5012398',
		'5765171b-e3f8-4f09-8a36-89018d64e4d2',
		100,
		NOW()
	);

-- TRANSFER FROM USER 1 TO USER 3
INSERT INTO
	transfers (id, origin_id, target_id, amount, created_at)
VALUES
	(
		'008305a3-e7ed-44d1-ad88-61ab91f8d5c2',
		'a7ff5d70-2162-40a3-a559-edafe5012398',
		'cb661203-a81f-43ce-8c90-03b6f93aa093',
		100,
		NOW()
	);

COMMIT;