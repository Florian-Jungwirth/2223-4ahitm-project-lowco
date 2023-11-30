package at.lowco.repository;

import at.lowco.model.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public void update(User user) {
        getEntityManager().merge(user);
    }
}
