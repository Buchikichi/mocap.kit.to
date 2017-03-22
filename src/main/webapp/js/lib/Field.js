/**
 * Field.
 * @author Hidetaka Sasai
 */
function Field() {
	this.motionNo = 0;
	this.rotationH = Field.DEFAULT_H;
	this.rotationV = Math.PI / 8;
	this.animaList = [];
	this.init();
}
Field.WIDTH = 960;
Field.HEIGHT = 540;
Field.DEFAULT_H = 155 * Math.PI / 180;
Field.COLOR_LIST = ['lightpink', 'palegreen', 'lightskyblue', 'orange'];

Field.prototype.init = function() {
	let canvas = document.getElementById('canvas');

	this.ctx = canvas.getContext('2d');
};

Field.prototype.resetCanvas = function(width, height) {
	this.width = width;
	this.height = height;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.scale = width / Field.WIDTH / 2;
	$('#canvas').attr('width', this.width).attr('height', this.height);
};

Field.prototype.addMotion = function(data) {
	let slider = $('#slider');
	let len = data.motion.length - 1;
	let max = parseInt(slider.prop('max'));

console.log('motions:' + data.motion.length);
console.log('max:' + max);
	this.animaList.push(new Anima(data));
	this.resetMotion();
	if (max < len) {
		slider.prop('max', len);
	}
	slider.slider('refresh');
};

Field.prototype.loadMotion = function(name) {
	let field = this;
	let slider = $('#slider');

	field.shiftMotion(0);
	slider.val(0).slider('refresh');
	return $.ajax('dat/' + name, {
		'dataType': 'json',
		'success': function(data) {
			field.addMotion(data);
		}
	});
};

Field.prototype.resetMotion = function() {
	let field = this;

	this.shiftMotion(0);
	this.rotateH(0);
	this.rotateV(0);
	this.draw();
};

Field.prototype.shiftMotion = function(motionNo) {
	let field = this;
	let direction = motionNo < this.motionNo ? -1 : 1;

	while (this.motionNo != motionNo) {
		if (0 < direction) this.motionNo += direction;
		this.animaList.forEach(function(anima) {
			anima.shift(field.motionNo, direction);
			anima.calculate(field.motionNo != motionNo);
		});
		if (direction < 0) this.motionNo += direction;
	}
};

Field.prototype.nextMotion = function() {
	let motionNo = this.motionNo;

	motionNo++;
	this.shiftMotion(motionNo);
};

Field.prototype.rotateH = function(diff) {
	let field = this;

	this.rotationH += (Math.PI / 720) * diff;
	this.rotationH = Math.trim(this.rotationH);
	this.animaList.forEach(function(anima) {
		anima.rotateH(field.rotationH);
	});
	AudioMixer.INSTANCE.setPan(this.getPanValue());
};

Field.prototype.getPanValue = function() {
	return Math.sin(this.rotationH - Field.DEFAULT_H);
};

Field.prototype.rotateV = function(diff) {
	let field = this;

	this.rotationV += (Math.PI / 720) * diff;
	this.rotationV = Math.trim(this.rotationV);
	this.animaList.forEach(function(anima) {
		anima.rotateV(field.rotationV);
	});
};

Field.prototype.draw = function() {
	let ctx = this.ctx;
	let colors = Field.COLOR_LIST.length;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
	ctx.strokeText('H:' + Math.floor(this.rotationH * 180 / Math.PI), 2, 20);
	ctx.strokeText('V:' + Math.floor(this.rotationV * 180 / Math.PI), 2, 30);
	ctx.strokeText('m:' + this.motionNo, 2, 40);
//	ctx.strokeText('pan:' + this.getPanValue(), 2, 50);
	ctx.translate(this.hW, this.hH);
	ctx.scale(this.scale, this.scale);
//ctx.beginPath();
//ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
//ctx.arc(0, 0, 3, 0, Math.PI * 2, false);
//ctx.fill();
	ctx.lineCap = 'round';
	this.animaList.forEach(function(anima, ix) {
		ctx.strokeStyle = Field.COLOR_LIST[ix % colors];
		anima.draw(ctx);
	});
	ctx.restore();
};
