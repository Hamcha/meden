## General Utils ##

applyRot = (vertex, rotation) ->
	vertex = Matrix.multiply vertex, Matrix.rotateX rotation[0]
	vertex = Matrix.multiply vertex, Matrix.rotateY rotation[1]
	vertex = Matrix.multiply vertex, Matrix.rotateZ rotation[2]
	return vertex

# Project to Camera
project = (camera, coord) ->
	# Put into Perspective
	pcoord = Matrix.multiply coord, Matrix.perspective ratio, near, far, fov
	pcoord = [(pcoord[0] * w / pcoord[2]) + w/2,
	          (pcoord[1] * h / pcoord[2]) + h/2]
	return pcoord

## 3D Rendering functions ##

# Backface Culling
winding = (face,mesh) ->
	area = 0
	prev = project Matrix.multiply mesh.verts[face[0]],mesh.matrix
	for i in [0...face.length-1]
		dep = project Matrix.multiply mesh.verts[face[i]],mesh.matrix
		des = project Matrix.multiply mesh.verts[face[i+1]],mesh.matrix
		area += ((dep[0]-prev[0]) * (prev[1]-des[1])) - ((des[0]-prev[0]) * (prev[1]-dep[1]))
	return area < 0

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
		@camera = new Camera width, height, 70, 0.1, 1000
		return

	draw: (mesh) ->
		for p,i in mesh.faces
			point = Matrix.multiply mesh.verts[p[0]],mesh.matrix
			dpa = @camera.project Matrix.multiply mesh.verts[p[0]],mesh.matrix
			for i in [1...p.length] by 2
				dp1 = @camera.project Matrix.multiply mesh.verts[p[i-1]], mesh.matrix
				dp2 = @camera.project Matrix.multiply mesh.verts[p[i]],   mesh.matrix
				@img.line dp1[0],dp1[1],dp2[0],dp2[1],[255,255,255] if @options.wireframe
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
		matrix = Matrix.fromTransform position, scale
		return {matrix, verts, faces}

window.Renderer = Renderer
window.Meshes = Meshes