class Buffer
	constructor: (@ctx, @w, @h) ->
		@src = ctx.createImageData w, h
		@bf  = new ArrayBuffer @src.data.length
		@b8  = new Uint8ClampedArray @bf
		@b32 = new Uint32Array @bf
		@depth = new ArrayBuffer @src.data.length
		return

	setPixel: (x,y,c) ->
		x = x|0
		y = y|0
		return false if x < 0 or x >= @w or y < 0 or y >= @h
		@b32[y*@w+x] = (255  << 24) |
		               (c[2] << 16) |
		               (c[1] << 8)  |
		                c[0]
		return true

	setPixelDepth: (x,y,z,c) ->
		x = x|0
		y = y|0
		return false unless @depth?
		return false if @depth[y*@w+x] < z
		@setPixel x,y,c
		@depth[y*@w+x] = z
		return true

	getPixel: (x,y) ->
		x = x|0
		y = y|0
		offset = y * @w + x
		[@b8[offset], @b8[offset+1], @b8[offset+2]]

	_horlineDepth: (x1, z1, x2, z2, y, c) ->
		x1 = x1|0
		x2 = x2|0
		i = x2 - x1
		dz = (z2 - z1)/i
		z = z2
		while i > 0
			@setPixelDepth x1+i,y,z,c
			z -= dz
			i--
		return

	# Brasenham algorithm
	line: (v1, v2, c) ->
		x1 = v1[0]|0; x2 = v2[0]|0
		y1 = v1[1]|0; y2 = v2[1]|0
		z1 = v1[2]  ; z2 = v2[2]

		dx = Math.abs x2 - x1
		dy = Math.abs y2 - y1

		sx = if x1 < x2 then 1 else -1
		sy = if y1 < y2 then 1 else -1
		err = dx - dy

		x = x1;	y = y1

		points = []
		loop
			points.push [x, y]
			break if (x is x2) and (y is y2)
			e2 = 2 * err
			if e2 > -dy
				err -= dy
				x += sx
			if e2 <  dx
				err += dx
				y += sy
		z = z1
		dz = (z2 - z1) / points.length
		for p in points
			@setPixelDepth p[0], p[1], z, c
			z += dz
		return

	# Scanline triangle fill algorithm
	# http://www-users.mat.uni.torun.pl/~wrona/3d_tutor/tri_fillers.html
	triangle: (v1, v2, v3, c) ->
		[A, B, C] = [v1, v2, v3].sort (a, b) -> a[1]-b[1]
		[Ax, Ay, Az] = A
		[Bx, By, Bz] = B
		[Cx, Cy, Cz] = C

		@line A, B, c
		@line B, C, c
		@line A, C, c

		d1 = By - Ay
		if d1 > 0
			div = 1 / d1
			dx1 = (Bx - Ax) * div
			dz1 = (Bz - Az) * div
		else
			dx1 = dz1 = 0

		d2 = Cy - Ay
		if d2 > 0
			div = 1 / d2
			dx2 = (Cx - Ax) * div
			dz2 = (Cz - Az) * div
		else
			dx2 = dz2 = 0

		d3 = Cy - By
		if d3 > 0
			div = 1 / d3
			dx3 = (Cx - Bx) * div
			dz3 = (Cz - Bz) * div
		else
			dx3 = dz3 = 0

		end  = start  = Ax
		endD = startD = Az
		line = Ay
		if dx1 > dx2
			while line <= By
				point = start
				@_horlineDepth start, startD, end, endD, line, c
				start += dx2
				end += dx1
				startD += dz2
				endD += dz1
				line++
			end = Bx
			while line <= Cy
				@_horlineDepth start, startD, end, endD, line, c
				start += dx2
				end += dx3
				startD += dz2
				endD += dz3
				line++
		else
			while line <= By
				@_horlineDepth start, startD, end, endD, line, c
				start += dx1
				end += dx2
				startD += dz1
				endD += dz2
				line++
			start = Bx
			while line <= Cy
				@_horlineDepth start, startD, Math.ceil(end), endD, line, c
				start += dx3
				end += dx2
				startD += dz3
				endD += dz2
				line++
		return


	clear: () ->
		i = @b32.length - 1
		while i--
			@b32[i] = -16777216
			@depth[i] = Infinity
		return

window.Buffer = Buffer