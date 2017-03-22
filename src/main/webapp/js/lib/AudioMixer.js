/**
 * AudioMixer.
 */
function AudioMixer() {
	Repository.apply(this, arguments);
	this.type = 'arraybuffer';
	this.ctx = null;
	if (window.AudioContext || window.webkitAudioContext) {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
	}
	this.dic = [];
	this.bgm = [];
	this.lastKey = null;
	this.lastTime = null;
}
AudioMixer.prototype = Object.create(Repository.prototype);
AudioMixer.INSTANCE = new AudioMixer();

AudioMixer.prototype.makeName = function(key) {
	var ua = navigator.userAgent.toLowerCase();

	if (ua.indexOf('edge') !== -1) {
		return 'audio/' + key + '.mp3';
	}
	return 'audio/' + key + '.webm';
};

AudioMixer.prototype.onload = function(key, name, data) {
	if (this.ctx === null) {
		this.done();
		return;
	}
	this.ctx.decodeAudioData(data, (buff)=> {
		this.dic[key] = buff;
		this.done();
	});
};

AudioMixer.prototype.play = function(key) {
	if (this.ctx === null || !this.dic[key]) {
		return;
	}
	var mixer = this;
	var len = arguments.length;
	var volume = 1 < len ? arguments[1] : 1;
	var isBgm = 2 < len ? arguments[2] : false;
	var pan = 3 < len ? arguments[3] : 0;
	var offset = 4 < len ? arguments[4] : 0;
	var buff = this.dic[key];
	var element = new AudioElement(this.ctx, buff, offset);

	if (isBgm) {
//console.log('d:' + buff.duration);
		element.source.loopEnd = buff.duration + 10;
		element.source.loop = false;
		this.bgm.push(element);
		this.lastKey = key;
	}
//console.log('offset:' + offset);
	element.gainNode.gain.value = volume;
	element.setPan(pan);
	this.lastTime = this.ctx.currentTime - offset;
};

AudioMixer.prototype.setPan = function(panValue) {
	this.bgm.forEach(function(element) {
		element.setPan(panValue);
	});
};

AudioMixer.prototype.fade = function() {
console.log('fade:');
	this.bgm.forEach(function(element) {
		element.fade();
	});
};

AudioMixer.prototype.stop = function() {
console.log('stop:');
	this.bgm.forEach(function(element) {
		element.stop();
	});
};

AudioMixer.prototype.getCurrentTime = function() {
	if (0 < this.bgm.length) {
		var validList = [];
	
		this.bgm.forEach(function(element) {
			if (!element.done) {
				validList.push(element);
			}
		});
		this.bgm = validList;
	}
	if (!this.bgm.length) {
		return null;
	}
	return this.ctx.currentTime - this.lastTime;
};

AudioMixer.prototype.setCurrentTime = function(time) {
	if (!this.bgm.length) {
		return;
	}
//console.log('setCurrentTime:' + time);
	this.stop();
	this.play(this.lastKey, 1, true, 0, time);
};

/**
 * AudioElement.
 */
function AudioElement(ctx, buff, offset) {
	var element = this;

	this.done = false;
	this.source = ctx.createBufferSource();
	this.gainNode = ctx.createGain();
	this.gainNode.connect(ctx.destination);
	if ('function' == typeof ctx.createStereoPanner) {
		this.panNode = ctx.createStereoPanner();
		this.panNode.connect(this.gainNode);
		this.source.connect(this.panNode);
	} else {
		this.panNode = null;
		this.source.connect(this.gainNode);
	}
	this.source.buffer = buff;
	this.source.start(0, offset);
	this.source.onended  = function() {
console.log('onended.');
		element.done = true;
	}
}

AudioElement.prototype.setPan = function(panValue) {
	if (this.panNode) {
		this.panNode.pan.value = panValue;
	}
};

AudioElement.prototype.fade = function() {
	var element = this;
	var gain = this.gainNode.gain;
	var val = gain.value;
	var fading = function() {
		if (Math.floor(val * 100) == 0) {
			element.stop();
			return;
		}
		val *= .7;
		gain.value = val;
		setTimeout(fading, 100);
	};
	fading();
};

AudioElement.prototype.stop = function() {
	if (!this.done) {
		this.source.stop();
	}
};
