package com.demonorium.database.repository;

import com.demonorium.database.entity.Day;
import org.springframework.data.repository.CrudRepository;

public interface DayRepository extends CrudRepository<Day, Long> {
}
