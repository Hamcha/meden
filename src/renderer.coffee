## General Utils ##

applyRot = (vertex, rotation) ->
	vertex = Matrix.multiply vertex, Matrix.rotateX rotation[0]
	vertex = Matrix.multiply vertex, Matrix.rotateY rotation[1]
	vertex = Matrix.multiply vertex, Matrix.rotateZ rotation[2]
	return vertex

triangulateQuads = (faces) ->
	trifaces = []
	for face in faces
		trifaces.push [face[0], face[1], face[2]]
		trifaces.push [face[2], face[3], face[0]]
	return trifaces

## 3D Rendering functions ##

# Backface Culling
winding = (camera,face,mesh) ->
	area = 0
	prev = camera.project Matrix.multiply mesh.verts[face[0]],mesh.matrix
	for i in [0...face.length-1]
		dep = camera.project Matrix.multiply mesh.verts[face[i]],mesh.matrix
		des = camera.project Matrix.multiply mesh.verts[face[i+1]],mesh.matrix
		area += ((dep[0]-prev[0]) * (prev[1]-des[1])) - ((des[0]-prev[0]) * (prev[1]-dep[1]))
	return area >= 0

class Camera
	constructor: (@width, @height, @fov, @near, @far) ->
		@ratio = width / height
		@matrix = Matrix.perspective @ratio, @near, @far, @fov
		return

	project: (coord) ->
		pcoord = Matrix.multiply coord, @matrix
		pcoord = [(pcoord[0] * @width  / pcoord[2]) + @width /2,
		          (pcoord[1] * @height / pcoord[2]) + @height/2]

class Renderer
	constructor: (@ctx, @width, @height) ->
		@depth = new Buffer ctx, width, height
		@img   = new Buffer ctx, width, height
		@options =
			wireframe : false
			culling: true
		@camera = new Camera width, height, 70, 0.1, 1000
		return

	draw: (mesh) ->
		for face in mesh.faces
			continue if @options.culling and not winding @camera, face, mesh
			point = Matrix.multiply mesh.verts[face[0]],mesh.matrix
			for i in [1...face.length]
				dp1 = @camera.project Matrix.multiply mesh.verts[face[i-1]], mesh.matrix
				dp2 = @camera.project Matrix.multiply mesh.verts[face[i]],   mesh.matrix
				@img.line dp1[0],dp1[1],dp2[0],dp2[1],[255,255,255] if @options.wireframe
			dpa = @camera.project Matrix.multiply mesh.verts[face[0]],mesh.matrix
			@img.line dpa[0],dpa[1],dp2[0],dp2[1],[255,255,255] if @options.wireframe
		return

	clear: ->
		@img.clear()
		return

	show: ->
		@img.src.data.set @img.b8
		@ctx.putImageData @img.src,0,0
		return

## 3d Utils functions ##

# Cube mesh generator
class Meshes
	@cube: (position,rotation,scale) ->
		verts = [[-0.5,-0.5,-0.5,1],[-0.5,-0.5, 0.5,1],
		         [-0.5, 0.5,-0.5,1],[-0.5, 0.5, 0.5,1],
		         [ 0.5,-0.5,-0.5,1],[ 0.5,-0.5, 0.5,1],
		         [ 0.5, 0.5,-0.5,1],[ 0.5, 0.5, 0.5,1]]
		faces = [[0,1,3,2],[1,5,7,3],[2,3,7,6],
		         [4,6,7,5],[0,2,6,4],[0,4,5,1]]
		verts = verts.map (v) -> applyRot v, rotation
		faces = triangulateQuads faces
		matrix = Matrix.fromTransform position, scale
		return {matrix, verts, faces}

window.Renderer = Renderer
window.Meshes = Meshes