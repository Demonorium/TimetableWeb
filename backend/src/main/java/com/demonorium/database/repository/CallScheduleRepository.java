package com.demonorium.database.repository;

import com.demonorium.database.entity.CallSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CallScheduleRepository extends JpaRepository<CallSchedule, Long> {
}
