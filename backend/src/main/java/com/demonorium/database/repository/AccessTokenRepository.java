package com.demonorium.database.repository;

import com.demonorium.database.entity.AccessToken;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AccessTokenRepository extends CrudRepository<AccessToken, Long> {
    Optional<AccessToken> findByUserAndReference_Source(User user, Source source);
}
