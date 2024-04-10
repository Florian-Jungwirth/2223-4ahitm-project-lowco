package at.lowco.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.enterprise.inject.Default;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.resource.spi.ConfigProperty;

@Entity
public class Survey extends PanacheEntity {
    public String iconName;
    public String title;
    public String measurement;
    public Integer standardValue;
    public Boolean activated;
    public String type;
    public Integer period;
    public Integer maxPoints;

    @Column(columnDefinition = "BOOLEAN default true")
    public Boolean positive;
    public Integer defaultPoints;
    public Integer valuePerPoint;

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
                ", period=" + period +
                ", maxPoints=" + maxPoints +
                ", positive=" + positive +
                ", defaultPoints=" + defaultPoints +
                ", category=" + category +
                '}';
    }
}
