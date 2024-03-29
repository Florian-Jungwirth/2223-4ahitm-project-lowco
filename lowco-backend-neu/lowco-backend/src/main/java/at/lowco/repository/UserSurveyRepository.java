package at.lowco.repository;

import at.lowco.dtos.UserSurveyDTO;
import at.lowco.model.Survey;
import at.lowco.model.User;
import at.lowco.model.UserSurvey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import java.util.Date;
import java.util.List;

@ApplicationScoped
public class UserSurveyRepository implements PanacheRepository<UserSurvey> {
    public void updateUserSurvey(String userID, long surveyID, double value, String unit) {
        TypedQuery<UserSurvey> query = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :userID and u.survey.id = :surveyID", UserSurvey.class
        );

        query.setParameter("surveyID", surveyID);
        query.setParameter("userID", userID);

        if (query.getResultList().isEmpty()) {
            this.createNewUserSurvey(surveyID, userID, value, unit, false);
        } else {
            Query updateQuery = getEntityManager().createQuery(
                    "update UserSurvey set value = :value, unit = :unit, time = :time where user.id = :userID and survey.id = :surveyID"
            );

            updateQuery.setParameter("value", value);
            updateQuery.setParameter("unit", unit);
            updateQuery.setParameter("userID", userID);
            updateQuery.setParameter("surveyID", surveyID);
            updateQuery.setParameter("time", new Date());
            updateQuery.executeUpdate();
        }
    }

    public void updateQuick(String userID, long surveyID, double value, String unit, Boolean isAQuick) {
        TypedQuery<UserSurvey> query = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :userID and u.survey.id = :surveyID", UserSurvey.class
        );

        query.setParameter("surveyID", surveyID);
        query.setParameter("userID", userID);

        if (query.getResultList().isEmpty()) {
            this.createNewUserSurvey(surveyID, userID, value, unit, isAQuick);
        } else {
            Query updateQuery = getEntityManager().createQuery(
                    "update UserSurvey set value = :value, unit = :unit, time = :time, isAQuick = :isAQuick where user.id = :userID and survey.id = :surveyID"
            );

            updateQuery.setParameter("value", value);
            updateQuery.setParameter("unit", unit);
            updateQuery.setParameter("userID", userID);
            updateQuery.setParameter("surveyID", surveyID);
            updateQuery.setParameter("time", new Date());
            updateQuery.setParameter("isAQuick", isAQuick);
            updateQuery.executeUpdate();
        }
    }

    public void addValue(String userID, long surveyID, double value) {
        TypedQuery<UserSurvey> query = getEntityManager().createQuery(
                "select u from UserSurvey u where u.user.id = :userID and u.survey.id = :surveyID", UserSurvey.class
        );

        query.setParameter("surveyID", surveyID);
        query.setParameter("userID", userID);

        if (query.getResultList().isEmpty()) {
            this.createNewUserSurvey(surveyID, userID, value, null, false);
        } else {
            Query updateQuery = getEntityManager().createQuery(
                    "update UserSurvey set value = value + :value where user.id = :userID and survey.id = :surveyID"
            );

            updateQuery.setParameter("value", value);
            updateQuery.setParameter("userID", userID);
            updateQuery.setParameter("surveyID", surveyID);
            updateQuery.executeUpdate();
        }
    }

    public void createNewUserSurvey(long surveyID, String userID, double value, String unit, Boolean isAQuick) {
        UserSurvey u = new UserSurvey();
        u.survey = Survey.findById(surveyID);
        u.user = User.findById(userID);
        u.time = new Date();
        u.isAQuick = isAQuick;
        u.unit = unit;
        u.value = value;

        getEntityManager().persist(u);
    }

    public List<UserSurvey> getByUserId(Long id) {
        return list("user.id", id, Sort.by("survey.title"));
    }

    public List<UserSurveyDTO> getJoinedUserSurveysByUser(String userID) {
        TypedQuery<UserSurveyDTO> query = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :id" +
                        " WHERE s.activated = true order by s.title", UserSurveyDTO.class
        );

        query.setParameter("id", userID);

        return query.getResultList();
    }

    public List<UserSurveyDTO> getActiveQuicksHome(String userID) {
        TypedQuery<UserSurveyDTO> queryQuicks = getEntityManager().createQuery(
                "select  NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, u.survey) from UserSurvey u where u.user.id = :id and u.isAQuick = true and u.survey.activated = true order by u.survey.title", UserSurveyDTO.class
        );

        queryQuicks.setParameter("id", userID);

        List<UserSurveyDTO> quicks = queryQuicks.getResultList();

        if (!quicks.isEmpty()) {
            return quicks;
        }

        TypedQuery<UserSurveyDTO> queryNormal = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :id" +
                        " WHERE s.activated = true order by s.title", UserSurveyDTO.class
        );

        queryNormal.setParameter("id", userID);
        queryNormal.setMaxResults(4);
        return queryNormal.getResultList();
    }

    public List<UserSurveyDTO> getActiveQuicks(String userID) {
        TypedQuery<UserSurveyDTO> queryQuicks = getEntityManager().createQuery(
                "select  NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, u.survey) from UserSurvey u where u.user.id = :id and u.isAQuick = true and u.survey.activated = true order by u.survey.title", UserSurveyDTO.class
        );

        queryQuicks.setParameter("id", userID);

        return queryQuicks.getResultList();
    }

    public List<UserSurveyDTO> getActiveByCategoryId(String userID, long categoryID) {
        TypedQuery<UserSurveyDTO> query = getEntityManager().createQuery(
                "SELECT NEW at.lowco.dtos.UserSurveyDTO(u.id, u.value, u.unit, u.isAQuick, s)" +
                        "FROM Survey s LEFT JOIN UserSurvey u ON s.id = u.survey.id AND u.user.id = :userID" +
                        " WHERE s.activated = true and s.category.activated = true and s.category.id = :categoryID order by s.title", UserSurveyDTO.class
        );

        query.setParameter("categoryID", categoryID);
        query.setParameter("userID", userID);

        return query.getResultList();
    }
}
