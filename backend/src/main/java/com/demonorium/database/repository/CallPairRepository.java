package com.demonorium.database.repository;

import com.demonorium.database.entity.CallPair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallPairRepository extends JpaRepository<CallPair, Long> {
}
