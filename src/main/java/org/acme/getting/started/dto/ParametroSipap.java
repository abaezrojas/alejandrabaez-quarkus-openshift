package org.acme.getting.started.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ParametroSipap {
    private Integer codigoMotivo;
    private String motivo;
}