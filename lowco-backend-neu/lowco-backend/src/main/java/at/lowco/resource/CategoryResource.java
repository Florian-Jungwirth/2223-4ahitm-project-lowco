package at.lowco.resource;

import at.lowco.model.Category;
import at.lowco.model.Survey;
import at.lowco.model.User;
import at.lowco.repository.CategoryRepository;
import at.lowco.repository.SurveyRepository;
import at.lowco.repository.UserSurveyRepository;
import io.quarkus.panache.common.Sort;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@ApplicationScoped

@Path("/category")
public class CategoryResource {

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    SurveyRepository surveyRepository;

    @Inject
    UserSurveyRepository userSurveyRepository;

    @Path("all")
    @GET
    @RolesAllowed({"admin", "default"})
    @Produces(MediaType.APPLICATION_JSON)
    public List<Category> allCategories(){
        return categoryRepository.listAll(Sort.by("title"));
    }

    @Path("test")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String test() {
        LocalDateTime date = LocalDateTime.of(2024, 4, 1, 0,0);
        LocalDateTime today = LocalDateTime.now();
        System.out.println(ChronoUnit.DAYS.between(date, today));
        System.out.println(today);
        System.out.println(ChronoUnit.DAYS.between(date, today)%30);
        return "";
    }

    @Path("getHours")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Long currentDate() {
        LocalDateTime date = LocalDateTime.of(2024, 4, 9, 0, 0);
        LocalDateTime today = LocalDateTime.now();
        return ChronoUnit.HOURS.between(date, today);
    }

    @Path("allActive")
    @RolesAllowed({"admin", "default"})
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Category> allActive(){
        return categoryRepository.list("activated", Sort.by("title"), true);
    }

    @Path("{id}")
    @RolesAllowed({"admin", "default"})
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Category getCategoryByID(@PathParam("id") long id){
        return categoryRepository.findById(id);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"admin"})
    @Transactional
    public Response createCategory(Category category){
        category.persist();
        return Response.created(URI.create("/category/" + category.id)).build();
    }

    @PUT
    @Path("updateCategory")
    @RolesAllowed({"admin"})
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateCategory(Category category){
        categoryRepository.update(category);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @DELETE
    @RolesAllowed({"admin"})
    @Path("deleteWithSurveys/{id}")
    @Transactional
    public Response deleteWithSurveys(@PathParam("id") long id) {
        userSurveyRepository.delete("survey.id", id);
        surveyRepository.delete("category.id", id);
        categoryRepository.deleteById(id);
        return Response.status(Response.Status.OK).build();
    }

}
