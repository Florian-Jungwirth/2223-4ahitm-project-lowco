package at.lowco.resource;

import at.lowco.dtos.UserSurveyDTO;
import at.lowco.model.UserSurvey;
import at.lowco.repository.UserSurveyRepository;
import io.quarkus.panache.common.Sort;
import jakarta.annotation.security.DenyAll;
import jakarta.annotation.security.RolesAllowed;
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
        return userSurveyRepository.listAll(Sort.by("survey.title"));
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

    @Path("getActiveByCategoryId/{userID}/{categoryID}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurveyDTO> getActiveByCategoryId(@PathParam("userID") String userID, @PathParam("categoryID") long categoryID){
        return userSurveyRepository.getActiveByCategoryId(userID, categoryID);
    }

    @PATCH
    @Path("addValue/{userID}/{surveyID}/{value}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateUserSurvey(@PathParam("userID") String userID, @PathParam("surveyID") long surveyID, @PathParam("value") double value){
        userSurveyRepository.addValue(userID, surveyID, value);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("updateUserSurvey/{userID}/{surveyID}/{value}/{unit}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateUserSurvey(@PathParam("userID") String userID, @PathParam("surveyID") long surveyID, @PathParam("unit") String unit, @PathParam("value") double value){
        userSurveyRepository.updateUserSurvey(userID, surveyID, value, unit);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("updateQuick/{userID}/{surveyID}/{value}/{unit}/{isAQuick}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateQuick(@PathParam("userID") String userID, @PathParam("surveyID") long surveyID, @PathParam("unit") String unit, @PathParam("value") double value, @PathParam("isAQuick") boolean isAQuick){
        userSurveyRepository.updateQuick(userID, surveyID, value, unit, isAQuick);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @Path("getJoinedUserSurveysByUser/{userID}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurveyDTO> getJoinedUserSurveysByUser(@PathParam("userID") String userID){
        return userSurveyRepository.getJoinedUserSurveysByUser(userID);
    }

    @Path("getActiveQuicks/{userID}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurveyDTO> getActiveQuicks(@PathParam("userID") String userID){
        return userSurveyRepository.getActiveQuicks(userID);
    }

    @Path("getActiveQuicksHome/{userID}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserSurveyDTO> getActiveQuicksHome(@PathParam("userID") String userID){
        return userSurveyRepository.getActiveQuicksHome(userID);
    }

}
