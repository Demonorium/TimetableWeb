package com.demonorium.database.repository;

import com.demonorium.database.entity.CallSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallScheduleRepository extends JpaRepository<CallSchedule, Long> {
}
