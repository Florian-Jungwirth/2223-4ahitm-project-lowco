package at.lowco.resource;

import at.lowco.model.User;
import at.lowco.model.UserSurvey;
import at.lowco.repository.UserSurveyRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
@Path("/userSurvey")
public class UserSurveyRessource {
    @Inject
    UserSurveyRepository userSurveyRepository;

    @Path("all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurvey> allUserSurveys(){
        return userSurveyRepository.listAll();
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public UserSurvey getUserSurveyByID(@PathParam("id") long id){
        return userSurveyRepository.findById(id);
    }

    @Path("getByUserId/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurvey> getUserSurveyByUserID(@PathParam("id") long id){
        return userSurveyRepository.getByUserId(id);
    }

    @PUT
    @Path("updateUserSurvey")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateUserSurvey(UserSurvey userSurvey){
        userSurveyRepository.update(userSurvey);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
