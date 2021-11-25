package com.demonorium.database.repository;

import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.CallSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CallPairRepository extends JpaRepository<CallPair, Long> {
}
