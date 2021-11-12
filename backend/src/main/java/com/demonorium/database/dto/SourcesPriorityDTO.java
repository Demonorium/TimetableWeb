package com.demonorium.database.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(setterPrefix="with")
public class SourcesPriorityDTO implements Comparable<SourcesPriorityDTO> {
    /**
     * id этого приоритета
     */
    private Long id;
    /**
     * Имя источника
     */
    private String name;
    /**
     * id источника
     */
    private Long sourceId;
    /**
     * приоритет источника
     */
    private int priority;

    @Override
    public int compareTo(SourcesPriorityDTO o) {
        return this.priority - o.priority;
    }
}