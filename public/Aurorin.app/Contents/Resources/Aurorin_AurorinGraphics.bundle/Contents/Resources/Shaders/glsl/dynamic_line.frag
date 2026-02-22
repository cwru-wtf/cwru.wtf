#version 450
// dynamic_line.frag - Fragment shader for GPU-instanced line rendering

layout(location = 0) in vec4 fragColor;
layout(location = 0) out vec4 outColor;

void main() {
    outColor = fragColor;
}
