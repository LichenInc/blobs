export const blobs = {
  function () {
    var I = function (t) {
      return t / 360 * 2 * Math.PI
    }
    var P = function (r) {
      return function (t) {
        return r[(t % r.length + r.length) % r.length]
      }
    }
    var g = function (t, r) {
      return Math.sqrt(Math.pow(t.x - r.x, 2) + Math.pow(t.y - r.y, 2))
    }
    var y = function (t, r) {
      return Math.atan2(r.y - t.y, r.x - t.x) / Math.PI * 1 / 2 * 360
    }
    var W = function (t) {
      return new r(t)
    }
    var r = function () {
      function t(t) {
        this.tag = t,
        this.attributes = {
        },
        this.children = [
        ]
      }
      return t.prototype.render = function () {
        var t = this.renderAttributes(),
        r = this.renderChildren();
        return '' === r ? '<' + this.tag + t + '/>' : '<' + this.tag + t + '>' + r + '</' + this.tag + '>'
      },
      t.prototype.renderAttributes = function () {
        var t = Object.keys(this.attributes);
        if (0 === t.length) return '';
        for (var r = '', e = 0, i = t; e < i.length; e++) {
          var n = i[e];
          r += ' ' + n + '="' + this.attributes[n] + '"'
        }
        return r
      },
      t.prototype.renderChildren = function () {
        for (var t = '', r = 0, e = this.children; r < e.length; r++) {
          t += e[r].render()
        }
        return t
      },
      t
    }
    var x = function  (t, n) {
      for (var r = t.map(function (t) {
        return r = t,
        e = n.height,
        (i = r.handles || {
          angle: 0,
          out: 0,
          in : 0
        }).angle = Math.PI + I(i.angle),
        {
          x: r.x,
          y: e - r.y,
          handles: i
        };
        var r,
        e,
        i
      }), e = [
      ], i = 0; i < r.length; i++) {
        var s = P(r) (i),
        a = s.x,
        o = s.y,
        u = s.handles,
        h = P(r) (i + 1),
        l = h.handles;
        void 0 !== u ? e.push({
          x1: a - Math.cos(u.angle) * u.out,
          y1: o + Math.sin(u.angle) * u.out,
          x2: h.x + Math.cos(l.angle) * l. in ,
          y2: h.y - Math.sin(l.angle) * l. in
        })  : e.push({
          x1: a,
          y1: o,
          x2: h.x,
          y2: h.y
        })
      }
      var c = '';
      for (i = 0; i <= r.length; i++) {
        var d = P(r) (i);
        u = P(e) (i - 1);
        0 !== i ? c += 'C' + u.x1 + ',' + u.y1 + ',' + u.x2 + ',' + u.y2 + ',' + d.x + ',' + d.y : c += 'M' + d.x + ',' + d.y
      }
      var f = n.stroke || (n.guides ? 'black' : 'none'),
      b = n.strokeWidth || (n.guides ? 1 : 0),
      g = W('svg');
      g.attributes.width = n.width,
      g.attributes.height = n.height,
      g.attributes.viewBox = '0 0 ' + n.width + ' ' + n.height,
      g.attributes.xmlns = 'http://www.w3.org/2000/svg';
      var y = W('g');
      y.attributes.transform = n.transform || '';
      var x = W('path');
      if (x.attributes.stroke = f, x.attributes['stroke-width'] = b, x.attributes.fill = n.fill || 'none', x.attributes.d = c, y.children.push(x), g.children.push(y), n.guides) {
        var p = n.stroke || 'black',
        v = n.strokeWidth || 1;
        if (n.boundingBox) { // boundingBox
          var w = W('rect');
          w.attributes.x = 0,
          w.attributes.y = 0,
          w.attributes.width = n.width,
          w.attributes.height = n.height,
          w.attributes.fill = 'none',
          w.attributes.stroke = p,
          w.attributes['stroke-width'] = 2 * v,
          w.attributes['stroke-dasharray'] = 2 * v,
          y.children.push(w)
        }
        for (i = 0; i < r.length; i++) { // DIFFÉRENTS POINT ?
          var k = P(r) (i),
          M = (a = k.x, o = k.y, u = P(e) (i), P(r) (i + 1)),
          m = W('line');
          m.attributes.x1 = a,
          m.attributes.y1 = o,
          m.attributes.x2 = u.x1,
          m.attributes.y2 = u.y1,
          m.attributes['stroke-width'] = v,
          m.attributes.stroke = p;
          var z = W('line');
          z.attributes.x1 = M.x,
          z.attributes.y1 = M.y,
          z.attributes.x2 = u.x2,
          z.attributes.y2 = u.y2,
          z.attributes['stroke-width'] = v,
          z.attributes.stroke = p,
          z.attributes['stroke-dasharray'] = 2 * v;
          var E = W('circle');
          E.attributes.cx = u.x1, // x
          E.attributes.cy = u.y1, // y
          E.attributes.r = v, // radius
          E.attributes.fill = p; // fill color
          var C = W('circle');
          C.attributes.cx = u.x2,
          C.attributes.cy = u.y2,
          C.attributes.r = v,
          C.attributes.fill = p;
          var A = W('circle');
          A.attributes.cx = a,
          A.attributes.cy = o,
          A.attributes.r = 2 * v,
          A.attributes.fill = p,
          y.children.push(m),
          y.children.push(z),
          y.children.push(E),
          y.children.push(C),
          y.children.push(A)
        }
      }
      return g
    }
    var e = function (t) {
      return e.editable(t).render()
    }
    return e.editable = function (t) {
      if (!t) throw new Error('no options specified');
      var r,
      e,
      i,
      n,
      s,
      a,
      o = (r = t.seed || String(Date.now()), a = function (t) {
        for (var r = 2166136261, e = 0; e < t.length; e++) r = Math.imul(r ^ t.charCodeAt(e), 16777619);
        return function () {
          return r += r << 13,
          r ^= r >>> 7,
          r += r << 3,
          r ^= r >>> 17,
          (r += r << 5) >>> 0
        }
      }(r), e = a(), i = a(), n = a(), s = a(), function () {
        var t = (e >>>= 0) + (i >>>= 0) | 0;
        return e = i ^ i >>> 9,
        i = (n >>>= 0) + (n << 3) | 0,
        n = (n = n << 21 | n >>> 11) + (t = t + (s = 1 + (s >>>= 0) | 0) | 0) | 0,
        (t >>> 0) / 4294967296
      });
      if (!t.size) throw new Error('no size specified');
      if (!t.stroke && !t.color) throw new Error('no color or stroke specified');
      if (t.complexity <= 0 || 1 < t.complexity) throw new Error('complexity out of range ]0,1]');
      if (t.contrast < 0 || 1 < t.contrast) throw new Error('contrast out of range [0,1]');
      for (var u = 3 + Math.floor(14 * t.complexity), h = 360 / u, l = t.size / Math.E, c = [
      ], d = 0; d < u; d++) {
        var f = 1 - 0.8 * t.contrast * o();
        c.push({
          x: Math.sin(I(d * h)) * l * f + t.size / 2,
          y: Math.cos(I(d * h)) * l * f + t.size / 2
        })
      }
      var b = function (t, r) {
        if (2 === t.length) return t;
        for (var e = [
        ], i = 0; i < t.length; i++) {
          var n = P(t) (i),
          s = P(t) (i - 1),
          a = P(t) (i + 1);
          e.push({
            x: n.x,
            y: n.y,
            handles: {
              angle: y(s, a),
              in : 0.5 * r.strength * g(n, s),
              out: 0.5 * r.strength * g(n, a)
            }
          })
        }
        return e
      }(c, {
        closed: !0,
        strength: 4 / 3 * Math.tan(I(h / 4)) / Math.sin(I(h / 2))
      });
      return x(b, {
        closed: !0,
        width: t.size,
        height: t.size,
        fill: t.color,
        transform: 'rotate(' + o() * h + ',' + t.size / 2 + ',' + t.size / 2 + ')',
        stroke: t.stroke && t.stroke.color,
        strokeWidth: t.stroke && t.stroke.width,
        guides: t.guides
      })
    }
  }
}