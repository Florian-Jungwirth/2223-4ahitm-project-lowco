package at.lowco.resource;

import at.lowco.model.User;
import at.lowco.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped

@Path("/user")
public class UserResource {
    @Inject
    UserRepository userRepository;

    @Path("all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> allUsers(){
        return userRepository.listAll();
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public User getUserByID(@PathParam("id") long id){
        return userRepository.findById(id);
    }

    @PUT
    @Path("changeUser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateUser(User user){
        userRepository.update(user);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
