class OBJLoader
	constructor: (data) ->
		@verts = []; @faces = []
		for line in data.split "\n"
			params = line.split " "
			type = params.splice 0,1
			switch type[0]
				when "v" # Vertex
					@verts.push [parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), 1]
				when "f" # Face (MUST BE PRE-TRIANGULATED)
					@faces.push (params.slice 0,3).map (i) -> (parseInt (i.split "/")[0]) - 1
		return

	make: (position, rotation, scale) ->
		verts = @verts.map (v) -> MathUtil.applyRot v, rotation
		transform = new Transform position, rotation, scale
		mesh = new Mesh verts, @faces
		return new Object3d mesh, transform

window.OBJLoader = OBJLoader