package com.beachcontrol.api.model.User;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class Beachgoer extends User {
    
    @NotNull(message = "Favorites list cannot be null")
    private List<String> Favorites = new ArrayList<>();

    public Beachgoer() {
        super();
    }

    public Beachgoer(String name, String email, String password, String role, List<String> favorites) {
        super(name, email, password, "USER"); // Force role to be USER
        this.Favorites = favorites != null ? favorites : new ArrayList<>();
    }

    public void addFavorite(String beachId) {
        if (this.Favorites == null) {
            this.Favorites = new ArrayList<>();
        }
        if (beachId != null && !this.Favorites.contains(beachId)) {
            this.Favorites.add(beachId);
        }
    }


    public List<String> getFavorites() {
        return this.Favorites;
    }

    public void setFavorites(List<String> Favorites) {
        this.Favorites = Favorites;
    }

}