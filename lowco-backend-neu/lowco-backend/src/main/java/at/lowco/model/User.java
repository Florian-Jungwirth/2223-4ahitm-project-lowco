package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.sql.Array;

@Entity
public class User extends PanacheEntity {
    String firstname;

    String lastname;

    String email;

    String username;

    Boolean isAdmin;

    String password;

    Boolean metric;

    int[] quicks = new int[20]; //TODO
}
