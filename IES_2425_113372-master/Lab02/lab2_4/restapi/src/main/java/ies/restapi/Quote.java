package ies.restapi;

public class Quote {
    private String id;
    private String text;
    private String show;

    public Quote(String id, String text, String show) {
        this.id = id;
        this.text = text;
        this.show = show;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getShow() {
        return show;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setShow(String show) {
        this.show = show;
    }
}
