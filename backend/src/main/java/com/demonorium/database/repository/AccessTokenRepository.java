package com.demonorium.database.repository;

import com.demonorium.database.entity.AccessToken;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessTokenRepository extends CrudRepository<AccessToken, Long> {
    Optional<AccessToken> findByUserAndReference_Source(User user, Source source);
}
