package com.sjsu.booktable.utils;

import lombok.experimental.UtilityClass;

import java.util.Collections;
import java.util.List;

@UtilityClass
public class ListUtils {

    public static <T> List<T> nullSafeList(List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }
}
