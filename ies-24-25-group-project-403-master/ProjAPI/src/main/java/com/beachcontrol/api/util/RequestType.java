package com.beachcontrol.api.util;

public enum RequestType {
    GET,
    POST,
    PUT,
    DELETE;

    public static RequestType fromString(String value) {
        for (RequestType requestType : RequestType.values()) {
            if (requestType.name().equalsIgnoreCase(value)) {
                return requestType;
            }
        }
        return null;
    }
}