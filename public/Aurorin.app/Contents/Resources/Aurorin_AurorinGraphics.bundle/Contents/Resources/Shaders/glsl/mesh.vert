#version 450

// Vertex inputs
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inNormal;

// Uniforms
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

// Outputs
layout(location = 0) out vec3 fragNormal;
layout(location = 1) out vec3 fragPosition;
layout(location = 2) out float localZ;

void main() {
    vec4 worldPos = pc.model * vec4(inPosition, 1.0);
    gl_Position = camera.projection * camera.view * worldPos;

    // Transform normal by model matrix (no non-uniform scale)
    fragNormal = mat3(pc.model) * inNormal;
    fragPosition = worldPos.xyz;
    localZ = worldPos.z;  // z in model-transformed space (sketch-local for ghost meshes)
}
