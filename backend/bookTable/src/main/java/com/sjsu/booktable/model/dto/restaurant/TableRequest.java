package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class TableRequest {

    @Min(1)
    private int size;

    @Min(1)
    private int quantity;
}
