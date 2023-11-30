package at.lowco.repository;

import at.lowco.model.User;
import at.lowco.model.UserSurvey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import java.util.List;

@ApplicationScoped
public class UserSurveyRepository implements PanacheRepository<UserSurvey> {
    public void update(UserSurvey userSurvey) {
        getEntityManager().merge(userSurvey);
    }

    public List<UserSurvey> getJoinedUserSurveyByUserID(Long id) {
        TypedQuery<UserSurvey> query = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :id and u.survey.activated = true", UserSurvey.class
        );

        query.setParameter("id", id);
        return query.getResultList();
    }

    public List<UserSurvey> getJoinedQuicks(Long id) {
        TypedQuery<UserSurvey> queryQuicks = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :id and u.isAQuick = true and u.survey.activated = true", UserSurvey.class
        );

        queryQuicks.setParameter("id", id);

        List<UserSurvey> quicks = queryQuicks.getResultList();

        if(quicks.size() == 0) {
            TypedQuery<UserSurvey> queryNormal = getEntityManager().createQuery(
                    "select u from UserSurvey u where u.user.id = :id  and u.survey.activated = true", UserSurvey.class
            );

            queryNormal.setParameter("id", id);
            queryNormal.setMaxResults(4);
            quicks = queryNormal.getResultList();

        }

        return quicks;
    }

    public List<Object[]> getAllActivatedJoinedByUserID(Long id) {
        TypedQuery<Object[]> query = getEntityManager().createQuery(
                "SELECT s, u.isAQuick FROM Survey s LEFT JOIN UserSurvey u on s.id = u.survey.id " +
                        "WHERE s.activated = true AND (u.user.id IS NULL OR u.user.id = :id)", Object[].class
        );

        query.setParameter("id", id);

        return query.getResultList();
    }

    public List<Object[]> getAllActivatedByUserAndCategory(long id, long userid) {
        TypedQuery<Object[]> query = getEntityManager().createQuery(
                "SELECT s, u FROM Survey s LEFT JOIN UserSurvey u on s.id = u.survey.id " +
                        "WHERE s.activated = true AND (u.user.id IS NULL OR u.user.id = :userid) AND s.category.id = :id", Object[].class
        );

        query.setParameter("userid", userid);
        query.setParameter("id", id);

        return query.getResultList();
    }
}
