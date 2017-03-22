package to.kit.mocap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import to.kit.mocap.entity.Amc;
import to.kit.mocap.entity.AmcShort;
import to.kit.mocap.repository.AmcRepository;
import to.kit.mocap.repository.AmcShortRepository;

@Service
public class AmcService {
	@Autowired
	private AmcShortRepository amcShortRepository;
	@Autowired
	private AmcRepository amcRepository;

	public List<AmcShort> list(String keyword) {
		Pageable limit = new PageRequest(0, 10);
		Page<AmcShort> page = this.amcShortRepository.findByNameContainingOrDescriptionContaining(keyword, keyword, limit);
		List<AmcShort> list = page.getContent();

		return list;
	}

	public Amc detail(String id) {
		return this.amcRepository.findOne(id);
	}
}
