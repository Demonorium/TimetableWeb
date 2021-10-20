package com.demonorium.database.repository;

import com.demonorium.database.entity.CallPair;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CallPairRepository extends JpaRepository<CallPair, Long> {
}
