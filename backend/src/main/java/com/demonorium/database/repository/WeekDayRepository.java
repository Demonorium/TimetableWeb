package com.demonorium.database.repository;

import com.demonorium.database.entity.WeekDay;
import org.springframework.data.repository.CrudRepository;

public interface WeekDayRepository extends CrudRepository<WeekDay, Long> {
}
