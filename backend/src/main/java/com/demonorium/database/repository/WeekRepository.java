package com.demonorium.database.repository;

import com.demonorium.database.entity.Week;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface WeekRepository extends CrudRepository<Week, Long> {
    @Transactional
    @Query(value = "UPDATE weeks SET weeks.number = weeks.number-1 WHERE weeks.source_id= :sourceId AND weeks.number >= :fromIndex", nativeQuery = true)
    void updateAfterRemove(
            @Param("sourceId") Long sourceId,
            @Param("fromIndex") int fromIndex);
}
