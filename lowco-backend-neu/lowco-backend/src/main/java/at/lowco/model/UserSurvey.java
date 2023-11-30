package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

import java.util.Date;

@Entity
public class UserSurvey extends PanacheEntity {
    public Double value;
    public String unit;
    public Date time;
    public Boolean isAQuick;

    @ManyToOne
    public User user;

    @ManyToOne
    public Survey survey;
}
