package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Document(collection = "users")   // MongoDB collection
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    private String id;   // MongoDB uses String id

    private String username;
    private String password;
    private String email;
    private String name;
    private double trustScore = 0.0;
    private int lendCount = 0;
    private int borrowCount = 0;

    @Builder.Default
    private List<String> roles = new ArrayList<>(); // Default empty list to avoid NPE

    // NEW: items the user owns (reference to Item IDs)
    @Builder.Default
    private List<String> ownedItemIds = new ArrayList<>();

    // UserDetails implementations
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
