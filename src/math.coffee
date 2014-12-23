# Math functions
cos = Math.cos
sin = Math.sin

class MathUtil
	# Degrees to Radian
	@deg2rad: (angle) -> (angle / 180) * Math.PI

	# Apply rotation on all three axis
	@applyRot: (vertex, rotation) ->
		vertex = Matrix.multiply vertex, Matrix.rotateX rotation[0]
		vertex = Matrix.multiply vertex, Matrix.rotateY rotation[1]
		vertex = Matrix.multiply vertex, Matrix.rotateZ rotation[2]
		return vertex

class Matrix
	# Multiply Vector4 (c) by Matrix4x4 (m)
	@multiply: (c, m) ->
		[c[0]*m[0][0] + c[1]*m[0][1] + c[2]*m[0][2] + c[3]*m[0][3],
		 c[0]*m[1][0] + c[1]*m[1][1] + c[2]*m[1][2] + c[3]*m[1][3],
		 c[0]*m[2][0] + c[1]*m[2][1] + c[2]*m[2][2] + c[3]*m[2][3],
		 c[0]*m[3][0] + c[1]*m[3][1] + c[2]*m[3][2] + c[3]*m[3][3]]

	# Matrix from transform (position, scale)
	@fromTransform: (p, s) ->
		[[s[0], 0  , 0  ,p[0]],
		 [ 0  ,s[1], 0  ,p[1]],
		 [ 0  , 0  ,s[2],p[2]],
		 [ 0  , 0  , 0  , 1  ]]
	# Rotation matricies (X,Y,Z)
	@rotateX: (a) ->
		[[   1   ,   0   ,   0   ,0],
		 [   0   , cos(a), sin(a),0],
		 [   0   ,-sin(a), cos(a),0],
		 [   0   ,   0   ,   0   ,1]]

	@rotateY: (a) ->
		[[ cos(a),   0   ,-sin(a),0],
		 [   0   ,   1   ,   0   ,0],
		 [ sin(a),   0   , cos(a),0],
		 [   0   ,   0   ,   0   ,1]]

	@rotateZ: (a) ->
		[[ cos(a), sin(a),   0   ,0],
		 [-sin(a), cos(a),   0   ,0],
		 [   0   ,   0   ,   1   ,0],
		 [   0   ,   0   ,   0   ,1]]

	# Create Perspective Matrix
	@perspective: (ratio, near, far, fov) ->
		f = 1 / Math.tan MathUtil.deg2rad fov * .5
		l = f/ratio
		n = (-near-far)/(near-far)
		m = 2*near*far/(near-far)
		return [[ l, 0, 0, 0 ],
		        [ 0, f, 0, 0 ],
		        [ 0, 0, n, m ],
		        [ 0, 0, 1, 0 ]]

window.MathUtil = MathUtil
window.Matrix = Matrix