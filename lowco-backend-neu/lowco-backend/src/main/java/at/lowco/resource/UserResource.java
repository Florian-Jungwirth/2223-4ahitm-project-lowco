package at.lowco.resource;

import at.lowco.model.User;
import at.lowco.repository.UserRepository;
import io.quarkus.panache.common.Sort;
import jakarta.annotation.security.RolesAllowed;
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
    @RolesAllowed({"admin", "default"})
    public List<User> allUsers(){
        return userRepository.listAll();
    }

    @GET
    @Path("getByID/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    public User getUserByID(@PathParam("id") String id){
        return userRepository.find("id", id).firstResult();
    }

    @PUT
    @Path("updateUser")
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin", "default"})
    @Transactional
    public Response updateUser(User user){
        userRepository.update(user);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @POST
    @Path("register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response register(User user) {
        System.out.println(user);
        userRepository.persist(user);
        return Response.status(Response.Status.CREATED).build();
    }
}
