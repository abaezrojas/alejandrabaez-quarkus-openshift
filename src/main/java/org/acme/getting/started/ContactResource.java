package org.acme.getting.started;


import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/contact")
@Produces("application/json")
@Consumes("application/json")
public class ContactResource {
    @Inject
    EntityManager entityManager;

    @GET
    public List<Contact> getAllContact(){
        return entityManager.createQuery("from Contact",Contact.class).getResultList();
    }

    @GET
    @Path("{id}")
    public Response getContactById(@PathParam("id") Long id) {
        Contact contact = entityManager.find(Contact.class, id);
        if (contact == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(contact).build();
    }

    @POST
    @Transactional
    public Response createContact(Contact contact) {
        entityManager.persist(contact);
        return Response.status(Response.Status.CREATED).entity(contact).build();
    }

    @PUT
    @Path("/email/{email}")
    @Transactional
    public Response updateContactByEmail(@PathParam("email") String email, Contact updatedContact) {
        Contact contact = entityManager.createQuery(
                        "SELECT c FROM Contact c WHERE c.email = :email", Contact.class)
                .setParameter("email", email)
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (contact == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        contact.setName(updatedContact.getName());
        contact.setEmail(updatedContact.getEmail());
        entityManager.merge(contact);
        return Response.ok(contact).build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response deleteContact(@PathParam("id") Long id) {
        Contact contact = entityManager.find(Contact.class, id);
        if (contact == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        entityManager.remove(contact);
        return Response.noContent().build();
    }

}
