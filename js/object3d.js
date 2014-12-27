(function() {
  var Mesh, Meshes, Object3d, Transform;

  Transform = (function() {
    function Transform(position, rotation, scale) {
      this.rotationQuat = MathUtil.eulerQuat(rotation);
      this.dirty = true;
      this._matrix = Matrix.fromTransform(position, scale);
      return;
    }

    Transform.prototype.matrix = function() {
      return this._matrix;
    };

    return Transform;

  })();

  Mesh = (function() {
    function Mesh(verts, faces) {
      this.verts = verts;
      this.faces = faces;
      return;
    }

    return Mesh;

  })();

  Object3d = (function() {
    function Object3d(mesh, transform) {
      this.mesh = mesh;
      this.transform = transform;
      return;
    }

    return Object3d;

  })();

  Meshes = (function() {
    function Meshes() {}

    Meshes.cube = function(position, rotation, scale) {
      var faces, mesh, transform, verts;
      verts = [[-0.5, -0.5, -0.5, 1], [-0.5, -0.5, 0.5, 1], [-0.5, 0.5, -0.5, 1], [-0.5, 0.5, 0.5, 1], [0.5, -0.5, -0.5, 1], [0.5, -0.5, 0.5, 1], [0.5, 0.5, -0.5, 1], [0.5, 0.5, 0.5, 1]];
      faces = [[0, 1, 3, 2], [1, 5, 7, 3], [2, 3, 7, 6], [4, 6, 7, 5], [0, 2, 6, 4], [0, 4, 5, 1]];
      verts = verts.map(function(v) {
        return MathUtil.applyRot(v, rotation);
      });
      faces = triangulateQuads(faces);
      transform = new Transform(position, rotation, scale);
      mesh = new Mesh(verts, faces);
      return new Object3d(mesh, transform);
    };

    return Meshes;

  })();

  window.Transform = Transform;

  window.Mesh = Mesh;

  window.Object3d = Object3d;

  window.Meshes = Meshes;

}).call(this);

//# sourceMappingURL=object3d.js.map
