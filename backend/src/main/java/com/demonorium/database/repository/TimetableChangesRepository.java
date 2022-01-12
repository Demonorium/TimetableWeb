package com.demonorium.database.repository;

import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.TimetableChanges;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimetableChangesRepository extends CrudRepository<TimetableChanges, Long> {
    /**
     * Находит все изменения из указанного промежутка
     * @param sourceId - ид источника для которого ищем
     * @param from - начало промежутка
     * @param to - конец промежутка
     * @return
     */
    @Query(value="SELECT * FROM timetable_changes changes where (changes.date >= :startDt ) and (changes.date <= :endDt ) and (changes.source_id = :sourceId ) order by changes.date",
            nativeQuery = true)
    List<TimetableChanges> getChanges(
            @Param("sourceId") Long sourceId,
            @Param("startDt") Date from,
            @Param("endDt")   Date to);

    boolean existsBySourceAndDate(Source source, Date date);
    Optional<TimetableChanges> findBySourceAndDate(Source source, Date date);
}
