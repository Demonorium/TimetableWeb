package com.demonorium.database;

import com.demonorium.database.entity.Source;

/**
 * Данный интерефейс, должен быть у всех классов, на которые распространяются права доступа источника.
 * Используются для проверки доступа к объекту.
 */
public interface PartOfSource {
    /**
     * Метод для получения источника, к которому относится объект
     * @return источник к которому относится объект
     */
    Source getSource();
}
