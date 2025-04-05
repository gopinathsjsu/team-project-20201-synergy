package com.sjsu.booktable.model.dto;

import lombok.Data;

@Data
public class BTResponse<T> {
    private T data;
    private String status;

    public static <T> BTResponse<T> success(T data) {
        BTResponse<T> response = new BTResponse<>();
        response.setData(data);
        response.setStatus("success");
        return response;
    }

    public static <T> BTResponse<T> failure(String message) {
        BTResponse<T> response = new BTResponse<>();
        response.setStatus("failure");
        response.setData((T) message);
        return response;
    }

}
