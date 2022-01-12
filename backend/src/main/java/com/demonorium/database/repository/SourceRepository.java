package com.demonorium.database.repository;

import com.demonorium.database.entity.Source;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends CrudRepository<Source, Long> {
}
