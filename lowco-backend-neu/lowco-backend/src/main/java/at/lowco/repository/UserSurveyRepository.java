package at.lowco.repository;

import at.lowco.dtos.UserSurveyDTO;
import at.lowco.model.Survey;
import at.lowco.model.User;
import at.lowco.model.UserSurvey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;

import java.util.List;

import static io.quarkus.hibernate.orm.panache.Panache.getEntityManager;

@ApplicationScoped
public class UserSurveyRepository implements PanacheRepository<UserSurvey> {
    public void updateUserSurvey(long userID, long surveyID, double value, String unit) {
        TypedQuery<UserSurvey> query = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :userID and u.survey.id = :surveyID", UserSurvey.class
        );

        query.setParameter("surveyID", surveyID);
        query.setParameter("userID", userID);

        /*if(query.getResultList().isEmpty()) {
            UserSurvey u = new UserSurvey();


            getEntityManager().persist();
        }*/
    }

    public List<UserSurvey> getByUserId(Long id) {
        return list("user.id", id);
    }

    public List<UserSurveyDTO> findJoinedUserSurveysByUser(long userID) {
        TypedQuery<UserSurveyDTO> query = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :id" +
                        " WHERE s.activated = true", UserSurveyDTO.class
        );

        query.setParameter("id", userID);

        return query.getResultList();
    }

    public List<UserSurveyDTO> getActiveQuicksHome(Long userID) {
        TypedQuery<UserSurveyDTO> queryQuicks = getEntityManager().createQuery(
                "select  NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, u.survey) from UserSurvey u where u.user.id = :id and u.isAQuick = true and u.survey.activated = true", UserSurveyDTO.class
        );

        queryQuicks.setParameter("id", userID);

        List<UserSurveyDTO> quicks = queryQuicks.getResultList();

        if (!quicks.isEmpty()) {
            return quicks;
        }

        TypedQuery<UserSurveyDTO> queryNormal = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :id" +
                        " WHERE s.activated = true", UserSurveyDTO.class
        );

        queryNormal.setParameter("id", userID);
        queryNormal.setMaxResults(4);
        return queryNormal.getResultList();
    }

    public List<UserSurveyDTO> getActiveQuicks(Long userID) {
        TypedQuery<UserSurveyDTO> queryQuicks = getEntityManager().createQuery(
                "select  NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, u.survey) from UserSurvey u where u.user.id = :id and u.isAQuick = true and u.survey.activated = true", UserSurveyDTO.class
        );

        queryQuicks.setParameter("id", userID);

        return queryQuicks.getResultList();
    }

    public List<UserSurveyDTO> getActiveByCategoryId(long userID, long categoryID) {
        TypedQuery<UserSurveyDTO> query = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :userID" +
                        " WHERE s.activated = true and s.category.activated = true and s.category.id = :categoryID", UserSurveyDTO.class
        );

        query.setParameter("categoryID", categoryID);
        query.setParameter("userID", userID);

        return query.getResultList();
    }
}
