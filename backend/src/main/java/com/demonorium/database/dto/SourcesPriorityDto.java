package com.demonorium.database.dto;

import com.demonorium.database.entity.SourcesPriority;
import lombok.Builder;
import lombok.Data;

@Data
@Builder(setterPrefix="with")
public class SourcesPriorityDto implements Comparable<SourcesPriorityDto> {
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
    public int compareTo(SourcesPriorityDto o) {
        return this.priority - o.priority;
    }
}
