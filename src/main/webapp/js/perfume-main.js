/**
 * Mocap player main.
 */
document.addEventListener('DOMContentLoaded', ()=> {
	let loading = document.getElementById('loading');
	let repositories = [AudioMixer.INSTANCE, MotionManager.INSTANCE];
	let motions = ['aachan.bvh', 'kashiyuka.bvh', 'nocchi.bvh'];
	let sound = 'Perfume_globalsite_sound';
	let view = $('#view');
	let slider = $('#slider');
	let nameFlip = $('#nameFlip');
	let isShift = false;
	let field = new Field();
	let cx = 0;
	let cy = 0;
	let which = 0;
	let onResize = ()=> {
		let body = $('body');
		let header = $('#header');
		let footer = $('#footer');
		let width = body.width();
		let height = body.height() - header.outerHeight(true) - footer.outerHeight(true) - 16;

		if (height / 9 < width / 16) {
			width = parseInt(height / 9 * 16);
		} else {
			height = parseInt(width / 16 * 9);
		}
		field.resetCanvas(width, height);
//		console.log('header:' + header.outerHeight());
//		console.log('footer:' + footer.outerHeight());
//		console.log('body:' + body.height());
//		console.log('body:' + body.innerHeight());
	}
	let start = e => {
		let isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			cx = e.pageX;
			cy = e.pageY;
		} else if (e.originalEvent.touches) {
			let touches = e.originalEvent.touches[0];
			cx = touches.pageX;
			cy = touches.pageY;
		}
		which = e.which;
	};
	let touch = e => {
		let isMouse = e.type.match(/^mouse/);
		let tx;
		let ty;

		if (isMouse) {
//console.log('which:' + which);
			if (!which) {
				return;
			}
			tx = e.pageX;
			ty = e.pageY;
		} else if (e.originalEvent.touches) {
			let touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		let diffH = cx - tx;
		let diffV = cy - ty;

		field.rotateH(diffH);
		field.rotateV(diffV);
		cx = tx;
		cy = ty;
	};
	let end = e => {
//console.log('end');
		which = 0;
	};
	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		let currentTime = AudioMixer.INSTANCE.getCurrentTime();

		if (currentTime) {
			let frame = parseInt(currentTime / 0.025);
//console.log('f:' + frame);
			field.shiftMotion(frame);
			isShift = true;
			slider.val(frame);
			slider.slider('refresh');
			isShift = false;
		}
		field.draw();
		requestAnimationFrame(activate);
	};

	view.mousedown(start);
	view.mousemove(touch);
	view.mouseleave(end);
	view.mouseup(end);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	view.bind('touchend', end);
	slider.change(()=> {
		if (isShift) {
			return;
		}
		let frame = slider.val();
		let time = frame * 0.025;

		field.shiftMotion(frame);
		AudioMixer.INSTANCE.setCurrentTime(time);
	});
	nameFlip.change(()=> {
		field.showName = nameFlip.prop('checked');
	});
	$(window).resize(onResize);
	$(window).resize();
	//
	$('#playButton').click(()=> {
		let currentTime = AudioMixer.INSTANCE.getCurrentTime();

		if (currentTime) {
			AudioMixer.INSTANCE.fade();
			return;
		}
		let panValue = field.getPanValue();
		let frame = slider.val();
		let time = frame * 0.025;

		AudioMixer.INSTANCE.play(sound, 1, true, panValue, time);
	});
	MotionManager.INSTANCE.reserve(motions);
	AudioMixer.INSTANCE.reserve([sound]);
	let checkLoading = ()=> {
		let loaded = 0;
		let max = 0;
		let isComplete = true;

		repositories.forEach(repo => {
			loaded += repo.loaded;
			max += repo.max;
			isComplete &= repo.isComplete();
		});
		let msg = loaded + '/' + max;

		loading.innerHTML = msg;
		if (isComplete) {
			$.mobile.loading('hide');
			loading.parentNode.removeChild(loading);
			activate();
			motions.forEach(key => {
				field.addMotion(key, MotionManager.INSTANCE.dic[key]);
			});
			return;
		}
		setTimeout(checkLoading, 100);
	};
	$.mobile.loading('show', {textVisible: true});
	checkLoading();
});
