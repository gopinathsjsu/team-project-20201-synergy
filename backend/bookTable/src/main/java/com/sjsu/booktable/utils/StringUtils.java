package com.sjsu.booktable.utils;

import lombok.experimental.UtilityClass;
import org.apache.logging.log4j.util.Strings;

@UtilityClass
public class StringUtils {

    public static String nullSafeString(String str) {
        return str == null ? Strings.EMPTY : str;
    }

    public static boolean isBlank(String str) {
        return str == null || str.isBlank();
    }

}
