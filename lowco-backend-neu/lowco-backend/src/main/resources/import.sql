insert into USERTEST(ID, FIRSTNAME, LASTNAME, EMAIL, USERNAME, ISADMIN, PASSWORD, METRIC, QUICKS) values
                                                                              (1, 'Max', 'Muster', 'm_muster@gmail.com', 'iBimsDaMax', false, '1234', false, null),
                                                                              (2, 'Jan', 'van Anger', 'j_vanAnger@gmail.com', 'Angerer', false, '2456', false, null);

insert into CATEGORY(ID, ICONNAME, TITLE, ACTIVATED) values
                                                (1, 'car-icon', 'Car', false),
                                                (2, 'restaurant-icon', 'Restaurant', false);

drop sequence user_seq RESTRICT ;
create sequence user_seq start with 100;

drop sequence category_seq RESTRICT ;
create sequence category_seq start with 100;