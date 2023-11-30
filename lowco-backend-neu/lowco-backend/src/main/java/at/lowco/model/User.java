package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Users")
public class User extends PanacheEntity {
    public String firstname;

    public String lastname;

    public String email;

    public String username;

    public Boolean isAdmin;

    public String password;

    public Boolean metric;
}
