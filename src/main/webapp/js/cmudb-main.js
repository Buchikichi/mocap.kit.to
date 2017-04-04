/**
 * Mocap player main.
 */
document.addEventListener('DOMContentLoaded', function() {
	let view = $('#view');
	let slider = $('#slider');
	let nameFlip = $('#nameFlip');
	let field = new Field();
	let cx = 0;
	let cy = 0;
	let which = 0;
	let onResize = function() {
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
	let start = function(e) {
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
	let touch = function(e) {
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
	let end = function(e) {
//console.log('end');
		which = 0;
	};
	let activate = function() {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		let time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			let frame = parseInt(time / 0.025);
//console.log('f:' + frame);
			field.shiftMotion(frame);
			slider.val(frame);
			slider.slider('refresh');
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
		let frame = slider.val();
		let time = frame * 0.025;

		field.shiftMotion(frame);
		AudioMixer.INSTANCE.setCurrentTime(time);
	});
	nameFlip.change(()=> {
		field.showName = nameFlip.prop('checked');
	});
	$(window).resize(onResize);
	activate();
	$(window).resize();
	//
	$('#playButton').click(()=> {
		let time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			AudioMixer.INSTANCE.fade();
			return;
		}
		AudioMixer.INSTANCE.play('Perfume_globalsite_sound', 1, true);
	});
	AudioMixer.INSTANCE.reserve([
		'Perfume_globalsite_sound',
	]);
	new MotionList(field);
});

class MotionList {
	constructor(field) {
		this.field = field;
		this.init();
	}

	init() {
		let ul = $('#searchPanel ul');

		ul.on('filterablebeforefilter', (e, data)=> {
			let keyword = data.input.val();

			this.list(keyword);
		});
	}

	list(keyword) {
		let ul = $('#searchPanel ul');
		let data = {
			keyword: keyword
		};

		ul.empty();
		if (keyword.length < 2) {
			return;
		}
		$.ajax({
			url: '/amc/list',
			dataType: 'json',
			data: data,
		}).then(response=> {
			this.setupList(response);
		});
	}

	setupList(list) {
		let ul = $('#searchPanel ul');

		list.forEach(rec=> {
			let anchor = $('<a></a>').text(rec.name);
			let li = $('<li></li>').append(anchor);
			let text = rec.name + rec.description;

			li.attr('data-filtertext', text);
			ul.append(li);
			anchor.click(()=> {
				this.load(rec);
			});
		});
		ul.filterable('refresh');
	}

	load(rec) {
		let data = {
			id: rec.id
		};

		$.mobile.loading('show', {textVisible: true});
		$.ajax({
			url: '/amc/detail',
			dataType: 'json',
			data: data,
		}).then(response=> {
			let data = JSON.parse(response.data);

			this.field.addMotion(rec.name, data);
			$.mobile.loading('hide');
		});
	}
}
