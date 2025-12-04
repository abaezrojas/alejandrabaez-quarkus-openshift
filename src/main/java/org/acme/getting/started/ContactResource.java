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

    // READ - Get all contacts (search endpoint)
    @GET
    @Path("/search")
    public List<Contact> searchAllContacts() {
        return entityManager.createQuery("from Contact", Contact.class).getResultList();
    }

    // READ - Get contact by ID
    @GET
    @Path("/{id}")
    public Response getContactById(@PathParam("id") Long id) {
        Contact contact = entityManager.find(Contact.class, id);
        if (contact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Contact with id " + id + " not found")
                    .build();
        }
        return Response.ok(contact).build();
    }

    // READ - Get contact by email
    @GET
    @Path("/email/{email}")
    public Response getContactByEmail(@PathParam("email") String email) {
        List<Contact> contacts = entityManager.createQuery(
            "SELECT c FROM Contact c WHERE c.email = :email", Contact.class)
            .setParameter("email", email)
            .getResultList();
        
        if (contacts.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Contact with email " + email + " not found")
                    .build();
        }
        
        // Return the first contact found (assuming emails are unique)
        return Response.ok(contacts.get(0)).build();
    }

    // CREATE - Create a new contact
    @POST
    @Transactional
    public Response createContact(Contact contact) {
        if (contact.name == null || contact.name.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Name is required")
                    .build();
        }
        if (contact.email == null || contact.email.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Email is required")
                    .build();
        }
        
        entityManager.persist(contact);
        return Response.status(Response.Status.CREATED).entity(contact).build();
    }

    // UPDATE - Update an existing contact
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateContact(@PathParam("id") Long id, Contact updatedContact) {
        Contact existingContact = entityManager.find(Contact.class, id);
        if (existingContact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Contact with id " + id + " not found")
                    .build();
        }

        if (updatedContact.name != null && !updatedContact.name.trim().isEmpty()) {
            existingContact.name = updatedContact.name;
        }
        if (updatedContact.email != null && !updatedContact.email.trim().isEmpty()) {
            existingContact.email = updatedContact.email;
        }
        existingContact.dataProtection = updatedContact.dataProtection;

        entityManager.merge(existingContact);
        return Response.ok(existingContact).build();
    }



    // DELETE - Delete a contact by ID
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteContact(@PathParam("id") Long id) {
        Contact contact = entityManager.find(Contact.class, id);
        if (contact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Contact with id " + id + " not found")
                    .build();
        }

        entityManager.remove(contact);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    // UPDATE EMAIL - Update only the email of a contact
    @PUT
    @Path("/email/{email}")
    @Transactional
    public Response updateEmailContact(@PathParam("email") String email, String newEmail) {
        List<Contact> contacts = entityManager.createQuery(
            "SELECT c FROM Contact c WHERE c.email = :email", Contact.class)
            .setParameter("email", email)
            .getResultList();
        
        if (contacts.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Contact with email " + email + " not found")
                    .build();
        }
        
        Contact existingContact = contacts.get(0);

        if (newEmail == null || newEmail.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Email is required")
                    .build();
        }

        existingContact.email = newEmail.trim();
        entityManager.merge(existingContact);
        return Response.ok(existingContact).build();
    }

    // READ - Get all contacts
    @GET
    public List<Contact> getAllContacts() {
        return entityManager.createQuery("from Contact", Contact.class).getResultList();
    }
}