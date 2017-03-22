/**
 * Mocap player main.
 */
document.addEventListener('DOMContentLoaded', function() {
	var loading = document.getElementById('loading');
	var repositories = [AudioMixer.INSTANCE, MotionManager.INSTANCE];
	var motions = ['aachan.bvh', 'kashiyuka.bvh', 'nocchi.bvh'];
	var sound = 'Perfume_globalsite_sound';
	var view = $('#view');
	var slider = $('#slider');
	var isShift = false;
	var field = new Field();
	var cx = 0;
	var cy = 0;
	var which = 0;
	var onResize = function() {
		var body = $('body');
		var header = $('#header');
		var footer = $('#footer');
		var width = body.width();
		var height = body.height() - header.outerHeight(true) - footer.outerHeight(true) - 16;

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
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			cx = e.pageX;
			cy = e.pageY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			cx = touches.pageX;
			cy = touches.pageY;
		}
		which = e.which;
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (isMouse) {
//console.log('which:' + which);
			if (!which) {
				return;
			}
			tx = e.pageX;
			ty = e.pageY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		var diffH = cx - tx;
		var diffV = cy - ty;

		field.rotateH(diffH);
		field.rotateV(diffV);
		cx = tx;
		cy = ty;
	};
	var end = function(e) {
//console.log('end');
		which = 0;
	};
	var activate = function() {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			var frame = parseInt(time / 0.025);
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
	slider.change(function() {
		if (isShift) {
			return;
		}
		var frame = $(this).val();
		var time = frame * 0.025;

		field.shiftMotion(frame);
		AudioMixer.INSTANCE.setCurrentTime(time);
	});
	$(window).resize(onResize);
	$(window).resize();
	//
	$('#playButton').click(function() {
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			AudioMixer.INSTANCE.fade();
			return;
		}
		var panValue = field.getPanValue();
		var frame = slider.val();
		var time = frame * 0.025;

		AudioMixer.INSTANCE.play(sound, 1, true, panValue, time);
	});
	MotionManager.INSTANCE.reserve(motions);
	AudioMixer.INSTANCE.reserve([sound]);
	var checkLoading = function() {
		var loaded = 0;
		var max = 0;
		var isComplete = true;

		repositories.forEach(function(repo) {
			loaded += repo.loaded;
			max += repo.max;
			isComplete &= repo.isComplete();
		});
		var msg = loaded + '/' + max;

		loading.innerHTML = msg;
		if (isComplete) {
			$.mobile.loading('hide');
			loading.parentNode.removeChild(loading);
			activate();
			motions.forEach(function(key) {
				field.addMotion(MotionManager.INSTANCE.dic[key]);
			});
			return;
		}
		setTimeout(checkLoading, 100);
	};
	$.mobile.loading('show', {textVisible: true});
	checkLoading();
});
