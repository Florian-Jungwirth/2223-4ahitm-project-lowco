package at.lowco.repository;

import at.lowco.model.Category;
import at.lowco.model.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    @Inject
    EntityManager em;

    public void update(Category category) {
        Category cat = Category.findById(category.id);
        cat.iconName = category.iconName;
        cat.title = category.title;
        cat.activated = category.activated;
        cat.persist();
    }

}
