class Transform
	constructor: (@position, rotation, @scale) ->
		@rotationQuat = Vector.normalize Quaternion.fromEuler rotation[0], rotation[1], rotation[2]
		@dirty = true
		return

	matrix: () ->
		@_makeMat() if @dirty
		return @_matrix

	_makeMat: () ->
		@_matrix = Matrix.rotation @rotationQuat[0], @rotationQuat[1], @rotationQuat[2], @rotationQuat[3]
		@_matrix = Matrix.applyScale @_matrix, @scale[0], @scale[1], @scale[2]
		@_matrix = Matrix.applyMove  @_matrix, @position[0], @position[1], @position[2]
		@dirty = false
		return

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
		faces = triangulateQuads faces
		transform = new Transform position, rotation, scale
		mesh = new Mesh verts, faces
		return new Object3d mesh, transform

window.Transform = Transform
window.Mesh = Mesh
window.Object3d = Object3d
window.Meshes = Meshes