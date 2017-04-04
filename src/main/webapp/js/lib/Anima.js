/**
 * Anima.
 * @author Hidetaka Sasai
 */
class Anima {
	constructor(json) {
		this.skeleton = new Skeleton(json.skeleton);
		this.name = '';
		this.motion = [];
		json.motion.forEach(frame => {
			var line = [];

			frame.forEach((boneMotion, ix) => {
				var mx = Matrix.NO_EFFECT;

				if (boneMotion != null) {
					var rx = Matrix.rotateX(boneMotion[0]);
					var ry = Matrix.rotateY(boneMotion[1]);
					var rz = Matrix.rotateZ(boneMotion[2]);
					var node = this.skeleton.list[ix];
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
			this.motion.push(line);
		});
	}

	getHead() {
		return this.skeleton.map['head'];
	}

	rotateH(value) {
		this.skeleton.rotationH = value;
		this.skeleton.calcRotationMatrix();
	}

	rotateV(value) {
		this.skeleton.rotationV = value;
		this.skeleton.calcRotationMatrix();
	}

	shift(motionNo, direction) {
		var ix = motionNo % this.motion.length;

	//console.log('ix:' + ix);
		this.skeleton.shift(this.motion[ix], direction);
	}

	calculate(isSimple) {
		this.skeleton.calculate(isSimple);
	}

	draw(ctx) {
		this.skeleton.draw(ctx);
	}
}
