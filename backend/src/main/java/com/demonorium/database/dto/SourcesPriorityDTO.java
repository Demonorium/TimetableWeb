package com.demonorium.database.dto;

import com.demonorium.database.entity.SourcesPriority;
import lombok.Data;

@Data
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


    public SourcesPriorityDTO(SourcesPriority priority) {
        this.id = priority.getId();
        this.name = priority.getSource().getName();
        this.sourceId = priority.getSourceId();
        this.priority = priority.getPriority();
    }

    @Override
    public int compareTo(SourcesPriorityDTO o) {
        return this.priority - o.priority;
    }


}
