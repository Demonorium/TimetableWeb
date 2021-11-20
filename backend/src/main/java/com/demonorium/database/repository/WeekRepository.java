package com.demonorium.database.repository;

import com.demonorium.database.entity.Week;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeekRepository extends CrudRepository<Week, Long> {
}
