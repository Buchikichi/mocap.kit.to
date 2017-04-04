var $jscomp={scope:{},owns:function(a,b){return Object.prototype.hasOwnProperty.call(a,b)}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Object.assign",function(a){return a?a:function(a,c){for(var b=1;b<arguments.length;b++){var e=arguments[b];if(e)for(var f in e)$jscomp.owns(e,f)&&(a[f]=e[f])}return a}},"es6-impl","es3");
var Anima=function(a){var b=this;this.skeleton=new Skeleton(a.skeleton);this.name="";this.motion=[];a.motion.forEach(function(a){var d=[];a.forEach(function(a,c){var e=Matrix.NO_EFFECT;if(null!=a){var f=Matrix.rotateX(a[0]),h=Matrix.rotateY(a[1]),m=Matrix.rotateZ(a[2]);b.skeleton.list[c].order.split("").forEach(function(a){"x"==a?e=e.multiply(f):"y"==a?e=e.multiply(h):"z"==a&&(e=e.multiply(m))})}var k={rotate:e};null!=a&&3<a.length&&(k.tx=a[3],k.ty=a[4],k.tz=a[5]);d.push(k)});b.motion.push(d)})};
Anima.prototype.getHead=function(){return this.skeleton.map.head};Anima.prototype.rotateH=function(a){this.skeleton.rotationH=a;this.skeleton.calcRotationMatrix()};Anima.prototype.rotateV=function(a){this.skeleton.rotationV=a;this.skeleton.calcRotationMatrix()};Anima.prototype.shift=function(a,b){this.skeleton.shift(this.motion[a%this.motion.length],b)};Anima.prototype.calculate=function(a){this.skeleton.calculate(a)};Anima.prototype.draw=function(a){this.skeleton.draw(a)};
function AudioMixer(){Repository.apply(this,arguments);this.type="arraybuffer";this.ctx=null;if(window.AudioContext||window.webkitAudioContext)this.ctx=new (window.AudioContext||window.webkitAudioContext);this.dic=[];this.bgm=[];this.lastTime=this.lastKey=null}AudioMixer.prototype=Object.create(Repository.prototype);AudioMixer.INSTANCE=new AudioMixer;AudioMixer.prototype.makeName=function(a){return-1!==navigator.userAgent.toLowerCase().indexOf("edge")?"audio/"+a+".mp3":"audio/"+a+".webm"};
AudioMixer.prototype.onload=function(a,b,c){var d=this;null===this.ctx?this.done():this.ctx.decodeAudioData(c,function(b){d.dic[a]=b;d.done()})};
AudioMixer.prototype.play=function(a){if(null!==this.ctx&&this.dic[a]){var b=arguments.length,c=1<b?arguments[1]:1,d=2<b?arguments[2]:!1,e=3<b?arguments[3]:0,b=4<b?arguments[4]:0,f=this.dic[a],g=new AudioElement(this.ctx,f,b);d&&(g.source.loopEnd=f.duration+10,g.source.loop=!1,this.bgm.push(g),this.lastKey=a);g.gainNode.gain.value=c;g.setPan(e);this.lastTime=this.ctx.currentTime-b}};AudioMixer.prototype.setPan=function(a){this.bgm.forEach(function(b){b.setPan(a)})};
AudioMixer.prototype.fade=function(){console.log("fade:");this.bgm.forEach(function(a){a.fade()})};AudioMixer.prototype.stop=function(){console.log("stop:");this.bgm.forEach(function(a){a.stop()})};AudioMixer.prototype.getCurrentTime=function(){if(0<this.bgm.length){var a=[];this.bgm.forEach(function(b){b.done||a.push(b)});this.bgm=a}return this.bgm.length?this.ctx.currentTime-this.lastTime:null};
AudioMixer.prototype.setCurrentTime=function(a){this.bgm.length&&(this.stop(),this.play(this.lastKey,1,!0,0,a))};
function AudioElement(a,b,c){var d=this;this.done=!1;this.source=a.createBufferSource();this.gainNode=a.createGain();this.gainNode.connect(a.destination);"function"==typeof a.createStereoPanner?(this.panNode=a.createStereoPanner(),this.panNode.connect(this.gainNode),this.source.connect(this.panNode)):(this.panNode=null,this.source.connect(this.gainNode));this.source.buffer=b;this.source.start(0,c);this.source.onended=function(){console.log("onended.");d.done=!0}}
AudioElement.prototype.setPan=function(a){this.panNode&&(this.panNode.pan.value=a)};AudioElement.prototype.fade=function(){var a=this,b=this.gainNode.gain,c=b.value,d=function(){0==Math.floor(100*c)?a.stop():(c*=.7,b.value=c,setTimeout(d,100))};d()};AudioElement.prototype.stop=function(){this.done||this.source.stop()};function Field(){this.motionNo=0;this.rotationH=Field.DEFAULT_H;this.rotationV=Math.PI/8;this.animaList=[];this.showName=!1;this.init()}Field.WIDTH=960;Field.HEIGHT=540;
Field.DEFAULT_H=155*Math.PI/180;Field.COLOR_LIST=["lightpink","palegreen","lightskyblue","orange"];Field.prototype.init=function(){this.ctx=document.getElementById("canvas").getContext("2d")};Field.prototype.resetCanvas=function(a,b){this.width=a;this.height=b;this.hW=this.width/2;this.hH=this.height/2;this.scale=a/Field.WIDTH/2;$("#canvas").attr("width",this.width).attr("height",this.height)};
Field.prototype.addMotion=function(a,b){var c=$("#slider"),d=b.motion.length-1,e=parseInt(c.prop("max")),f=new Anima(b);console.log("motions:"+b.motion.length);console.log("max:"+e);f.name=a.split(".")[0];this.animaList.push(f);this.resetMotion();e<d&&c.prop("max",d);c.slider("refresh")};Field.prototype.loadMotion=function(a){var b=this,c=$("#slider");b.shiftMotion(0);c.val(0).slider("refresh");return $.ajax("dat/"+a,{dataType:"json",success:function(d){b.addMotion(a,d)}})};
Field.prototype.resetMotion=function(){this.shiftMotion(0);this.rotateH(0);this.rotateV(0);this.draw()};Field.prototype.shiftMotion=function(a){for(var b=this,c=a<this.motionNo?-1:1;this.motionNo!=a;)0<c&&(this.motionNo+=c),this.animaList.forEach(function(d){d.shift(b.motionNo,c);d.calculate(b.motionNo!=a)}),0>c&&(this.motionNo+=c)};Field.prototype.nextMotion=function(){var a=this.motionNo;a++;this.shiftMotion(a)};
Field.prototype.rotateH=function(a){var b=this;this.rotationH+=Math.PI/720*a;this.rotationH=Math.trim(this.rotationH);this.animaList.forEach(function(a){a.rotateH(b.rotationH)});AudioMixer.INSTANCE.setPan(this.getPanValue())};Field.prototype.getPanValue=function(){return Math.sin(this.rotationH-Field.DEFAULT_H)};Field.prototype.rotateV=function(a){var b=this;this.rotationV+=Math.PI/720*a;this.rotationV=Math.trim(this.rotationV);this.animaList.forEach(function(a){a.rotateV(b.rotationV)})};
Field.prototype.draw=function(){var a=this,b=this.ctx,c=Field.COLOR_LIST.length;b.clearRect(0,0,this.width,this.height);b.save();b.strokeStyle="rgba(255, 255, 255, .7)";b.strokeText("H:"+Math.floor(180*this.rotationH/Math.PI),2,20);b.strokeText("V:"+Math.floor(180*this.rotationV/Math.PI),2,30);b.strokeText("m:"+this.motionNo,2,40);b.translate(this.hW,this.hH);b.scale(this.scale,this.scale);b.lineCap="round";this.animaList.forEach(function(d,e){b.strokeStyle=Field.COLOR_LIST[e%c];d.draw(b);if(a.showName){var f=
d.getHead();b.save();b.font="24px 'Times New Roman'";b.strokeText(d.name,f.cx,f.cy);b.restore()}});b.restore()};Math.PI2=Math.PI2||2*Math.PI;Math.SQ=Math.SQ||Math.PI/2;Math.trim=Math.trim||function(a){for(;Math.PI<a;)a-=Math.PI2;for(;a<-Math.PI;)a+=Math.PI2;return a};Math.close=Math.close||function(a,b,c){b=Math.trim(a-b);return Math.abs(b)<=c?a:0<b?a-c:a+c};function Matrix(a){this.mat=a}Matrix.NO_EFFECT=new Matrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
Matrix.rotateX=function(a){return new Matrix([[1,0,0,0],[0,Math.cos(a),-Math.sin(a),0],[0,Math.sin(a),Math.cos(a),0],[0,0,0,1]])};Matrix.rotateY=function(a){return new Matrix([[Math.cos(a),0,Math.sin(a),0],[0,1,0,0],[-Math.sin(a),0,Math.cos(a),0],[0,0,0,1]])};Matrix.rotateZ=function(a){return new Matrix([[Math.cos(a),-Math.sin(a),0,0],[Math.sin(a),Math.cos(a),0,0],[0,0,1,0],[0,0,0,1]])};
Matrix.prototype.multiply=function(a){var b=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],c=a.mat;this.mat.forEach(function(a,e){a.forEach(function(d,g){for(var f=0,h=0;4>h;h++)f+=a[h]*c[h][g];b[e][g]=f})});return new Matrix(b)};Matrix.prototype.affine=function(a,b,c){var d=this.mat;return{x:d[0][0]*a+d[0][1]*b+d[0][2]*c+d[0][3],y:d[1][0]*a+d[1][1]*b+d[1][2]*c+d[1][3],z:d[2][0]*a+d[2][1]*b+d[2][2]*c+d[2][3]}};function MotionManager(){Repository.apply(this,arguments)}MotionManager.prototype=Object.create(Repository.prototype);
MotionManager.INSTANCE=new MotionManager;MotionManager.prototype.makeName=function(a){return"motion/"+a+".json"};function Repository(){this.loaded=this.max=0;this.dic={};this.reserved={};this.type="json"}Repository.prototype.isComplete=function(){return 0<this.max&&this.max==this.loaded};Repository.prototype.reserve=function(a){var b=this;a.forEach(function(a){null==a||a in b.reserved||(b.reserved[a]=!0,b.load(a))})};Repository.prototype.makeName=function(a){return a};
Repository.prototype.load=function(a){var b=this,c=new XMLHttpRequest,d=this.makeName(a);this.max++;c.open("GET",d,!0);c.responseType=this.type;c.addEventListener("loadend",function(){var e=c.response;b.dic[a]=e;b.onload(a,d,e)});c.send()};Repository.prototype.onload=function(a,b,c){this.done()};Repository.prototype.done=function(){this.loaded++};
function Skeleton(a){this.data=a;this.calcOrder="RotateTranslate"==this.data.calcOrder?0:1;this.list=[];this.map={};this.offsetY=this.offsetX=0;this.scale=a.scale;this.rotationH=Math.PI/4;this.rotationV=Math.PI/8;this.rotationMatrix=Matrix.NO_EFFECT;this.init()}Skeleton.prototype.init=function(){var a=Object.assign(new Bone,this.data.root);this.data.root=a;this.prepare(a);this.calcRotationMatrix()};
Skeleton.prototype.prepare=function(a){var b=this,c=[];this.list.push(a);a.prepare();a.joint.forEach(function(b){b.parent=a;c.push(Object.assign(new Bone,b))});a.joint=c;a.joint.forEach(function(a){b.prepare(a)});a.skeleton=this;this.map[a.name]=a};Skeleton.prototype.calcRotationMatrix=function(){var a=Matrix.rotateY(this.rotationH);this.rotationMatrix=Matrix.rotateX(this.rotationV).multiply(a)};
Skeleton.prototype.shift=function(a,b){var c=this;a.forEach(function(a,e){var d=c.list[e];d.motionMatrix=a.rotate;if(a.tx){var g=d.pt;d.translateMatrix=new Matrix([[1,0,0,c.offsetX+g.x+a.tx*b],[0,1,0,c.offsetY+g.y+a.ty*b],[0,0,1,g.z+a.tz*b],[0,0,0,1]])}})};Skeleton.prototype.calculate=function(a){this.data.root.calculate(a)};Skeleton.prototype.draw=function(a){a.save();a.lineWidth=8;this.data.root.draw(a);a.restore()};function Bone(){this.pt={x:0,y:0,z:0}}
Bone.prototype.prepare=function(){var a=this.translate,b=Matrix.rotateX(this.axis.x),c=Matrix.rotateY(this.axis.y),b=Matrix.rotateZ(this.axis.z).multiply(c).multiply(b);this.translateMatrix=new Matrix([[1,0,0,a.x],[0,1,0,a.y],[0,0,1,a.z],[0,0,0,1]]);if(this.parent){var d=this.parent,a=Matrix.rotateX(-d.axis.x),c=Matrix.rotateY(-d.axis.y),d=Matrix.rotateZ(-d.axis.z);this.axisMatrix=a.multiply(c).multiply(d).multiply(b)}else this.axisMatrix=b;this.motionMatrix=Matrix.NO_EFFECT};
Bone.prototype.getAccum=function(){var a=this.skeleton.calcOrder;return this.parent?(a=0==a?this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix):this.axisMatrix.multiply(this.translateMatrix).multiply(this.motionMatrix),this.parent.getAccum().multiply(a)):this.translateMatrix.multiply(this.motionMatrix)};Bone.prototype.calculate=function(a){this.pt=this.getAccum().affine(0,0,0);a||this.joint.forEach(function(a){a.calculate(!1)})};
Bone.prototype.conv=function(a){a=this.skeleton.rotationMatrix.affine(a.x,a.y,a.z);var b=(a.z+2E3)/2E3;return(new Matrix([[b,0,0,0],[0,b,0,0],[0,0,b,0],[0,0,0,1]])).affine(a.x,a.y,a.z)};Bone.prototype.drawLine=function(a){var b=this.conv(this.parent.pt),c=this.conv(this.pt),d=this.skeleton.scale,e=c.x*d,f=-c.y*d,g=b.x*d,b=-b.y*d,d=e-g,l=f-b;this.cx=g+d/2;this.cy=b+l/2;this.cz=c.z;this.radian=Math.atan2(l,d);a.beginPath();a.moveTo(g,b);a.lineTo(e,f);a.stroke()};
Bone.prototype.draw=function(a){this.calculate();this.parent&&this.drawLine(a);this.joint.forEach(function(b){b.draw(a)})};
document.addEventListener("DOMContentLoaded",function(){var a=$("#view"),b=$("#slider"),c=$("#nameFlip"),d=new Field,e=0,f=0,g=0,l=function(a){if(a.type.match(/^mouse/))e=a.pageX,f=a.pageY;else if(a.originalEvent.touches){var b=a.originalEvent.touches[0];e=b.pageX;f=b.pageY}g=a.which},h=function(a){var b,c;if(a.type.match(/^mouse/)){if(!g)return;b=a.pageX;c=a.pageY}else a.originalEvent.touches&&(c=a.originalEvent.touches[0],b=c.pageX,c=c.pageY);a=f-c;d.rotateH(e-b);d.rotateV(a);e=b;f=c},m=function(a){g=
0},k=function(){var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,c=AudioMixer.INSTANCE.getCurrentTime();c&&(c=parseInt(c/.025),d.shiftMotion(c),b.val(c),b.slider("refresh"));d.draw();a(k)};a.mousedown(l);a.mousemove(h);a.mouseleave(m);a.mouseup(m);a.bind("touchstart",l);a.bind("touchmove",h);a.bind("touchend",m);b.change(function(){var a=b.val(),c=.025*a;d.shiftMotion(a);AudioMixer.INSTANCE.setCurrentTime(c)});
c.change(function(){d.showName=c.prop("checked")});$(window).resize(function(){var a=$("body"),b=$("#header"),c=$("#footer"),e=a.width(),a=a.height()-b.outerHeight(!0)-c.outerHeight(!0)-16;a/9<e/16?e=parseInt(a/9*16):a=parseInt(e/16*9);d.resetCanvas(e,a)});k();$(window).resize();$("#playButton").click(function(){AudioMixer.INSTANCE.getCurrentTime()?AudioMixer.INSTANCE.fade():AudioMixer.INSTANCE.play("Perfume_globalsite_sound",1,!0)});AudioMixer.INSTANCE.reserve(["Perfume_globalsite_sound"]);new MotionList(d)});
var MotionList=function(a){this.field=a;this.init()};MotionList.prototype.init=function(){var a=this;$("#searchPanel ul").on("filterablebeforefilter",function(b,c){var d=c.input.val();a.list(d)})};MotionList.prototype.list=function(a){var b=this,c=$("#searchPanel ul"),d={keyword:a};c.empty();2>a.length||$.ajax({url:"/amc/list",dataType:"json",data:d}).then(function(a){b.setupList(a)})};
MotionList.prototype.setupList=function(a){var b=this,c=$("#searchPanel ul");a.forEach(function(a){var d=$("<a></a>").text(a.name),f=$("<li></li>").append(d);f.attr("data-filtertext",a.name+a.description);c.append(f);d.click(function(){b.load(a)})});c.filterable("refresh")};MotionList.prototype.load=function(a){var b=this,c={id:a.id};$.mobile.loading("show",{textVisible:!0});$.ajax({url:"/amc/detail",dataType:"json",data:c}).then(function(c){c=JSON.parse(c.data);b.field.addMotion(a.name,c);$.mobile.loading("hide")})};
