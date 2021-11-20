package com.demonorium.database.repository;

import com.demonorium.database.entity.LessonTemplate;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonTemplateRepository extends CrudRepository<LessonTemplate, Long> {
}
