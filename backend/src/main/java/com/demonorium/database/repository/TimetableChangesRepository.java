package com.demonorium.database.repository;

import com.demonorium.database.entity.TimetableChanges;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TimetableChangesRepository extends CrudRepository<TimetableChanges, Long> {
    @Query(value="SELECT * FROM timetable_changes changes where (changes.date >= :startDt ) and (changes.date <= :endDt ) and (changes.source_id = :sourceId ) order by changes.date",
            nativeQuery = true)
    List<TimetableChanges> getChanges(
            @Param("sourceId") Long sourceId,
            @Param("startDt") Date from,
            @Param("endDt")   Date to);
}
