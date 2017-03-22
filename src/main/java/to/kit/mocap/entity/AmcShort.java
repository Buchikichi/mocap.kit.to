package to.kit.mocap.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

/**
 * Amc.
 * @author H.Sasai
 */
@Data
@Entity(name = "amc")
public class AmcShort {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private String id;
	private String asfid;
	private String name;
	private String description;
}
