class Transform
	constructor: (position, rotation, scale) ->
		@rotationQuat = MathUtil.eulerQuat rotation
		@dirty = true
		@_matrix = Matrix.fromTransform position, scale
		return

	matrix: () ->
		#@_makeMat if @dirty
		return @_matrix

class Mesh
	constructor: (@verts, @faces) ->
		return

class Object3d
	constructor: (@mesh, @transform) ->
		return

# Cube mesh generator
class Meshes
	@cube: (position,rotation,scale) ->
		verts = [[-0.5,-0.5,-0.5,1],[-0.5,-0.5, 0.5,1],
		         [-0.5, 0.5,-0.5,1],[-0.5, 0.5, 0.5,1],
		         [ 0.5,-0.5,-0.5,1],[ 0.5,-0.5, 0.5,1],
		         [ 0.5, 0.5,-0.5,1],[ 0.5, 0.5, 0.5,1]]
		faces = [[0,1,3,2],[1,5,7,3],[2,3,7,6],
		         [4,6,7,5],[0,2,6,4],[0,4,5,1]]
		verts = verts.map (v) -> MathUtil.applyRot v, rotation
		faces = triangulateQuads faces
		transform = new Transform position, rotation, scale
		mesh = new Mesh verts, faces
		return new Object3d mesh, transform

window.Transform = Transform
window.Mesh = Mesh
window.Object3d = Object3d
window.Meshes = Meshes