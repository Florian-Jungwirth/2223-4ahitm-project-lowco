package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.sql.Array;

@Entity
@Table(name = "UserTest")
public class User extends PanacheEntity {
    public String firstname;

    public String lastname;

    public String email;

    public String username;

    public Boolean isAdmin;

    public String password;

    public Boolean metric;

    @Column(nullable = true)
    public int[] quicks = new int[20]; //TODO
}
