package at.lowco.dtos;

import at.lowco.model.Survey;

public class UserSurveyDTO {
    private Long id;
    private Double value;
    private String unit;
    public Boolean isAQuick;
    private Survey survey;

    public UserSurveyDTO(Long id, Double value, String unit, Boolean isAQuick, Survey survey) {
        this.id = id;
        this.value = value;
        this.unit = unit;
        this.isAQuick = isAQuick;
        this.survey = survey;
    }

    public Long getId() {
        return id;
    }

    public Survey getSurvey() {
        return survey;
    }

    public Double getValue() {
        return value;
    }

    public String getUnit() {
        return unit;
    }

    public Boolean getIsAQuick() {
        return isAQuick;
    }
}