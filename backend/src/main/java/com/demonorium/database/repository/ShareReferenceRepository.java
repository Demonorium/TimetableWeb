package com.demonorium.database.repository;

import com.demonorium.database.entity.ShareReference;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShareReferenceRepository extends CrudRepository<ShareReference, String> {
}
