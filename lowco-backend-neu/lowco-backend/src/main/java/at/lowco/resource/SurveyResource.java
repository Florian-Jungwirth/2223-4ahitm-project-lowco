package at.lowco.resource;

import at.lowco.model.Survey;
import at.lowco.model.User;
import at.lowco.repository.SurveyRepository;
import at.lowco.repository.UserSurveyRepository;
import io.quarkus.panache.common.Sort;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;

@ApplicationScoped
@Path("/survey")
public class SurveyResource {
    @Inject
    SurveyRepository surveyRepository;

    @Inject
    UserSurveyRepository userSurveyRepository;

    @Path("all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    public List<Survey> allSurveys(){
        return surveyRepository.listAll(Sort.by("title"));
    }

    @Path("getPointsOfUser/{userID}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    public Object getPointsOfUser(@PathParam("userID") String userID) {
        return surveyRepository.points(userID);
    }


    @Path("getAllActiveSurveys")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    public List<Survey> getAllActiveSurveys(){
        return surveyRepository.list("activated", Sort.by("title"), true);
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    public Survey getUserByID(@PathParam("id") long id){
        return surveyRepository.findById(id);
    }

    @PUT
    @Path("updateSurvey")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin"})
    @Transactional
    public Response updateSurvey(Survey survey){
        surveyRepository.update(survey);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @POST
    @Path("createSurvey")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed({"admin"})
    public Response createSurvey(Survey survey) {
        survey.persist();
        return Response.created(URI.create("/category/" + survey.id)).build();
    }

    @DELETE
    @Path("deleteWithUserSurveys/{id}")
    @RolesAllowed({"admin"})
    @Transactional
    public Response deleteWithUserSurveys(@PathParam("id") long id) {
        userSurveyRepository.delete("survey.id", id);
        surveyRepository.deleteById(id);
        return Response.status(Response.Status.OK).build();
    }
}
