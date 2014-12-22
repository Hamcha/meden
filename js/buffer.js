(function() {
  var Buffer, px;

  px = function(p) {
    return Math.floor(p);
  };

  Buffer = (function() {
    function Buffer(ctx, w, h) {
      this.ctx = ctx;
      this.w = w;
      this.h = h;
      this.src = ctx.createImageData(w, h);
      this.bf = new ArrayBuffer(this.src.data.length);
      this.b8 = new Uint8ClampedArray(this.bf);
      this.b32 = new Uint32Array(this.bf);
      return;
    }

    Buffer.prototype.setPixel = function(x, y, c) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
        return;
      }
      this.b32[y * this.w + x] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
    };

    Buffer.prototype.getPixel = function(x, y) {
      return [this.b8[y * this.w + x], this.b8[y * this.w + x + 1], this.b8[y * this.w + x + 2]];
    };

    Buffer.prototype.line = function(x1, y1, x2, y2, c) {
      var dx, dy, e2, err, sx, sy, _ref, _ref1;
      _ref = [px(x1), px(y1), px(x2), px(y2)], x1 = _ref[0], y1 = _ref[1], x2 = _ref[2], y2 = _ref[3];
      _ref1 = [Math.abs(x2 - x1), Math.abs(y2 - y1)], dx = _ref1[0], dy = _ref1[1];
      sx = x1 < x2 ? 1 : -1;
      sy = y1 < y2 ? 1 : -1;
      err = dx - dy;
      while (true) {
        this.setPixel(x1, y1, c);
        if ((x1 === x2) && (y1 === y2)) {
          break;
        }
        e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
      }
    };

    Buffer.prototype.clear = function() {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.b32.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.b32[i] = -16777216;
      }
    };

    return Buffer;

  })();

  window.Buffer = Buffer;

}).call(this);

//# sourceMappingURL=buffer.js.map
