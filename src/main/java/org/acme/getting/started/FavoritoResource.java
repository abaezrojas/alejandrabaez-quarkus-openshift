package org.acme.getting.started;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;

@Path("/api/favoritos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FavoritoResource {

    @Inject
    EntityManager entityManager;

    @POST
    @Transactional
    public Response crear(Favorito favorito) {
        try {
            entityManager.persist(favorito);
            return Response.status(Response.Status.CREATED).entity(favorito).build();
        } catch (PersistenceException e) {
            // Capturar violación de restricción unique
            Throwable cause = e.getCause();
            while (cause != null) {
                if (cause instanceof SQLException) {
                    SQLException sqlEx = (SQLException) cause;
                    // Código de error 23505 es violación de restricción unique en H2
                    if (sqlEx.getErrorCode() == 23505 || sqlEx.getMessage().contains("Unique index or primary key violation")) {
                        return Response.status(Response.Status.CONFLICT)
                            .entity("{\"error\": \"El favorito ya existe con esa combinación de tipo y referenciaId\"}")
                            .build();
                    }
                }
                cause = cause.getCause();
            }
            throw e;
        }
    }

    @GET
    @Transactional
    public Response listar() {
        List<Favorito> favoritos = entityManager
            .createQuery("SELECT f FROM Favorito f ORDER BY f.fechaRegistro DESC", Favorito.class)
            .getResultList();
        return Response.ok(favoritos).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response eliminar(@PathParam("id") Long id) {
        Favorito favorito = entityManager.find(Favorito.class, id);
        if (favorito == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        entityManager.remove(favorito);
        return Response.noContent().build();
    }
}
