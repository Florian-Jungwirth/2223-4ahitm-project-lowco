package at.lowco.repository;

import at.lowco.model.Survey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Query;

@ApplicationScoped
public class SurveyRepository implements PanacheRepository<Survey> {

    public void update(Survey survey) {
        getEntityManager().merge(survey);
    }

    public Object points(String userID) {
        Query query = getEntityManager().createQuery("select sum(CAST(CASE WHEN s.positive = true THEN CASE WHEN ((COALESCE(u.value, 0) / CAST(s.valuePerPoint AS double))) > s.maxPoints THEN s.maxPoints ELSE ((COALESCE(u.value, 0) / CAST(s.valuePerPoint AS double))) END ELSE CASE WHEN (s.maxPoints - (COALESCE(u.value, 0) / CAST(s.valuePerPoint AS double))) < 0 THEN 0 ELSE (s.maxPoints - (COALESCE(u.value, 0) / CAST(s.valuePerPoint AS double))) END END AS double))/sum(s.maxPoints) from Survey s left join UserSurvey u on s.id = u.survey.id where u.user.id = :userID or u is null");
        query.setParameter("userID", userID);
        System.out.println(query.getSingleResult());
        return query.getSingleResult();
    }
}
