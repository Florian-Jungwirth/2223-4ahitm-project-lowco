    insert into CATEGORY(ID, ICONNAME, TITLE, ACTIVATED)
    values (1, 'analytics-outline', 'Fortbewegung', true),
           (2, 'logo-electron', 'Energie', true),
           (3, 'shirt-outline', 'Konsumverhalten', true);

    insert into SURVEY(ID, ICONNAME, TITLE, MEASUREMENT, STANDARDVALUE, ACTIVATED, TYPE, CATEGORY_ID, PERIOD)
    values (1, 'bus-outline', 'Öffentliche Verkehrsmittel', 'd', 0, true, 'e', 1, 7),
           (2, 'car-sport-outline', 'Autofahren', 'd', 0, true, 'e', 1, 7),
           (3, 'bicycle-outline', 'Radfahren', 'd', 0, true, 'e', 1, 30),
           (4, 'airplane-outline', 'Flüge', 'd', 0, true, 'e', 1, 180),
           (5, 'walk-outline', 'Gehen', 'd', 0, true, 'e', 1, 1),
           (6, 'desktop-outline', 'Screentime', 'z', 0, true, 'e', 2, 1),
           (7, 'flame-outline', 'Heizung', 'z', 0, true, 'e', 2, 30),
           (8, 'fast-food-outline', 'Restaurantbesuche', 'a', 0, true, 'a', 3, 30),
           (9, 'shirt-outline', 'Kleidungsstücke', 'a', 0, true, 'a', 3, 180);

    insert into USERS(ID, METRIC)
    values
        ('6bb773ee-8071-49c1-afa7-ca51472670dd', true);

    insert into USERSURVEY(ID, VALUE, UNIT, TIME, USER_ID, SURVEY_ID, ISAQUICK)
    values (1, 10, 'km', '2023-11-29T08:29:09', '6bb773ee-8071-49c1-afa7-ca51472670dd', 1, true);

    drop sequence users_seq RESTRICT;
    create sequence users_seq start with 100;

    drop sequence category_seq RESTRICT;
    create sequence category_seq start with 100;

    drop sequence survey_seq RESTRICT;
    create sequence survey_seq start with 100;

    drop sequence usersurvey_seq RESTRICT;
    create sequence usersurvey_seq start with 100;