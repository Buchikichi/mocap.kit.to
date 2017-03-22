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
@Entity
@Data
public class Amc {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private String id;
	private String asfid;
	private String name;
	private String description;
	private String data;
}
