CREATE TABLE IF NOT EXISTS public.users
(
    username character varying(64) NOT NULL,
    password_hash character varying(256) NOT NULL,

    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS public.sources
(
    id BIGSERIAL NOT NULL,
    owner_name character varying(64) NOT NULL
        REFERENCES public.users (username)
        ON DELETE CASCADE,
    default_schedule BIGINT
        REFERENCES public.schedules (id),

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.schedules
(
    id BIGSERIAL NOT NULL,
    source_id BIGSERIAL NOT NULL
        REFERENCES public.sources (id)
            ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.hmstamps
(
    id BIGSERIAL NOT NULL,
    schedule_id BIGINT NOT NULL
        REFERENCES public.schedules (id)
            ON DELETE CASCADE,
    minute SMALLINT NOT NULL,
    hour SMALLINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.teachers
(
    id BIGSERIAL NOT NULL,
    source_id BIGSERIAL NOT NULL
        REFERENCES public.sources (id)
            ON DELETE CASCADE,
    name character varying(50) NOT NULL,
    note character varying(50) NOT NULL,

    PRIMARY KEY (id)
);