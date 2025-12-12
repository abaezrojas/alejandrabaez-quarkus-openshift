package org.acme.getting.started;

import org.acme.getting.started.client.MiddlewareApiClient;
import org.acme.getting.started.dto.CentroServicio;
import org.acme.getting.started.dto.CentrosServicioResponse;
import org.acme.getting.started.dto.ParametroSipap;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/middleware")
public class MiddlewareResource {

    private static final String INTERFISA_VERSION = "V1.0";

    @Inject
    @RestClient
    MiddlewareApiClient middlewareClient;

    @ConfigProperty(name = "interfisa.jwt.token")
    String jwtToken;

    /**
     * Endpoint público para consultar centros de servicio
     * Ejemplo: /api/middleware/sucursales?buscar=Microcentro
     */
    @GET
    @Path("/sucursales")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerSucursales(@QueryParam("buscar") String busqueda) {
        try {
            String nombreODireccion = busqueda != null ? busqueda : "Microcentro";
            CentrosServicioResponse response = middlewareClient.obtenerCentrosServicio(
                nombreODireccion, 
                INTERFISA_VERSION
            );
            
            // Extraer los datos de la respuesta wrapper
            List<CentroServicio> centros = response != null && response.getUbicaciones() != null 
                ? response.getUbicaciones() 
                : List.of();
            
            return Response.ok(centros).build();
        } catch (jakarta.ws.rs.WebApplicationException e) {
            return Response.status(e.getResponse().getStatus())
                    .entity("{\"error\":\"Error del middleware: " + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error interno: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Endpoint seguro para consultar parámetros SIPAP
     * Ejemplo: /api/middleware/sipap?dominio=motivos-sipap
     */
    @GET
    @Path("/sipap")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerParametrosSipap(@QueryParam("dominio") String dominio) {
        try {
            String dominioParam = dominio != null ? dominio : "motivos-sipap";
            String bearerToken = "Bearer " + jwtToken;
            
            List<ParametroSipap> parametros = middlewareClient.obtenerParametrosSipap(
                dominioParam,
                INTERFISA_VERSION,
                bearerToken
            );
            
            return Response.ok(parametros).build();
        } catch (jakarta.ws.rs.WebApplicationException e) {
            if (e.getResponse().getStatus() == 403) {
                return Response.status(Response.Status.FORBIDDEN)
                        .entity("{\"error\":\"Token JWT inválido o expirado. Configure JWT_TOKEN con un token válido.\"}")
                        .build();
            } else if (e.getResponse().getStatus() == 401) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("{\"error\":\"No autorizado. Verifique el token JWT.\"}")
                        .build();
            }
            return Response.status(e.getResponse().getStatus())
                    .entity("{\"error\":\"Error del servidor middleware: " + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error interno: " + e.getMessage() + "\"}")
                    .build();
        }
    }


    

}