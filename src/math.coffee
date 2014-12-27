# Math functions
cos = Math.cos
sin = Math.sin

class MathUtil
	# Degrees to Radian
	@deg2rad: (angle) -> (angle / 180) * Math.PI

	# Linear interpolation
	@lerp: (a,b,t) -> a + (b - a) * t

class Vector
	# Normalize vector
	@normalize: (v) ->
		len = Math.sqrt v[0]*v[0] + v[1]*v[1] + v[2]*v[2] + v[3]*v[3]
		return [v[0] / len, v[1] / len, v[2] / len, v[3] / len]
	# Multiply by scalar
	@scale: (v,s) ->
		[v[0] * s, v[1] * s, v[2] * s, v[3] * s]

class Quaternion
	# Create quaternion from euler angles
	@fromEuler: (x, y, z) ->
		sx = Math.sin x/2; cx = Math.cos x/2
		sy = Math.sin y/2; cy = Math.cos y/2
		sz = Math.sin z/2; cz = Math.cos z/2
		return [cx*cy*cz + sx*sy*sz,
		        sx*cy*cz - cx*sy*sz,
		        cx*sy*cz + sx*cy*sz,
		        cx*cy*sz - sx*sy*cz]

class Matrix
	# Multiply Vector4 (c) by Matrix4x4 (m)
	@multiply: (c, m) ->
		[c[0]*m[0][0] + c[1]*m[0][1] + c[2]*m[0][2] + c[3]*m[0][3],
		 c[0]*m[1][0] + c[1]*m[1][1] + c[2]*m[1][2] + c[3]*m[1][3],
		 c[0]*m[2][0] + c[1]*m[2][1] + c[2]*m[2][2] + c[3]*m[2][3],
		 c[0]*m[3][0] + c[1]*m[3][1] + c[2]*m[3][2] + c[3]*m[3][3]]

	# Identity matrix
	@identity: () ->
		[[ 1 , 0 , 0 , 0 ],
		 [ 0 , 1 , 0 , 0 ],
		 [ 0 , 0 , 1 , 0 ],
		 [ 0 , 0 , 0 , 1 ]]

	# Apply transform (scale/rotation/movement) to matrix
	@applyMove: (m, x, y, z) ->
		m[0][3] += x
		m[1][3] += y
		m[2][3] += z
		return m

	@applyScale: (m, x, y, z) ->
		[(Vector.scale m[0], x),
		 (Vector.scale m[1], x),
		 (Vector.scale m[2], x),
		               m[3]    ]

	@rotation: (x, y, z, w) ->
		[[1 - 2*y*y - 2*z*z,     2*x*y + 2*z*w,     2*x*z - 2*y*w, 0],
		 [    2*x*y - 2*z*w, 1 - 2*x*x - 2*z*z,     2*z*y + 2*x*w, 0],
		 [    2*x*z + 2*y*w,     2*z*y - 2*x*w, 1 - 2*x*x - 2*y*y, 0],
		 [                0,                 0,                 0, 1]]

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
window.Vector = Vector
window.Quaternion = Quaternion
window.Matrix = Matrix