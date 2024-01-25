    insert into CATEGORY(ID, ICONNAME, TITLE, ACTIVATED)
    values (1, 'analytics-outline', 'Fortbewegung', true),
           (2, 'logo-electron', 'Energie', true),
           (3, 'shirt-outline', 'Konsumverhalten', true);

    insert into SURVEY(ID, ICONNAME, TITLE, MEASUREMENT, STANDARDVALUE, ACTIVATED, TYPE, CATEGORY_ID)
    values (1, 'bus-outline', 'Öffentliche Verkehrsmittel', 'd', 0, true, 'e', 1),
           (2, 'car-sport-outline', 'Autofahren', 'd', 0, true, 'e', 1),
           (3, 'bicycle-outline', 'Radfahren', 'd', 0, true, 'e', 1),
           (4, 'airplane-outline', 'Flüge', 'd', 0, true, 'e', 1),
           (5, 'walk-outline', 'Gehen', 'd', 0, true, 'e', 1),
           (6, 'desktop-outline', 'Screentime', 'z', 0, true, 'e', 2),
           (7, 'flame-outline', 'Heizung', 'z', 0, true, 'e', 2),
           (8, 'fast-food-outline', 'Restaurantbesuche', 'a', 0, true, 'a', 3),
           (9, 'shirt-outline', 'Kleidungsstücke', 'a', 0, true, 'a', 3);

    insert into USERS(ID, FIRSTNAME, LASTNAME, EMAIL, USERNAME, ISADMIN, PASSWORD, METRIC)
    values
        (1, 'Florian', 'Jungwirth', 'florian22jungwirth@gmail.com', 'flo', true, '1234', true),
        (2, 'Jan', 'van Anger', 'j_vanAnger@gmail.com', 'Angerer', false, '2456', false);

    insert into USERSURVEY(ID, VALUE, UNIT, TIME, USER_ID, SURVEY_ID, ISAQUICK)
    values (1, 10, 'km', '2023-11-29T08:29:09', 1, 1, true);

    drop sequence users_seq RESTRICT;
    create sequence users_seq start with 100;

    drop sequence category_seq RESTRICT;
    create sequence category_seq start with 100;

    drop sequence survey_seq RESTRICT;
    create sequence survey_seq start with 100;

    drop sequence usersurvey_seq RESTRICT;
    create sequence usersurvey_seq start with 100;