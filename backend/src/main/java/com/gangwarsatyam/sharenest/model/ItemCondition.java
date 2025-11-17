package com.gangwarsatyam.sharenest.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ItemCondition {
    NEW,
    USED,
    GOOD,
    FAIR,
    OLD,
    DAMAGED;

    // Convert JSON string → Enum safely
    @JsonCreator
    public static ItemCondition fromString(String value) {
        if (value == null) return null;
        try {
            return ItemCondition.valueOf(value.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid item condition: " + value);
        }
    }

    // Return enum as lowercase string in JSON
    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
