package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Survey extends PanacheEntity {
    public String iconName;
    public String title;
    public String measurement;
    public Integer standardValue;
    public Boolean activated;
    public String type;

    @ManyToOne
    @JoinColumn(name="category_id")
    public Category category;

    @Override
    public String toString() {
        return "Survey{" +
                "iconName='" + iconName + '\'' +
                ", title='" + title + '\'' +
                ", measurement='" + measurement + '\'' +
                ", standardValue=" + standardValue +
                ", activated=" + activated +
                ", type='" + type + '\'' +
                ", category=" + category +
                ", id=" + id +
                '}';
    }
}
