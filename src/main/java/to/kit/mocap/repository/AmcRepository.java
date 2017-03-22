package to.kit.mocap.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.mocap.entity.Amc;

/**
 * Amc Repository.
 * @author H.Sasai
 */
public interface AmcRepository extends JpaRepository<Amc, String> {
	// nop
}
