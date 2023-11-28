package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Category extends PanacheEntity {

    public String iconName;

    public String title;

    public Boolean activated;

}
