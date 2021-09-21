package com.demonorium.database;

public enum Rights {
    DELETE, UPDATE, READ, READ_UPDATE, OWNER;
    static public boolean compatible(Rights owner, Rights request) {
        if (owner == OWNER)
            return true;
        if (request == owner)
            return true;
        if (request != DELETE)
            return owner == READ_UPDATE;
    }
}
