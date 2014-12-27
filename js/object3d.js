(function() {
  var Mesh, Meshes, Object3d, Transform;

  Transform = (function() {
    function Transform(position, rotation, scale) {
      this.position = position;
      this.scale = scale;
      this.rotationQuat = MathUtil.eulerQuat(rotation[0], rotation[1], rotation[2]);
      this.dirty = true;
      return;
    }

    Transform.prototype.matrix = function() {
      if (this.dirty) {
        this._makeMat();
      }
      return this._matrix;
    };

    Transform.prototype._makeMat = function() {
      this._matrix = Matrix.rotation(this.rotationQuat[0], this.rotationQuat[1], this.rotationQuat[2], this.rotationQuat[3]);
      this._matrix = Matrix.applyScale(this._matrix, this.scale[0], this.scale[1], this.scale[2]);
      this._matrix = Matrix.applyMove(this._matrix, this.position[0], this.position[1], this.position[2]);
      this.dirty = false;
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
