package com.demonorium.database.repository;

import com.demonorium.database.entity.Day;
import com.demonorium.database.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    @Transactional
    void deleteByDay(Day day);
}
