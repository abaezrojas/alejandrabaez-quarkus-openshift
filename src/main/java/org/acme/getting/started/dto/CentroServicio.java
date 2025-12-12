package org.acme.getting.started.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CentroServicio {
    private String titulo;
    private String nombre;
    private String descripcion;
    private String direccion;
    private String ciudad;
    private String departamento;
    private String barrio;
    private Double latitud;
    private Double longitud;
    private String tipo;
}