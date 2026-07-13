package org.acme.getting.started;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                      ContainerResponseContext responseContext) throws IOException {
        
        String origin = requestContext.getHeaderString("Origin");
        
        // Allow requests from localhost development servers
        if (origin != null && (origin.equals("http://localhost:5173") || 
                               origin.equals("http://localhost:3000") ||
                               origin.equals("http://localhost:8080"))) {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", origin);
            responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
            responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
            responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
            responseContext.getHeaders().add("Access-Control-Max-Age", "86400");
            responseContext.getHeaders().add("Access-Control-Expose-Headers", "Content-Type, Content-Length");
        }
        
        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            responseContext.setStatus(Response.Status.OK.getStatusCode());
        }
    }
}
