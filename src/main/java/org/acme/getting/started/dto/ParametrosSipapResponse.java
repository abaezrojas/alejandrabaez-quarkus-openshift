package org.acme.getting.started.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ParametrosSipapResponse {
    private boolean success;
    private String message;
    private List<ParametroSipap> data;
    private int total;
    private String status;
}