#version 450
// wireframe.vert - Vertex shader for wireframe overlay rendering

// Vertex inputs - same layout as mesh.vert so we can reuse mesh vertex buffers
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inNormal;  // Unused but must match vertex buffer layout

// Uniforms (must match CameraUniforms struct — 144 bytes)
layout(set = 0, binding = 0) uniform CameraUniforms {
    mat4 view;
    mat4 projection;
    vec3 cameraPosition;
    float _posPad;
} camera;

// Per-entity model matrix (push constant, vertex stage, offset 0)
layout(push_constant) uniform ModelPushConstants {
    mat4 model;
} pc;

void main() {
    vec4 worldPos = pc.model * vec4(inPosition, 1.0);
    gl_Position = camera.projection * camera.view * worldPos;
}
