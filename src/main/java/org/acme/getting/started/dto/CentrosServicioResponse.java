package org.acme.getting.started.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CentrosServicioResponse {
    private List<CentroServicio> ubicaciones;
}