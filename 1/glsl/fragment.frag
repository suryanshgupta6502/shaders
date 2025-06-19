varying float noise;

void main() {

	vec3 color1 = vec3(0.91, 0.93, 0.93);
	vec3 color2 = vec3(0.29, 0.6, 0.82);
	// vec3 color2 = vec3(0.15, 0.62, 0.78);

	vec3 mixed = mix(color1, color2, (noise + 1.) / 2.0);

	gl_FragColor = vec4(vec3(mixed), 1.0);
	// gl_FragColor=vec4(1.,0,0,1.);
}