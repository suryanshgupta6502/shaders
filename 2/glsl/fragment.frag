varying float noise;

varying vec3 vColor;
varying vec3 vpos;

void main() {

	vec3 color1 = vec3(0.918, 0.863, 0.631);
	vec3 color2 = vec3(0.514, 0.667, 0.18);
	// #83AA2E
	// vec3 color2 = vec3(0.64, 0.79, 0.1);
	// vec3 color2 = vec3(0.15, 0.62, 0.78);

	// vec3 mixed = mix(color1, color2, (vColor + 1.) / 2.0);
	vec3 mixed = mix(color1, color2, (vpos.z + 1.0) / 2.);

	// gl_FragColor = vec4(mixed, 1.0);
	gl_FragColor = vec4(mixed, 1.0);

	// gl_FragColor=vec4(1.,0,0,1.);
	// gl_FragColor = vec4(vColor, 1.0); // Interpolated color

	// vec2 cxy = 2.0 * gl_PointCoord - 1.0;
	// if(dot(cxy, cxy) > 1.0)
		// discard;

	// gl_FragColor = vec4(vColor, 1.0);
}