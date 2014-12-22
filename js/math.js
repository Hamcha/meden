(function() {
  var MathUtil, Matrix, cos, sin;

  cos = Math.cos;

  sin = Math.sin;

  MathUtil = (function() {
    function MathUtil() {}

    MathUtil.deg2rad = function(angle) {
      return (angle / 180) * Math.PI;
    };

    return MathUtil;

  })();

  Matrix = (function() {
    function Matrix() {}

    Matrix.multiply = function(c, m) {
      return [c[0] * m[0][0] + c[1] * m[0][1] + c[2] * m[0][2] + c[3] * m[0][3], c[0] * m[1][0] + c[1] * m[1][1] + c[2] * m[1][2] + c[3] * m[1][3], c[0] * m[2][0] + c[1] * m[2][1] + c[2] * m[2][2] + c[3] * m[2][3], c[0] * m[3][0] + c[1] * m[3][1] + c[2] * m[3][2] + c[3] * m[3][3]];
    };

    Matrix.fromTransform = function(p, s) {
      return [[s[0], 0, 0, p[0]], [0, s[1], 0, p[1]], [0, 0, s[2], p[2]], [0, 0, 0, 1]];
    };

    Matrix.rotateX = function(a) {
      return [[1, 0, 0, 0], [0, cos(a), sin(a), 0], [0, -sin(a), cos(a), 0], [0, 0, 0, 1]];
    };

    Matrix.rotateY = function(a) {
      return [[cos(a), 0, -sin(a), 0], [0, 1, 0, 0], [sin(a), 0, cos(a), 0], [0, 0, 0, 1]];
    };

    Matrix.rotateZ = function(a) {
      return [[cos(a), sin(a), 0, 0], [-sin(a), cos(a), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    };

    Matrix.perspective = function(ratio, near, far, fov) {
      var f, l, m, n;
      f = 1 / Math.tan(MathUtil.deg2rad(fov * .5));
      l = f / ratio;
      n = (-near - far) / (near - far);
      m = 2 * near * far / (near - far);
      return [[l, 0, 0, 0], [0, f, 0, 0], [0, 0, n, m], [0, 0, 1, 0]];
    };

    return Matrix;

  })();

  window.MathUtil = MathUtil;

  window.Matrix = Matrix;

}).call(this);

//# sourceMappingURL=math.js.map
