package com.demonorium.database.repository;

import com.demonorium.database.entity.TimetableChanges;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TimetableChangesRepository extends CrudRepository<TimetableChanges, Long> {
    Optional<TimetableChanges> findBySourceAndDate_YearAndDayIs(Long source, Integer year, Integer day);
}
