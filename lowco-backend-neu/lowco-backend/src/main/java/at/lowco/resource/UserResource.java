package at.lowco.resource;

import at.lowco.model.User;
import at.lowco.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

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
}
