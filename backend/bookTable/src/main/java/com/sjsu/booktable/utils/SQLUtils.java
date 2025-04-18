package com.sjsu.booktable.utils;

import lombok.experimental.UtilityClass;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;

@UtilityClass
public class SQLUtils {

    public static boolean hasColumn(ResultSet rs, String columnName) throws SQLException {
        ResultSetMetaData metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();
        for (int i = 1; i <= columnCount; i++) {
            if (columnName.equalsIgnoreCase(metaData.getColumnName(i))) {
                return true;
            }
        }
        return false;
    }

    public static String buildPlaceholders(List<?> values) {
        return values.stream()
                .map(slot -> "?")
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
    }
}
