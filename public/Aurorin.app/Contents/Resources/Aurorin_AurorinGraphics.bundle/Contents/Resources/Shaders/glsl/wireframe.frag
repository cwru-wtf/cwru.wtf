#version 450
// wireframe.frag - Fragment shader for wireframe overlay rendering

// Push constant for wireframe color (offset 64, after model matrix)
layout(push_constant) uniform PushConstants {
    layout(offset = 64) vec4 wireframeColor;
} pushConstants;

// Output
layout(location = 0) out vec4 outColor;

void main() {
    outColor = pushConstants.wireframeColor;
}
