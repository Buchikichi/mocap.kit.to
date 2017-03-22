/**
 * Anima.
 * @author Hidetaka Sasai
 */
function Anima(json) {
	var anima = this;

	this.skeleton = new Skeleton(json.skeleton);
	this.motion = [];
	json.motion.forEach(function(frame) {
		var line = [];

		frame.forEach(function(boneMotion, ix) {
			var mx = Matrix.NO_EFFECT;

			if (boneMotion != null) {
				var rx = Matrix.rotateX(boneMotion[0]);
				var ry = Matrix.rotateY(boneMotion[1]);
				var rz = Matrix.rotateZ(boneMotion[2]);
				var node = anima.skeleton.list[ix];
				var order = node.order.split('');

				order.forEach(function(o) {
					if (o == 'x') {
						mx = mx.multiply(rx);
					} else if (o == 'y') {
						mx = mx.multiply(ry);
					} else if (o == 'z') {
						mx = mx.multiply(rz);
					}
				});
			}
			var aMotion = {
				rotate : mx
			};
			if (boneMotion != null && 3 < boneMotion.length) {
				aMotion.tx = boneMotion[3];
				aMotion.ty = boneMotion[4];
				aMotion.tz = boneMotion[5];
			}
			line.push(aMotion);
		});
		anima.motion.push(line);
	});
}

Anima.prototype.rotateH = function(value) {
	this.skeleton.rotationH = value;
	this.skeleton.calcRotationMatrix();
};

Anima.prototype.rotateV = function(value) {
	this.skeleton.rotationV = value;
	this.skeleton.calcRotationMatrix();
};

Anima.prototype.shift = function(motionNo, direction) {
	var ix = motionNo % this.motion.length;

//console.log('ix:' + ix);
	this.skeleton.shift(this.motion[ix], direction);
};

Anima.prototype.calculate = function(isSimple) {
	this.skeleton.calculate(isSimple);
};

Anima.prototype.draw = function(ctx) {
	this.skeleton.draw(ctx);
};
