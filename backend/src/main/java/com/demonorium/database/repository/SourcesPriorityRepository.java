package com.demonorium.database.repository;

import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.SourcesPriority;
import com.demonorium.database.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SourcesPriorityRepository extends JpaRepository<SourcesPriority, Long> {
    Optional<SourcesPriority> findByUserAndSource(User user, Source source);
}
