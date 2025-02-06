package weather;

import java.util.List;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class IpmaCities {
  @SerializedName("data")
  @Expose
  private List<IpmaCities> data = null;
  @SerializedName("globalIdLocal")
  @Expose
  private Integer globalIdLocal;
  @SerializedName("local")
  @Expose
  private String local;

  public List<IpmaCities> getData() {
    return data;
  }

  public Integer getGlobalIdLocal() {
    return globalIdLocal;
  }

  public String getLocal() {
    return local;
  }
}
