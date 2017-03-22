/**
 * MotionManager.
 */
function MotionManager() {
	Repository.apply(this, arguments);
}
MotionManager.prototype = Object.create(Repository.prototype);
MotionManager.INSTANCE = new MotionManager();

MotionManager.prototype.makeName = function(key) {
	return 'motion/' + key + '.json';
};
