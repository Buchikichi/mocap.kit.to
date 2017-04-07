package to.kit.mocap.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

/**
 * Asf.
 * @author H.Sasai
 */
@Entity
@Data
public class Asf {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String id;
	private int subjectnumber;
	private String name;
	private String description;
}
