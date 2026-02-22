#version 450
// dynamic_polygon.frag - Fragment shader for GPU-rendered filled polygons

layout(location = 0) in vec4 fragColor;
layout(location = 0) out vec4 outColor;

void main() {
    outColor = fragColor;
}
