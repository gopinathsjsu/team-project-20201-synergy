package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TableRequest;
import com.sjsu.booktable.repository.TableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceImplTest {

    @Mock
    private TableRepository tableRepository;

    @InjectMocks
    private TableServiceImpl tableService;

    private List<TableRequest> tableRequests;

    @BeforeEach
    void setUp() {
        TableRequest table1 = new TableRequest();
        table1.setSize(4);
        table1.setQuantity(2);

        TableRequest table2 = new TableRequest();
        table2.setSize(6);
        table2.setQuantity(1);

        tableRequests = Arrays.asList(table1, table2);
    }

    @Test
    void addTables_Success() {
        // Act
        tableService.addTables(1, tableRequests);

        // Assert
        verify(tableRepository).insertTables(eq(1), eq(tableRequests));
    }

    @Test
    void replaceTables_Success() {
        // Act
        tableService.replaceTables(1, tableRequests);

        // Assert
        verify(tableRepository).deleteByRestaurantId(1);
        verify(tableRepository).insertTables(eq(1), eq(tableRequests));
    }

    @Test
    void getTotalCapacity_Success() {
        // Arrange
        when(tableRepository.getTotalCapacity(anyInt())).thenReturn(14);

        // Act
        int result = tableService.getTotalCapacity(1);

        // Assert
        assertEquals(14, result);
        verify(tableRepository).getTotalCapacity(1);
    }

    @Test
    void getTotalCapacity_ZeroWhenNull() {
        // Arrange
        when(tableRepository.getTotalCapacity(anyInt())).thenReturn(null);

        // Act
        int result = tableService.getTotalCapacity(1);

        // Assert
        assertEquals(0, result);
        verify(tableRepository).getTotalCapacity(1);
    }
} 