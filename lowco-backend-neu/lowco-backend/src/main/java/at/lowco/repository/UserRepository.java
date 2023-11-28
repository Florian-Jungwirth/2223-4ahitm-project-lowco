package at.lowco.repository;

import at.lowco.model.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {
    @Inject
    EntityManager em;
    public void update(User user) {
        User user1 = User.findById(user.id);
        user1.firstname = user.firstname;
        user1.lastname = user.lastname;
        user1.email = user.email;
        user1.username = user.username;
        user1.isAdmin = user.isAdmin;
        user1.password = user.password;
        user1.metric = user.metric;
        user1.quicks = user.quicks;
        user1.persist();
    }
}
