package to.kit.mocap.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import to.kit.mocap.entity.Amc;
import to.kit.mocap.entity.AmcShort;
import to.kit.mocap.service.AmcService;
import to.kit.mocap.web.form.MotionForm;

@Controller
@RequestMapping("/amc")
public class AmcController {
	@Autowired
	private AmcService amcService;

	@RequestMapping("/list")
	@ResponseBody
	public List<AmcShort> list(MotionForm form) {
		return this.amcService.list(form.getKeyword());
	}

	@RequestMapping("/detail")
	@ResponseBody
	public Amc detail(MotionForm form) {
		return this.amcService.detail(form.getId());
	}
}
