import { defineComponent as S, openBlock as v, createElementBlock as w, withDirectives as O, createElementVNode as u, normalizeStyle as C, vShow as H, createCommentVNode as X, normalizeClass as I, toDisplayString as b } from "vue";
const W = {};
W.getData = (t) => new Promise((e, s) => {
  let i = {};
  E(t).then((r) => {
    i.arrayBuffer = r;
    try {
      i.orientation = $(r);
    } catch {
      i.orientation = -1;
    }
    e(i);
  }).catch((r) => {
    s(r);
  });
});
function E(t) {
  let e = null;
  return new Promise((s, i) => {
    if (t.src)
      if (/^data\:/i.test(t.src))
        e = T(t.src), s(e);
      else if (/^blob\:/i.test(t.src)) {
        var r = new FileReader();
        r.onload = function(h) {
          e = h.target.result, s(e);
        }, L(t.src, function(h) {
          r.readAsArrayBuffer(h);
        });
      } else {
        var o = new XMLHttpRequest();
        o.onload = function() {
          if (this.status == 200 || this.status === 0)
            e = o.response, s(e);
          else
            throw "Could not load image";
          o = null;
        }, o.open("GET", t.src, !0), o.responseType = "arraybuffer", o.send(null);
      }
    else
      i("img error");
  });
}
function L(t, e) {
  var s = new XMLHttpRequest();
  s.open("GET", t, !0), s.responseType = "blob", s.onload = function(i) {
    (this.status == 200 || this.status === 0) && e(this.response);
  }, s.send();
}
function T(t, e) {
  e = e || t.match(/^data\:([^\;]+)\;base64,/mi)[1] || "", t = t.replace(/^data\:([^\;]+)\;base64,/gmi, "");
  for (var s = atob(t), i = s.length % 2 == 0 ? s.length : s.length + 1, r = new ArrayBuffer(i), o = new Uint16Array(r), h = 0; h < i; h++)
    o[h] = s.charCodeAt(h);
  return r;
}
function k(t, e, s) {
  var i = "", r;
  for (r = e, s += e; r < s; r++)
    i += String.fromCharCode(t.getUint8(r));
  return i;
}
function $(t) {
  var e = new DataView(t), s = e.byteLength, i, r, o, h, n, p, c, a, l, f;
  if (e.getUint8(0) === 255 && e.getUint8(1) === 216)
    for (l = 2; l < s; ) {
      if (e.getUint8(l) === 255 && e.getUint8(l + 1) === 225) {
        c = l;
        break;
      }
      l++;
    }
  if (c && (r = c + 4, o = c + 10, k(e, r, 4) === "Exif" && (p = e.getUint16(o), n = p === 18761, (n || p === 19789) && e.getUint16(o + 2, n) === 42 && (h = e.getUint32(o + 4, n), h >= 8 && (a = o + h)))), a) {
    for (s = e.getUint16(a, n), f = 0; f < s; f++)
      if (l = a + f * 12 + 2, e.getUint16(l, n) === 274) {
        l += 8, i = e.getUint16(l, n);
        break;
      }
  }
  return i;
}
const N = (t, e) => {
  const s = t.__vccOpts || t;
  for (const [i, r] of e)
    s[i] = r;
  return s;
}, A = S({
  data: function() {
    return {
      // 容器高宽
      w: 0,
      h: 0,
      // 图片缩放比例
      scale: 1,
      // 图片偏移x轴
      x: 0,
      // 图片偏移y轴
      y: 0,
      // 图片加载
      loading: !0,
      // 图片真实宽度
      trueWidth: 0,
      // 图片真实高度
      trueHeight: 0,
      move: !0,
      // 移动的x
      moveX: 0,
      // 移动的y
      moveY: 0,
      // 开启截图
      crop: !1,
      // 正在截图
      cropping: !1,
      // 裁剪框大小
      cropW: 0,
      cropH: 0,
      cropOldW: 0,
      cropOldH: 0,
      // 判断是否能够改变
      canChangeX: !1,
      canChangeY: !1,
      // 改变的基准点
      changeCropTypeX: 1,
      changeCropTypeY: 1,
      // 裁剪框的坐标轴
      cropX: 0,
      cropY: 0,
      cropChangeX: 0,
      cropChangeY: 0,
      cropOffsertX: 0,
      cropOffsertY: 0,
      // 支持的滚动事件
      support: "",
      // 移动端手指缩放
      touches: [],
      touchNow: !1,
      // 图片旋转
      rotate: 0,
      isIos: !1,
      orientation: 0,
      imgs: "",
      // 图片缩放系数
      coe: 0.2,
      // 是否正在多次缩放
      scaling: !1,
      scalingSet: "",
      coeStatus: "",
      // 控制emit触发频率
      isCanShow: !0,
      rotateX: 0,
      rotateY: 0
    };
  },
  props: {
    img: {
      type: [String, Blob, null, File],
      default: ""
    },
    // 输出图片压缩比
    outputSize: {
      type: Number,
      default: 1
    },
    outputType: {
      type: String,
      default: "jpeg"
    },
    info: {
      type: Boolean,
      default: !0
    },
    // 是否开启滚轮放大缩小
    canScale: {
      type: Boolean,
      default: !0
    },
    // 是否自成截图框
    autoCrop: {
      type: Boolean,
      default: !1
    },
    autoCropWidth: {
      type: [Number, String],
      default: 0
    },
    autoCropHeight: {
      type: [Number, String],
      default: 0
    },
    // 是否开启固定宽高比
    fixed: {
      type: Boolean,
      default: !1
    },
    // 宽高比 w/h
    fixedNumber: {
      type: Array,
      default: () => [1, 1]
    },
    // 固定大小 禁止改变截图框大小
    fixedBox: {
      type: Boolean,
      default: !1
    },
    // 输出截图是否缩放
    full: {
      type: Boolean,
      default: !1
    },
    // 是否可以拖动图片
    canMove: {
      type: Boolean,
      default: !0
    },
    // 是否可以拖动截图框
    canMoveBox: {
      type: Boolean,
      default: !0
    },
    // 上传图片按照原始比例显示
    original: {
      type: Boolean,
      default: !1
    },
    // 截图框能否超过图片
    centerBox: {
      type: Boolean,
      default: !1
    },
    // 是否根据dpr输出高清图片
    high: {
      type: Boolean,
      default: !0
    },
    // 截图框展示宽高类型
    infoTrue: {
      type: Boolean,
      default: !1
    },
    // 可以压缩图片宽高  默认不超过200
    maxImgSize: {
      type: [Number, String],
      default: 2e3
    },
    // 倍数  可渲染当前截图框的n倍 0 - 1000;
    enlarge: {
      type: [Number, String],
      default: 1
    },
    // 自动预览的固定宽度
    preW: {
      type: [Number, String],
      default: 0
    },
    /*
      图片布局方式 mode 实现和css背景一样的效果
      contain  居中布局 默认不会缩放 保证图片在容器里面 mode: 'contain'
      cover    拉伸布局 填充整个容器  mode: 'cover'
      如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为auto。 mode: '50px'
      如果有两个数值被给定，第一个将作为宽度值大小，第二个作为高度值大小。 mode: '50px 60px'
    */
    mode: {
      type: String,
      default: "contain"
    },
    //限制最小区域,可传1以上的数字和字符串，限制长宽都是这么大
    // 也可以传数组[90,90]
    limitMinSize: {
      type: [Number, Array, String],
      default: () => 10,
      validator: function(t) {
        return Array.isArray(t) ? Number(t[0]) >= 0 && Number(t[1]) >= 0 : Number(t) >= 0;
      }
    },
    // 导出时,填充背景颜色
    fillColor: {
      type: String,
      default: ""
    }
  },
  computed: {
    cropInfo() {
      let t = {};
      if (t.top = this.cropOffsertY > 21 ? "-21px" : "0px", t.width = this.cropW > 0 ? this.cropW : 0, t.height = this.cropH > 0 ? this.cropH : 0, this.infoTrue) {
        let e = 1;
        this.high && !this.full && (e = window.devicePixelRatio), this.enlarge !== 1 & !this.full && (e = Math.abs(Number(this.enlarge))), t.width = t.width * e, t.height = t.height * e, this.full && (t.width = t.width / this.scale, t.height = t.height / this.scale);
      }
      return t.width = t.width.toFixed(0), t.height = t.height.toFixed(0), t;
    },
    isIE() {
      return !!window.ActiveXObject || "ActiveXObject" in window;
    },
    passive() {
      return this.isIE ? null : {
        passive: !1
      };
    }
  },
  watch: {
    // 如果图片改变， 重新布局
    img() {
      this.checkedImg();
    },
    imgs(t) {
      t !== "" && this.reload();
    },
    cropW() {
      this.showPreview();
    },
    cropH() {
      this.showPreview();
    },
    cropOffsertX() {
      this.showPreview();
    },
    cropOffsertY() {
      this.showPreview();
    },
    scale(t, e) {
      this.showPreview();
    },
    x() {
      this.showPreview();
    },
    y() {
      this.showPreview();
    },
    autoCrop(t) {
      t && this.goAutoCrop();
    },
    // 修改了自动截图框
    autoCropWidth() {
      this.autoCrop && this.goAutoCrop();
    },
    autoCropHeight() {
      this.autoCrop && this.goAutoCrop();
    },
    mode() {
      this.checkedImg();
    },
    rotate() {
      this.showPreview();
    },
    rotateY() {
      this.showPreview();
    },
    rotateX() {
      this.showPreview();
    }
  },
  methods: {
    getVersion(t) {
      var e = navigator.userAgent.split(" "), s = "";
      let i = 0;
      const r = new RegExp(t, "i");
      for (var o = 0; o < e.length; o++)
        r.test(e[o]) && (s = e[o]);
      return s ? i = s.split("/")[1].split(".") : i = ["0", "0", "0"], i;
    },
    checkOrientationImage(t, e, s, i) {
      if (this.getVersion("chrome")[0] >= 81)
        e = -1;
      else if (this.getVersion("safari")[0] >= 605) {
        const h = this.getVersion("version");
        h[0] > 13 && h[1] > 1 && (e = -1);
      } else {
        const h = navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/);
        if (h) {
          let n = h[1];
          n = n.split("_"), (n[0] > 13 || n[0] >= 13 && n[1] >= 4) && (e = -1);
        }
      }
      let r = document.createElement("canvas"), o = r.getContext("2d");
      switch (o.save(), e) {
        case 2:
          r.width = s, r.height = i, o.translate(s, 0), o.scale(-1, 1);
          break;
        case 3:
          r.width = s, r.height = i, o.translate(s / 2, i / 2), o.rotate(180 * Math.PI / 180), o.translate(-s / 2, -i / 2);
          break;
        case 4:
          r.width = s, r.height = i, o.translate(0, i), o.scale(1, -1);
          break;
        case 5:
          r.height = s, r.width = i, o.rotate(0.5 * Math.PI), o.scale(1, -1);
          break;
        case 6:
          r.width = i, r.height = s, o.translate(i / 2, s / 2), o.rotate(90 * Math.PI / 180), o.translate(-s / 2, -i / 2);
          break;
        case 7:
          r.height = s, r.width = i, o.rotate(0.5 * Math.PI), o.translate(s, -i), o.scale(-1, 1);
          break;
        case 8:
          r.height = s, r.width = i, o.translate(i / 2, s / 2), o.rotate(-90 * Math.PI / 180), o.translate(-s / 2, -i / 2);
          break;
        default:
          r.width = s, r.height = i;
      }
      o.drawImage(t, 0, 0, s, i), o.restore(), r.toBlob(
        (h) => {
          let n = URL.createObjectURL(h);
          URL.revokeObjectURL(this.imgs), this.imgs = n;
        },
        "image/" + this.outputType,
        1
      );
    },
    // checkout img
    checkedImg() {
      if (this.img === null || this.img === "") {
        this.imgs = "", this.clearCrop();
        return;
      }
      this.loading = !0, this.scale = 1, this.rotate = 0, this.clearCrop();
      let t = new Image();
      if (t.onload = () => {
        if (this.img === "")
          return this.$emit("img-load", new Error("图片不能为空")), !1;
        let s = t.width, i = t.height;
        W.getData(t).then((r) => {
          this.orientation = r.orientation || 1;
          let o = Number(this.maxImgSize);
          if (!this.orientation && s < o & i < o) {
            this.imgs = this.img;
            return;
          }
          s > o && (i = i / s * o, s = o), i > o && (s = s / i * o, i = o), this.checkOrientationImage(t, this.orientation, s, i);
        }).catch((r) => {
          this.$emit("img-load", "error"), this.$emit("img-load-error", r);
        });
      }, t.onerror = (s) => {
        this.$emit("img-load", "error"), this.$emit("img-load-error", s);
      }, this.img.substr(0, 4) !== "data" && (t.crossOrigin = ""), this.isIE) {
        var e = new XMLHttpRequest();
        e.onload = function() {
          var s = URL.createObjectURL(this.response);
          t.src = s;
        }, e.open("GET", this.img, !0), e.responseType = "blob", e.send();
      } else
        t.src = this.img;
    },
    // 当按下鼠标键
    startMove(t) {
      if (t.preventDefault(), this.move && !this.crop) {
        if (!this.canMove)
          return !1;
        this.moveX = ("clientX" in t ? t.clientX : t.touches[0].clientX) - this.x, this.moveY = ("clientY" in t ? t.clientY : t.touches[0].clientY) - this.y, t.touches ? (window.addEventListener("touchmove", this.moveImg), window.addEventListener("touchend", this.leaveImg), t.touches.length == 2 && (this.touches = t.touches, window.addEventListener("touchmove", this.touchScale), window.addEventListener("touchend", this.cancelTouchScale))) : (window.addEventListener("mousemove", this.moveImg), window.addEventListener("mouseup", this.leaveImg)), this.$emit("img-moving", {
          moving: !0,
          axis: this.getImgAxis()
        });
      } else
        this.cropping = !0, window.addEventListener("mousemove", this.createCrop), window.addEventListener("mouseup", this.endCrop), window.addEventListener("touchmove", this.createCrop), window.addEventListener("touchend", this.endCrop), this.cropOffsertX = t.offsetX ? t.offsetX : t.touches[0].pageX - this.$refs.cropper.offsetLeft, this.cropOffsertY = t.offsetY ? t.offsetY : t.touches[0].pageY - this.$refs.cropper.offsetTop, this.cropX = "clientX" in t ? t.clientX : t.touches[0].clientX, this.cropY = "clientY" in t ? t.clientY : t.touches[0].clientY, this.cropChangeX = this.cropOffsertX, this.cropChangeY = this.cropOffsertY, this.cropW = 0, this.cropH = 0;
    },
    // 移动端缩放
    touchScale(t) {
      t.preventDefault();
      let e = this.scale;
      var s = {
        x: this.touches[0].clientX,
        y: this.touches[0].clientY
      }, i = {
        x: t.touches[0].clientX,
        y: t.touches[0].clientY
      }, r = {
        x: this.touches[1].clientX,
        y: this.touches[1].clientY
      }, o = {
        x: t.touches[1].clientX,
        y: t.touches[1].clientY
      }, h = Math.sqrt(
        Math.pow(s.x - r.x, 2) + Math.pow(s.y - r.y, 2)
      ), n = Math.sqrt(
        Math.pow(i.x - o.x, 2) + Math.pow(i.y - o.y, 2)
      ), p = n - h, c = 1;
      c = c / this.trueWidth > c / this.trueHeight ? c / this.trueHeight : c / this.trueWidth, c = c > 0.1 ? 0.1 : c;
      var a = c * p;
      if (!this.touchNow) {
        if (this.touchNow = !0, p > 0 ? e += Math.abs(a) : p < 0 && e > Math.abs(a) && (e -= Math.abs(a)), this.touches = t.touches, setTimeout(() => {
          this.touchNow = !1;
        }, 8), !this.checkoutImgAxis(this.x, this.y, e))
          return !1;
        this.scale = e;
      }
    },
    cancelTouchScale(t) {
      window.removeEventListener("touchmove", this.touchScale);
    },
    // 移动图片
    moveImg(t) {
      if (t.preventDefault(), t.touches && t.touches.length === 2)
        return this.touches = t.touches, window.addEventListener("touchmove", this.touchScale), window.addEventListener("touchend", this.cancelTouchScale), window.removeEventListener("touchmove", this.moveImg), !1;
      let e = "clientX" in t ? t.clientX : t.touches[0].clientX, s = "clientY" in t ? t.clientY : t.touches[0].clientY, i, r;
      i = e - this.moveX, r = s - this.moveY, this.$nextTick(() => {
        if (this.centerBox) {
          let o = this.getImgAxis(i, r, this.scale), h = this.getCropAxis(), n = this.trueHeight * this.scale, p = this.trueWidth * this.scale, c, a, l, f;
          switch (this.rotate) {
            case 1:
            case -1:
            case 3:
            case -3:
              c = this.cropOffsertX - this.trueWidth * (1 - this.scale) / 2 + (n - p) / 2, a = this.cropOffsertY - this.trueHeight * (1 - this.scale) / 2 + (p - n) / 2, l = c - n + this.cropW, f = a - p + this.cropH;
              break;
            default:
              c = this.cropOffsertX - this.trueWidth * (1 - this.scale) / 2, a = this.cropOffsertY - this.trueHeight * (1 - this.scale) / 2, l = c - p + this.cropW, f = a - n + this.cropH;
              break;
          }
          o.x1 >= h.x1 && (i = c), o.y1 >= h.y1 && (r = a), o.x2 <= h.x2 && (i = l), o.y2 <= h.y2 && (r = f);
        }
        this.x = i, this.y = r, this.$emit("img-moving", {
          moving: !0,
          axis: this.getImgAxis()
        });
      });
    },
    // 移动图片结束
    leaveImg(t) {
      window.removeEventListener("mousemove", this.moveImg), window.removeEventListener("touchmove", this.moveImg), window.removeEventListener("mouseup", this.leaveImg), window.removeEventListener("touchend", this.leaveImg), this.$emit("img-moving", {
        moving: !1,
        axis: this.getImgAxis()
      });
    },
    // 缩放图片
    scaleImg() {
      this.canScale && window.addEventListener(this.support, this.changeSize, this.passive);
    },
    // 移出框
    cancelScale() {
      this.canScale && window.removeEventListener(this.support, this.changeSize);
    },
    // 改变大小函数
    changeSize(t) {
      t.preventDefault();
      let e = this.scale;
      var s = t.deltaY || t.wheelDelta, i = navigator.userAgent.indexOf("Firefox");
      s = i > 0 ? s * 30 : s, this.isIE && (s = -s);
      var r = this.coe;
      r = r / this.trueWidth > r / this.trueHeight ? r / this.trueHeight : r / this.trueWidth;
      var o = r * s;
      o < 0 ? e += Math.abs(o) : e > Math.abs(o) && (e -= Math.abs(o));
      let h = o < 0 ? "add" : "reduce";
      if (h !== this.coeStatus && (this.coeStatus = h, this.coe = 0.2), this.scaling || (this.scalingSet = setTimeout(() => {
        this.scaling = !1, this.coe = this.coe += 0.01;
      }, 50)), this.scaling = !0, !this.checkoutImgAxis(this.x, this.y, e))
        return !1;
      this.scale = e;
    },
    // 修改图片大小函数
    changeScale(t) {
      let e = this.scale;
      t = t || 1;
      var s = 20;
      if (s = s / this.trueWidth > s / this.trueHeight ? s / this.trueHeight : s / this.trueWidth, t = t * s, t > 0 ? e += Math.abs(t) : e > Math.abs(t) && (e -= Math.abs(t)), !this.checkoutImgAxis(this.x, this.y, e))
        return !1;
      this.scale = e;
    },
    // 创建截图框
    createCrop(t) {
      t.preventDefault();
      var e = "clientX" in t ? t.clientX : t.touches ? t.touches[0].clientX : 0, s = "clientY" in t ? t.clientY : t.touches ? t.touches[0].clientY : 0;
      this.$nextTick(() => {
        var i = e - this.cropX, r = s - this.cropY;
        if (i > 0 ? (this.cropW = i + this.cropChangeX > this.w ? this.w - this.cropChangeX : i, this.cropOffsertX = this.cropChangeX) : (this.cropW = this.w - this.cropChangeX + Math.abs(i) > this.w ? this.cropChangeX : Math.abs(i), this.cropOffsertX = this.cropChangeX + i > 0 ? this.cropChangeX + i : 0), !this.fixed)
          r > 0 ? (this.cropH = r + this.cropChangeY > this.h ? this.h - this.cropChangeY : r, this.cropOffsertY = this.cropChangeY) : (this.cropH = this.h - this.cropChangeY + Math.abs(r) > this.h ? this.cropChangeY : Math.abs(r), this.cropOffsertY = this.cropChangeY + r > 0 ? this.cropChangeY + r : 0);
        else {
          var o = this.cropW / this.fixedNumber[0] * this.fixedNumber[1];
          o + this.cropOffsertY > this.h ? (this.cropH = this.h - this.cropOffsertY, this.cropW = this.cropH / this.fixedNumber[1] * this.fixedNumber[0], i > 0 ? this.cropOffsertX = this.cropChangeX : this.cropOffsertX = this.cropChangeX - this.cropW) : this.cropH = o, this.cropOffsertY = this.cropOffsertY;
        }
      });
    },
    // 改变截图框大小
    changeCropSize(t, e, s, i, r) {
      t.preventDefault(), window.addEventListener("mousemove", this.changeCropNow), window.addEventListener("mouseup", this.changeCropEnd), window.addEventListener("touchmove", this.changeCropNow), window.addEventListener("touchend", this.changeCropEnd), this.canChangeX = e, this.canChangeY = s, this.changeCropTypeX = i, this.changeCropTypeY = r, this.cropX = "clientX" in t ? t.clientX : t.touches[0].clientX, this.cropY = "clientY" in t ? t.clientY : t.touches[0].clientY, this.cropOldW = this.cropW, this.cropOldH = this.cropH, this.cropChangeX = this.cropOffsertX, this.cropChangeY = this.cropOffsertY, this.fixed && this.canChangeX && this.canChangeY && (this.canChangeY = 0), this.$emit("change-crop-size", {
        width: this.cropW,
        height: this.cropH
      });
    },
    // 正在改变
    changeCropNow(t) {
      t.preventDefault();
      var e = "clientX" in t ? t.clientX : t.touches ? t.touches[0].clientX : 0, s = "clientY" in t ? t.clientY : t.touches ? t.touches[0].clientY : 0;
      let i = this.w, r = this.h, o = 0, h = 0;
      if (this.centerBox) {
        let c = this.getImgAxis(), a = c.x2, l = c.y2;
        o = c.x1 > 0 ? c.x1 : 0, h = c.y1 > 0 ? c.y1 : 0, i > a && (i = a), r > l && (r = l);
      }
      const [n, p] = this.checkCropLimitSize();
      this.$nextTick(() => {
        var c = e - this.cropX, a = s - this.cropY;
        if (this.canChangeX && (this.changeCropTypeX === 1 ? this.cropOldW - c < n ? (this.cropW = n, this.cropOffsertX = this.cropOldW + this.cropChangeX - o - n) : this.cropOldW - c > 0 ? (this.cropW = i - this.cropChangeX - c <= i - o ? this.cropOldW - c : this.cropOldW + this.cropChangeX - o, this.cropOffsertX = i - this.cropChangeX - c <= i - o ? this.cropChangeX + c : o) : (this.cropW = Math.abs(c) + this.cropChangeX <= i ? Math.abs(c) - this.cropOldW : i - this.cropOldW - this.cropChangeX, this.cropOffsertX = this.cropChangeX + this.cropOldW) : this.changeCropTypeX === 2 && (this.cropOldW + c < n ? this.cropW = n : this.cropOldW + c > 0 ? (this.cropW = this.cropOldW + c + this.cropOffsertX <= i ? this.cropOldW + c : i - this.cropOffsertX, this.cropOffsertX = this.cropChangeX) : (this.cropW = i - this.cropChangeX + Math.abs(c + this.cropOldW) <= i - o ? Math.abs(c + this.cropOldW) : this.cropChangeX - o, this.cropOffsertX = i - this.cropChangeX + Math.abs(c + this.cropOldW) <= i - o ? this.cropChangeX - Math.abs(c + this.cropOldW) : o))), this.canChangeY && (this.changeCropTypeY === 1 ? this.cropOldH - a < p ? (this.cropH = p, this.cropOffsertY = this.cropOldH + this.cropChangeY - h - p) : this.cropOldH - a > 0 ? (this.cropH = r - this.cropChangeY - a <= r - h ? this.cropOldH - a : this.cropOldH + this.cropChangeY - h, this.cropOffsertY = r - this.cropChangeY - a <= r - h ? this.cropChangeY + a : h) : (this.cropH = Math.abs(a) + this.cropChangeY <= r ? Math.abs(a) - this.cropOldH : r - this.cropOldH - this.cropChangeY, this.cropOffsertY = this.cropChangeY + this.cropOldH) : this.changeCropTypeY === 2 && (this.cropOldH + a < p ? this.cropH = p : this.cropOldH + a > 0 ? (this.cropH = this.cropOldH + a + this.cropOffsertY <= r ? this.cropOldH + a : r - this.cropOffsertY, this.cropOffsertY = this.cropChangeY) : (this.cropH = r - this.cropChangeY + Math.abs(a + this.cropOldH) <= r - h ? Math.abs(a + this.cropOldH) : this.cropChangeY - h, this.cropOffsertY = r - this.cropChangeY + Math.abs(a + this.cropOldH) <= r - h ? this.cropChangeY - Math.abs(a + this.cropOldH) : h))), this.canChangeX && this.fixed) {
          var l = this.cropW / this.fixedNumber[0] * this.fixedNumber[1];
          l < p ? (this.cropH = p, this.cropW = this.fixedNumber[0] * p / this.fixedNumber[1], this.changeCropTypeX === 1 && (this.cropOffsertX = this.cropChangeX + (this.cropOldW - this.cropW))) : l + this.cropOffsertY > r ? (this.cropH = r - this.cropOffsertY, this.cropW = this.cropH / this.fixedNumber[1] * this.fixedNumber[0], this.changeCropTypeX === 1 && (this.cropOffsertX = this.cropChangeX + (this.cropOldW - this.cropW))) : this.cropH = l;
        }
        if (this.canChangeY && this.fixed) {
          var f = this.cropH / this.fixedNumber[1] * this.fixedNumber[0];
          f < n ? (this.cropW = n, this.cropH = this.fixedNumber[1] * n / this.fixedNumber[0], this.cropOffsertY = this.cropOldH + this.cropChangeY - this.cropH) : f + this.cropOffsertX > i ? (this.cropW = i - this.cropOffsertX, this.cropH = this.cropW / this.fixedNumber[0] * this.fixedNumber[1]) : this.cropW = f;
        }
      });
    },
    checkCropLimitSize() {
      let { cropW: t, cropH: e, limitMinSize: s } = this, i = new Array();
      return Array.isArray(s) ? i = s : i = [s, s], t = parseFloat(i[0]), e = parseFloat(i[1]), [t, e];
    },
    // 结束改变
    changeCropEnd(t) {
      window.removeEventListener("mousemove", this.changeCropNow), window.removeEventListener("mouseup", this.changeCropEnd), window.removeEventListener("touchmove", this.changeCropNow), window.removeEventListener("touchend", this.changeCropEnd);
    },
    // 根据比例x/y，最小宽度，最小高度，现有宽度，现有高度，得到应该有的宽度和高度
    calculateSize(t, e, s, i, r, o) {
      const h = t / e;
      let n = r, p = o;
      return n < s && (n = s, p = Math.ceil(n / h)), p < i && (p = i, n = Math.ceil(p * h), n < s && (n = s, p = Math.ceil(n / h))), n < r && (n = r, p = Math.ceil(n / h)), p < o && (p = o, n = Math.ceil(p * h)), { width: n, height: p };
    },
    // 创建完成
    endCrop() {
      this.cropW === 0 && this.cropH === 0 && (this.cropping = !1);
      let [t, e] = this.checkCropLimitSize();
      const { width: s, height: i } = this.fixed ? this.calculateSize(
        this.fixedNumber[0],
        this.fixedNumber[1],
        t,
        e,
        this.cropW,
        this.cropH
      ) : { width: t, height: e };
      s > this.cropW && (this.cropW = s, this.cropOffsertX + s > this.w && (this.cropOffsertX = this.w - s)), i > this.cropH && (this.cropH = i, this.cropOffsertY + i > this.h && (this.cropOffsertY = this.h - i)), window.removeEventListener("mousemove", this.createCrop), window.removeEventListener("mouseup", this.endCrop), window.removeEventListener("touchmove", this.createCrop), window.removeEventListener("touchend", this.endCrop);
    },
    // 开始截图
    startCrop() {
      this.crop = !0;
    },
    // 停止截图
    stopCrop() {
      this.crop = !1;
    },
    // 清除截图
    clearCrop() {
      this.cropping = !1, this.cropW = 0, this.cropH = 0;
    },
    // 截图移动
    cropMove(t) {
      if (t.preventDefault(), !this.canMoveBox)
        return this.crop = !1, this.startMove(t), !1;
      if (t.touches && t.touches.length === 2)
        return this.crop = !1, this.startMove(t), this.leaveCrop(), !1;
      window.addEventListener("mousemove", this.moveCrop), window.addEventListener("mouseup", this.leaveCrop), window.addEventListener("touchmove", this.moveCrop), window.addEventListener("touchend", this.leaveCrop);
      let e = "clientX" in t ? t.clientX : t.touches[0].clientX, s = "clientY" in t ? t.clientY : t.touches[0].clientY, i, r;
      i = e - this.cropOffsertX, r = s - this.cropOffsertY, this.cropX = i, this.cropY = r, this.$emit("crop-moving", {
        moving: !0,
        axis: this.getCropAxis()
      });
    },
    moveCrop(t, e) {
      let s = 0, i = 0;
      t && (t.preventDefault(), s = "clientX" in t ? t.clientX : t.touches[0].clientX, i = "clientY" in t ? t.clientY : t.touches[0].clientY), this.$nextTick(() => {
        let r, o, h = s - this.cropX, n = i - this.cropY;
        if (e && (h = this.cropOffsertX, n = this.cropOffsertY), h <= 0 ? r = 0 : h + this.cropW > this.w ? r = this.w - this.cropW : r = h, n <= 0 ? o = 0 : n + this.cropH > this.h ? o = this.h - this.cropH : o = n, this.centerBox) {
          let p = this.getImgAxis();
          r <= p.x1 && (r = p.x1), r + this.cropW > p.x2 && (r = p.x2 - this.cropW), o <= p.y1 && (o = p.y1), o + this.cropH > p.y2 && (o = p.y2 - this.cropH);
        }
        this.cropOffsertX = r, this.cropOffsertY = o, this.$emit("crop-moving", {
          moving: !0,
          axis: this.getCropAxis()
        });
      });
    },
    // 算出不同场景下面 图片相对于外层容器的坐标轴
    getImgAxis(t, e, s) {
      t = t || this.x, e = e || this.y, s = s || this.scale;
      let i = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      }, r = this.trueWidth * s, o = this.trueHeight * s;
      switch (this.rotate) {
        case 0:
          i.x1 = t + this.trueWidth * (1 - s) / 2, i.x2 = i.x1 + this.trueWidth * s, i.y1 = e + this.trueHeight * (1 - s) / 2, i.y2 = i.y1 + this.trueHeight * s;
          break;
        case 1:
        case -1:
        case 3:
        case -3:
          i.x1 = t + this.trueWidth * (1 - s) / 2 + (r - o) / 2, i.x2 = i.x1 + this.trueHeight * s, i.y1 = e + this.trueHeight * (1 - s) / 2 + (o - r) / 2, i.y2 = i.y1 + this.trueWidth * s;
          break;
        default:
          i.x1 = t + this.trueWidth * (1 - s) / 2, i.x2 = i.x1 + this.trueWidth * s, i.y1 = e + this.trueHeight * (1 - s) / 2, i.y2 = i.y1 + this.trueHeight * s;
          break;
      }
      return i;
    },
    // 获取截图框的坐标轴
    getCropAxis() {
      let t = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      };
      return t.x1 = this.cropOffsertX, t.x2 = t.x1 + this.cropW, t.y1 = this.cropOffsertY, t.y2 = t.y1 + this.cropH, t;
    },
    leaveCrop(t) {
      window.removeEventListener("mousemove", this.moveCrop), window.removeEventListener("mouseup", this.leaveCrop), window.removeEventListener("touchmove", this.moveCrop), window.removeEventListener("touchend", this.leaveCrop), this.$emit("crop-moving", {
        moving: !1,
        axis: this.getCropAxis()
      });
    },
    getCropChecked(t) {
      let e = document.createElement("canvas"), s = new Image(), i = this.rotate, r = this.trueWidth, o = this.trueHeight, h = this.cropOffsertX, n = this.cropOffsertY;
      s.onload = () => {
        if (this.cropW !== 0) {
          let a = e.getContext("2d"), l = 1;
          this.high & !this.full && (l = window.devicePixelRatio), this.enlarge !== 1 & !this.full && (l = Math.abs(Number(this.enlarge)));
          let f = this.cropW * l, g = this.cropH * l, d = r * this.scale * l, m = o * this.scale * l, Y = (this.x - h + this.trueWidth * (1 - this.scale) / 2) * l, x = (this.y - n + this.trueHeight * (1 - this.scale) / 2) * l;
          c(f, g), a.save(), this.fillColor && (a.fillStyle = this.fillColor, a.fillRect(0, 0, e.width, e.height));
          const y = (this.rotate || 0) * 90 * Math.PI / 180;
          this.full ? (c(f / this.scale, g / this.scale), a.translate(
            (d * 0.5 + Y) / this.scale,
            (m * 0.5 + x) / this.scale
          ), a.rotate(y), a.drawImage(
            s,
            -d * 0.5 / this.scale,
            -m * 0.5 / this.scale,
            d / this.scale,
            m / this.scale
          )) : (a.translate(d * 0.5 + Y, m * 0.5 + x), a.rotate(y), a.drawImage(s, -d * 0.5, -m * 0.5, d, m)), a.restore();
        } else {
          let a = r * this.scale, l = o * this.scale, f = e.getContext("2d");
          if (f.save(), this.fillColor && (f.fillStyle = this.fillColor, f.fillRect(0, 0, e.width, e.height)), rotateY) {
            const g = Math.cos(rotateY * Math.PI / 180), d = a / 2 - a * g / 2;
            f.transform(g, 0, 0, 1, d, 0);
          }
          if (rotateX) {
            const g = Math.cos(rotateX * Math.PI / 180), d = a / 2 - a * g / 2;
            f.transform(1, 0, 0, g, 0, d);
          }
          switch (i) {
            case 0:
              c(a, l), f.drawImage(s, 0, 0, a, l);
              break;
            case 1:
            case -3:
              c(l, a), f.rotate(i * 90 * Math.PI / 180), f.drawImage(s, 0, -l, a, l);
              break;
            case 2:
            case -2:
              c(a, l), f.rotate(i * 90 * Math.PI / 180), f.drawImage(s, -a, -l, a, l);
              break;
            case 3:
            case -1:
              c(l, a), f.rotate(i * 90 * Math.PI / 180), f.drawImage(s, -a, 0, a, l);
              break;
            default:
              c(a, l), f.rotate(i * 90 * Math.PI / 180), f.drawImage(s, 0, 0, a, l);
          }
          f.restore();
        }
        t(e);
      };
      var p = this.img.substr(0, 4);
      p !== "data" && (s.crossOrigin = "Anonymous"), s.src = this.imgs;
      function c(a, l) {
        e.width = Math.round(a), e.height = Math.round(l);
      }
    },
    // 获取转换成base64 的图片信息
    getCropData(t) {
      this.getCropChecked((e) => {
        t(e.toDataURL("image/" + this.outputType, this.outputSize));
      });
    },
    //canvas获取为blob对象
    getCropBlob(t) {
      this.getCropChecked((e) => {
        e.toBlob(
          (s) => t(s),
          "image/" + this.outputType,
          this.outputSize
        );
      });
    },
    // 自动预览函数
    showPreview() {
      if (this.isCanShow)
        this.isCanShow = !1, setTimeout(() => {
          this.isCanShow = !0;
        }, 16);
      else
        return !1;
      let t = this.cropW, e = this.cropH, s = this.scale;
      var i = {};
      i.div = {
        width: `${t}px`,
        height: `${e}px`
      };
      let r = (this.x - this.cropOffsertX) / s, o = (this.y - this.cropOffsertY) / s, h = 0;
      i.w = t, i.h = e, i.url = this.imgs, i.img = {
        width: `${this.trueWidth}px`,
        height: `${this.trueHeight}px`,
        transform: `scale(${s})translate3d(${r}px, ${o}px, ${h}px)rotateZ(${this.rotate * 90}deg) perspective(1000px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
      }, i.html = `
      <div class="show-preview" style="width: ${i.w}px; height: ${i.h}px,; overflow: hidden">
        <div style="width: ${t}px; height: ${e}px">
          <img src=${i.url} style="width: ${this.trueWidth}px; height: ${this.trueHeight}px; transform:
          scale(${s})translate3d(${r}px, ${o}px, ${h}px)rotateZ(${this.rotate * 90}deg) perspective(1000px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)">
        </div>
      </div>`, i.scale = s, i.rotate = this.rotate, i.rotateX = this.rotateX, i.rotateY = this.rotateY, i.cropOffsertX = this.cropOffsertX, i.cropOffsertY = this.cropOffsertY, this.$emit("real-time", i);
    },
    // reload 图片布局函数
    reload() {
      let t = new Image();
      t.onload = () => {
        this.w = parseFloat(window.getComputedStyle(this.$refs.cropper).width), this.h = parseFloat(window.getComputedStyle(this.$refs.cropper).height), this.trueWidth = t.width, this.trueHeight = t.height, this.original ? this.scale = 1 : this.scale = this.checkedMode(), this.$nextTick(() => {
          this.x = -(this.trueWidth - this.trueWidth * this.scale) / 2 + (this.w - this.trueWidth * this.scale) / 2, this.y = -(this.trueHeight - this.trueHeight * this.scale) / 2 + (this.h - this.trueHeight * this.scale) / 2, this.loading = !1, this.autoCrop && this.goAutoCrop(), this.$emit("img-load", "success"), setTimeout(() => {
            this.showPreview();
          }, 20);
        });
      }, t.onerror = () => {
        this.$emit("img-load", "error");
      }, t.src = this.imgs;
    },
    // 背景布局的函数
    checkedMode() {
      let t = 1, e = this.trueWidth, s = this.trueHeight;
      const i = this.mode.split(" ");
      switch (i[0]) {
        case "contain":
          this.trueWidth > this.w && (t = this.w / this.trueWidth), this.trueHeight * t > this.h && (t = this.h / this.trueHeight);
          break;
        case "cover":
          e = this.w, t = e / this.trueWidth, s = s * t, s < this.h && (s = this.h, t = s / this.trueHeight);
          break;
        default:
          try {
            let r = i[0];
            if (r.search("px") !== -1) {
              r = r.replace("px", ""), e = parseFloat(r);
              const o = e / this.trueWidth;
              let h = 1, n = i[1];
              n.search("px") !== -1 && (n = n.replace("px", ""), s = parseFloat(n), h = s / this.trueHeight), t = Math.min(o, h);
            }
            if (r.search("%") !== -1 && (r = r.replace("%", ""), e = parseFloat(r) / 100 * this.w, t = e / this.trueWidth, this.trueHeight * t > this.h && (t = this.h / this.trueHeight)), i.length === 2 && r === "auto") {
              let o = i[1];
              o.search("px") !== -1 && (o = o.replace("px", ""), s = parseFloat(o), t = s / this.trueHeight), o.search("%") !== -1 && (o = o.replace("%", ""), s = parseFloat(o) / 100 * this.h, t = s / this.trueHeight);
            }
          } catch {
            t = 1;
          }
      }
      return t;
    },
    // 自动截图函数
    goAutoCrop(t, e) {
      if (this.imgs === "" || this.imgs === null)
        return;
      this.clearCrop(), this.cropping = !0;
      let s = this.w, i = this.h;
      if (this.centerBox) {
        const h = Math.abs(this.rotate) % 2 > 0;
        let n = (h ? this.trueHeight : this.trueWidth) * this.scale, p = (h ? this.trueWidth : this.trueHeight) * this.scale;
        s = n < s ? n : s, i = p < i ? p : i;
      }
      var r = t || parseFloat(this.autoCropWidth), o = e || parseFloat(this.autoCropHeight);
      (r === 0 || o === 0) && (r = s * 0.8, o = i * 0.8), r = r > s ? s : r, o = o > i ? i : o, this.fixed && (o = r / this.fixedNumber[0] * this.fixedNumber[1]), o > this.h && (o = this.h, r = o / this.fixedNumber[1] * this.fixedNumber[0]), this.changeCrop(r, o);
    },
    // 手动改变截图框大小函数
    changeCrop(t, e) {
      if (this.centerBox) {
        let s = this.getImgAxis(), i = s.x2 - s.x1;
        t > i && (t > i + 1 ? (t = i, e = t / this.fixedNumber[0] * this.fixedNumber[1]) : t = i);
        let r = s.y2 - s.y1;
        e > r && (e > r + 1 ? (e = r, t = e / this.fixedNumber[1] * this.fixedNumber[0]) : e = r);
      }
      this.cropW = t, this.cropH = e, this.checkCropLimitSize(), this.$nextTick(() => {
        this.cropOffsertX = (this.w - this.cropW) / 2, this.cropOffsertY = (this.h - this.cropH) / 2, this.centerBox && this.moveCrop(null, !0);
      });
    },
    // 重置函数， 恢复组件置初始状态
    refresh() {
      this.img, this.imgs = "", this.scale = 1, this.crop = !1, this.rotate = 0, this.w = 0, this.h = 0, this.trueWidth = 0, this.trueHeight = 0, this.clearCrop(), this.$nextTick(() => {
        this.checkedImg();
      });
    },
    setInfo(t) {
      this.$nextTick(() => {
        this.cropW = t.w || this.cropW, this.cropH = t.h || this.cropH, this.scale = t.scale || this.scale, this.rotate = t.rotate || this.rotate, this.rotateX = t.rotateX || this.rotateX, this.rotateY = t.rotateY || this.rotateY, this.cropOffsertX = t.x1 || this.cropOffsertX, this.cropOffsertY = t.y1 || this.cropOffsertY;
      });
    },
    changeRotate(t) {
      this.rotate = t <= -3 || t >= 3 ? 0 : t;
    },
    // 向左边旋转
    rotateLeft() {
      this.rotate = this.rotate <= -3 ? 0 : this.rotate - 1;
    },
    // 向右边旋转
    rotateRight() {
      this.rotate = this.rotate >= 3 ? 0 : this.rotate + 1;
    },
    changeRotateX(t) {
      this.rotateX = t;
    },
    changeRotateY(t) {
      this.rotateY = t;
    },
    // 清除旋转
    rotateClear() {
      this.rotate = 0;
    },
    // 图片坐标点校验
    checkoutImgAxis(t, e, s) {
      t = t || this.x, e = e || this.y, s = s || this.scale;
      let i = !0;
      if (this.centerBox) {
        let r = this.getImgAxis(t, e, s), o = this.getCropAxis();
        r.x1 >= o.x1 && (i = !1), r.x2 <= o.x2 && (i = !1), r.y1 >= o.y1 && (i = !1), r.y2 <= o.y2 && (i = !1);
      }
      return i;
    }
  },
  mounted() {
    this.support = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== void 0 ? "mousewheel" : "DOMMouseScroll";
    let t = this;
    var e = navigator.userAgent;
    this.isIOS = !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), HTMLCanvasElement.prototype.toBlob || Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: function(s, i, r) {
        for (var o = atob(this.toDataURL(i, r).split(",")[1]), h = o.length, n = new Uint8Array(h), p = 0; p < h; p++)
          n[p] = o.charCodeAt(p);
        s(new Blob([n], { type: t.type || "image/png" }));
      }
    }), this.showPreview(), this.checkedImg();
  },
  unmounted() {
    window.removeEventListener("mousemove", this.moveCrop), window.removeEventListener("mouseup", this.leaveCrop), window.removeEventListener("touchmove", this.moveCrop), window.removeEventListener("touchend", this.leaveCrop), this.cancelScale();
  }
}), z = {
  key: 0,
  class: "cropper-box"
}, B = ["src"], P = { class: "cropper-view-box" }, D = ["src"], U = { key: 1 };
function F(t, e, s, i, r, o) {
  return v(), w("div", {
    class: "vue-cropper",
    ref: "cropper",
    onMouseover: e[28] || (e[28] = (...h) => t.scaleImg && t.scaleImg(...h)),
    onMouseout: e[29] || (e[29] = (...h) => t.cancelScale && t.cancelScale(...h))
  }, [
    t.imgs ? (v(), w("div", z, [
      O(u("div", {
        class: "cropper-box-canvas",
        style: C({
          width: t.trueWidth + "px",
          height: t.trueHeight + "px",
          transform: "scale(" + t.scale + "," + t.scale + ") translate3d(" + t.x / t.scale + "px," + t.y / t.scale + "px,0)rotateZ(" + t.rotate * 90 + "deg)perspective(1000px)rotateX(" + t.rotateX + "deg)rotateY(" + t.rotateY + "deg)"
        })
      }, [
        u("img", {
          src: t.imgs,
          alt: "cropper-img",
          ref: "cropperImg"
        }, null, 8, B)
      ], 4), [
        [H, !t.loading]
      ])
    ])) : X("", !0),
    u("div", {
      class: I(["cropper-drag-box", {
        "cropper-move": t.move && !t.crop,
        "cropper-crop": t.crop,
        "cropper-modal": t.cropping
      }]),
      onMousedown: e[0] || (e[0] = (...h) => t.startMove && t.startMove(...h)),
      onTouchstart: e[1] || (e[1] = (...h) => t.startMove && t.startMove(...h))
    }, null, 34),
    O(u("div", {
      class: "cropper-crop-box",
      style: C({
        width: t.cropW + "px",
        height: t.cropH + "px",
        transform: "translate3d(" + t.cropOffsertX + "px," + t.cropOffsertY + "px,0)"
      })
    }, [
      u("span", P, [
        u("img", {
          style: C({
            width: t.trueWidth + "px",
            height: t.trueHeight + "px",
            transform: "scale(" + t.scale + "," + t.scale + ") translate3d(" + (t.x - t.cropOffsertX) / t.scale + "px," + (t.y - t.cropOffsertY) / t.scale + "px,0)rotateZ(" + t.rotate * 90 + "deg)perspective(1000px)rotateX(" + t.rotateX + "deg)rotateY(" + t.rotateY + "deg)"
          }),
          src: t.imgs,
          alt: "cropper-img"
        }, null, 12, D)
      ]),
      u("span", {
        class: "cropper-face cropper-move",
        onMousedown: e[2] || (e[2] = (...h) => t.cropMove && t.cropMove(...h)),
        onTouchstart: e[3] || (e[3] = (...h) => t.cropMove && t.cropMove(...h))
      }, null, 32),
      t.info ? (v(), w("span", {
        key: 0,
        class: "crop-info",
        style: C({ top: t.cropInfo.top })
      }, b(t.cropInfo.width) + " × " + b(t.cropInfo.height), 5)) : X("", !0),
      t.fixedBox ? X("", !0) : (v(), w("span", U, [
        u("span", {
          class: "crop-line line-w",
          onMousedown: e[4] || (e[4] = (h) => t.changeCropSize(h, !1, !0, 0, 1)),
          onTouchstart: e[5] || (e[5] = (h) => t.changeCropSize(h, !1, !0, 0, 1))
        }, null, 32),
        u("span", {
          class: "crop-line line-a",
          onMousedown: e[6] || (e[6] = (h) => t.changeCropSize(h, !0, !1, 1, 0)),
          onTouchstart: e[7] || (e[7] = (h) => t.changeCropSize(h, !0, !1, 1, 0))
        }, null, 32),
        u("span", {
          class: "crop-line line-s",
          onMousedown: e[8] || (e[8] = (h) => t.changeCropSize(h, !1, !0, 0, 2)),
          onTouchstart: e[9] || (e[9] = (h) => t.changeCropSize(h, !1, !0, 0, 2))
        }, null, 32),
        u("span", {
          class: "crop-line line-d",
          onMousedown: e[10] || (e[10] = (h) => t.changeCropSize(h, !0, !1, 2, 0)),
          onTouchstart: e[11] || (e[11] = (h) => t.changeCropSize(h, !0, !1, 2, 0))
        }, null, 32),
        u("span", {
          class: "crop-point point1",
          onMousedown: e[12] || (e[12] = (h) => t.changeCropSize(h, !0, !0, 1, 1)),
          onTouchstart: e[13] || (e[13] = (h) => t.changeCropSize(h, !0, !0, 1, 1))
        }, null, 32),
        u("span", {
          class: "crop-point point2",
          onMousedown: e[14] || (e[14] = (h) => t.changeCropSize(h, !1, !0, 0, 1)),
          onTouchstart: e[15] || (e[15] = (h) => t.changeCropSize(h, !1, !0, 0, 1))
        }, null, 32),
        u("span", {
          class: "crop-point point3",
          onMousedown: e[16] || (e[16] = (h) => t.changeCropSize(h, !0, !0, 2, 1)),
          onTouchstart: e[17] || (e[17] = (h) => t.changeCropSize(h, !0, !0, 2, 1))
        }, null, 32),
        u("span", {
          class: "crop-point point4",
          onMousedown: e[18] || (e[18] = (h) => t.changeCropSize(h, !0, !1, 1, 0)),
          onTouchstart: e[19] || (e[19] = (h) => t.changeCropSize(h, !0, !1, 1, 0))
        }, null, 32),
        u("span", {
          class: "crop-point point5",
          onMousedown: e[20] || (e[20] = (h) => t.changeCropSize(h, !0, !1, 2, 0)),
          onTouchstart: e[21] || (e[21] = (h) => t.changeCropSize(h, !0, !1, 2, 0))
        }, null, 32),
        u("span", {
          class: "crop-point point6",
          onMousedown: e[22] || (e[22] = (h) => t.changeCropSize(h, !0, !0, 1, 2)),
          onTouchstart: e[23] || (e[23] = (h) => t.changeCropSize(h, !0, !0, 1, 2))
        }, null, 32),
        u("span", {
          class: "crop-point point7",
          onMousedown: e[24] || (e[24] = (h) => t.changeCropSize(h, !1, !0, 0, 2)),
          onTouchstart: e[25] || (e[25] = (h) => t.changeCropSize(h, !1, !0, 0, 2))
        }, null, 32),
        u("span", {
          class: "crop-point point8",
          onMousedown: e[26] || (e[26] = (h) => t.changeCropSize(h, !0, !0, 2, 2)),
          onTouchstart: e[27] || (e[27] = (h) => t.changeCropSize(h, !0, !0, 2, 2))
        }, null, 32)
      ]))
    ], 4), [
      [H, t.cropping]
    ])
  ], 544);
}
const M = /* @__PURE__ */ N(A, [["render", F], ["__scopeId", "data-v-83933568"]]), R = function(t) {
  t.component("VueCropper", M);
}, q = {
  version: "0.0.21",
  install: R,
  VueCropper: M
};
export {
  M as VueCropper,
  q as default,
  q as globalCropper
};
