package at.lowco.resource;

import at.lowco.model.Survey;
import at.lowco.repository.SurveyRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
@Path("/survey")
public class SurveyResource {
    @Inject
    SurveyRepository surveyRepository;

    @Path("all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Survey> allSurveys(){
        return surveyRepository.listAll();
    }

    @Path("getAllActiveSurveys")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Survey> getAllActiveSurveys(){
        return surveyRepository.list("activated", true);
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Survey getUserByID(@PathParam("id") long id){
        return surveyRepository.findById(id);
    }

    @PUT
    @Path("updateSurvey")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateSurvey(Survey survey){
        surveyRepository.update(survey);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
