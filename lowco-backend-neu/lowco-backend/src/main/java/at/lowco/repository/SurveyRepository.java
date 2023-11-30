package at.lowco.repository;

import at.lowco.model.Survey;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SurveyRepository implements PanacheRepository<Survey> {

    public void update(Survey survey) {
        getEntityManager().merge(survey);
    }
}
