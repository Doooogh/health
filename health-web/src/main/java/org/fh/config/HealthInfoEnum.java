package org.fh.config;

public enum  HealthInfoEnum {

    HEART_RATE("HEART_RATE","心率","bpm"),
    STEP_NUMBER("STEP_NUMBER","步数","步"),
    WEIGHT("WEIGHT","体重","kg"),
    BLOOD_PRESSURE("BLOOD_PRESSURE","血压","mmHg"),
    BLOOD_GLUCOSE("BLOOD_GLUCOSE","血糖","mmol/L"),
    SLEEP_TIME("SLEEP_TIME","睡眠时长","h");
    private String dataType; //类型
    private String name;  //名字
    private String unit;  //单位


    HealthInfoEnum(String dataType, String name, String unit) {
        this.dataType = dataType;
        this.name = name;
        this.unit = unit;
    }


    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

}
