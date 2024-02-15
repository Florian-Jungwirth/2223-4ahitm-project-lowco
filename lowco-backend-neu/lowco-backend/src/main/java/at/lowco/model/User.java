package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Users")
public class User extends PanacheEntityBase {
    @Id
    public String id;

    public Boolean metric;
}
