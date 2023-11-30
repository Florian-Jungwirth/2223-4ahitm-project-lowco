package at.lowco.repository;

import at.lowco.model.UserSurvey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class UserSurveyRepository implements PanacheRepository<UserSurvey> {
    public void update(UserSurvey userSurvey) {
        getEntityManager().merge(userSurvey);
    }

    public List<UserSurvey> getByUserId(Long id) {
        return list("user.id", id);
    }
}
