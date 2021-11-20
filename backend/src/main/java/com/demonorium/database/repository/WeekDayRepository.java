package com.demonorium.database.repository;

import com.demonorium.database.entity.WeekDay;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeekDayRepository extends CrudRepository<WeekDay, Long> {
}
