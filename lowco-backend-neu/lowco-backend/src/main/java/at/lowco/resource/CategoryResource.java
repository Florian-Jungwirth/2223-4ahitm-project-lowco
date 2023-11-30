package at.lowco.resource;

import at.lowco.model.Category;
import at.lowco.model.User;
import at.lowco.repository.CategoryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;

@ApplicationScoped

@Path("/category")
public class CategoryResource {

    @Inject
    CategoryRepository categoryRepository;

    @Path("all")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Category> allCategories(){
        return categoryRepository.listAll();
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Category getCategoryByID(@PathParam("id") long id){
        return categoryRepository.findById(id);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createCategory(Category category){
        category.persist();
        return Response.created(URI.create("/category/" + category.id)).build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public void deleteCategory(@PathParam("id") int id){
        Category entity = Category.findById(id);
        if(entity == null) {
            throw new NotFoundException();
        }
        entity.delete();
    }

    @PUT
    @Path("updateCategory")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCategory(Category category){
        categoryRepository.update(category);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
