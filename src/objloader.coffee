class OBJLoader
	constructor: (data) ->
		@verts = []
		@faces = []
		for line in data.split "\n"
			params = line.split " "
			type = params.splice 0,1
			switch type[0]
				when "v" # Vertex
					@verts.push (params.slice 0,3).map (i) -> parseFloat i
				when "f" # Face (MUST BE PRE-TRIANGULATED)
					@faces.push (params.slice 0,3).map (i) -> (parseInt (i.split "/")[0]) - 1
		return

	make: (position, rotation, scale) ->
		verts = @verts.map (v) -> MathUtil.applyRot v, rotation
		matrix = Matrix.fromTransform position, scale
		return {matrix, verts, @faces}

window.OBJLoader = OBJLoader