package org.acme.getting.started.client;

import org.acme.getting.started.dto.CentrosServicioResponse;
import org.acme.getting.started.dto.ParametroSipap;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import java.util.List;

@RegisterRestClient(configKey = "middleware-api")
@ApplicationScoped
@Path("/api")
public interface MiddlewareApiClient {
    
    /**
     * Consulta pública de centros de servicio
     * No requiere autenticación
     */
    @GET
    @Path("/common/centros-servicios")
    CentrosServicioResponse obtenerCentrosServicio(
            @QueryParam("nombreODireccion") String nombreODireccion,
            @HeaderParam("X-INTERFISA-BE-VERSION") String version
    );
    
    /**
     * Consulta segura de parámetros SIPAP
     * Requiere token JWT
     */
    @GET
    @Path("/secure/common/parametros")
    List<ParametroSipap> obtenerParametrosSipap(
            @QueryParam("dominio") String dominio,
            @HeaderParam("X-INTERFISA-BE-VERSION") String version,
            @HeaderParam("Authorization") String authorization
    );
    

}