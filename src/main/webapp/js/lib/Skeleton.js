/**
 * Skeleton.
 * @author Hidetaka Sasai
 */
function Skeleton(data) {
	this.data = data;
	this.calcOrder = this.data.calcOrder == 'RotateTranslate' ? 0 : 1;
	this.list = [];
	this.map = {};
	this.offsetX = 0;
	this.offsetY = 0;
	this.scale = data.scale;
	this.rotationH = Math.PI / 4;
	this.rotationV = Math.PI / 8;
	this.rotationMatrix = Matrix.NO_EFFECT;
	this.init();
}

Skeleton.prototype.init = function() {
	var root = Object.assign(new Bone(), this.data.root);

	this.data.root = root;
	this.prepare(root);
	this.calcRotationMatrix();
};

Skeleton.prototype.prepare = function(node) {
	var skeleton = this;
	var children = [];

	this.list.push(node);
	node.prepare();
	node.joint.forEach(function(child) {
		child.parent = node;
		children.push(Object.assign(new Bone(), child));
	});
	node.joint = children;
	node.joint.forEach(function(child) {
		skeleton.prepare(child);
	});
	node.skeleton = this;
	this.map[node.name] = node;
};

Skeleton.prototype.calcRotationMatrix = function() {
	var mh = Matrix.rotateY(this.rotationH);

	this.rotationMatrix = Matrix.rotateX(this.rotationV).multiply(mh);
};

Skeleton.prototype.shift = function(motionList, direction) {
	var skeleton = this;

	motionList.forEach(function(motion, ix) {
		var bone = skeleton.list[ix];

		bone.motionMatrix = motion.rotate;
		if (motion.tx) {
			// root
			var prev = bone.pt;
			var x = skeleton.offsetX + prev.x + motion.tx * direction;
			var y = skeleton.offsetY + prev.y + motion.ty * direction;
			var z = prev.z + motion.tz * direction;

			bone.translateMatrix = new Matrix([[1,0,0,x],[0,1,0,y],[0,0,1,z],[0,0,0,1]]);
		}
	});
};

Skeleton.prototype.calculate = function(isSimple) {
	this.data.root.calculate(isSimple);
};

Skeleton.prototype.draw = function(ctx) {
/*	var pt = this.data.root.pt;
	var mx = this.rotationMatrix;
	var nt = mx.affine(pt.x, pt.y, pt.z);

	ctx.save();
	ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
	ctx.strokeText(this.data.name + ':' + nt.z, nt.x, -nt.y);
	ctx.restore();
	//*/
	ctx.save();
	ctx.lineWidth = 8;
	this.data.root.draw(ctx);
	ctx.restore();
};


/**
 * Bone.
 * @author Hidetaka Sasai
 */
function Bone() {
	this.pt = {x:0, y:0, z:0};
}

Bone.prototype.prepare = function() {
	var t = this.translate;
	var mx = Matrix.rotateX(this.axis.x);
	var my = Matrix.rotateY(this.axis.y);
	var mz = Matrix.rotateZ(this.axis.z);
	var am = mz.multiply(my).multiply(mx);

	this.translateMatrix = new Matrix([[1,0,0,t.x],[0,1,0,t.y],[0,0,1,t.z],[0,0,0,1]]);
	if (this.parent) {
		var parent = this.parent;
		var rx = Matrix.rotateX(-parent.axis.x);
		var ry = Matrix.rotateY(-parent.axis.y);
		var rz = Matrix.rotateZ(-parent.axis.z);
		var pm = rx.multiply(ry).multiply(rz);

		this.axisMatrix = pm.multiply(am);
	} else {
		this.axisMatrix = am;
	}
	this.motionMatrix = Matrix.NO_EFFECT;
};

Bone.prototype.getAccum = function() {
	var order = this.skeleton.calcOrder;

	if (this.parent) {
		var mat;

		if (order == 0) {
			mat = this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix);
		} else {
			mat = this.axisMatrix.multiply(this.translateMatrix).multiply(this.motionMatrix);
		}
		return this.parent.getAccum().multiply(mat);
	}
	return this.translateMatrix.multiply(this.motionMatrix);
};

Bone.prototype.calculate = function(isSimple) {
	this.pt = this.getAccum().affine(0, 0, 0);
	if (isSimple) {
		return;
	}
	this.joint.forEach(function(child) {
		child.calculate(false);
	});
};

Bone.prototype.conv = function(pt) {
	pt = this.skeleton.rotationMatrix.affine(pt.x, pt.y, pt.z);
	var pz = (pt.z + 2000) / 2000;
	var pmx = new Matrix([[pz,0,0,0],[0,pz,0,0],[0,0,pz,0],[0,0,0,1]]);

	return pmx.affine(pt.x, pt.y, pt.z);
};

Bone.prototype.drawLine = function(ctx) {
	var prevPt = this.conv(this.parent.pt);
	var nextPt = this.conv(this.pt);
	var scale = this.skeleton.scale;
	var nextX = nextPt.x * scale;
	var nextY = -nextPt.y * scale;
	var prevX = prevPt.x * scale;
	var prevY = -prevPt.y * scale;
	var dx = nextX - prevX;
	var dy = nextY - prevY;

	this.cx = prevX + dx / 2;
	this.cy = prevY + dy / 2;
	this.cz = nextPt.z;
	this.radian = Math.atan2(dy, dx);
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(nextX, nextY);
	ctx.stroke();
};

Bone.prototype.draw = function(ctx) {
	this.calculate();
	if (this.parent) {
		this.drawLine(ctx);
	}
	this.joint.forEach(function(child) {
		child.draw(ctx);
	});
};
