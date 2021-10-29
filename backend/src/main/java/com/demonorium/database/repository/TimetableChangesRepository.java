package com.demonorium.database.repository;

import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.TimetableChanges;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TimetableChangesRepository extends CrudRepository<TimetableChanges, Long> {
    Optional<TimetableChanges> findBySourceAndDate_YearAndDate_DayIs(Source source, Integer year, Integer day);
}
