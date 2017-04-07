package to.kit.mocap.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.mocap.entity.AmcShort;

/**
 * Amc Repository.
 * @author H.Sasai
 */
public interface AmcShortRepository extends JpaRepository<AmcShort, String> {
	Page<AmcShort> findByNameContainingOrLowerContaining(String name, String lower, Pageable pageable);
}
