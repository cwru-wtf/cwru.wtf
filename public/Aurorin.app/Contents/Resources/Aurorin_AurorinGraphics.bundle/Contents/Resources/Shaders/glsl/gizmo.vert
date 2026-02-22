#version 450

// Vertex inputs (same as mesh.vert)
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inNormal;

// Uniforms (must match CameraUniforms struct — 144 bytes)
layout(set = 0, binding = 0) uniform CameraUniforms {
    mat4 view;
    mat4 projection;
    vec3 cameraPosition;
    float _posPad;
} camera;

// Outputs (matched by gizmo.frag)
layout(location = 0) out vec3 fragNormal;
layout(location = 1) out vec3 fragPosition;

void main() {
    // Extract rotation-only from view matrix (strip translation)
    mat3 viewRotation = mat3(camera.view);
    vec3 rotated = viewRotation * inPosition;

    // Compute aspect ratio from projection matrix
    float aspect = abs(camera.projection[1][1]) / camera.projection[0][0];
    float scale = 0.15;
    vec2 corner = vec2(0.70, 0.65);  // bottom-right in Vulkan NDC

    gl_Position = vec4(
        rotated.x * scale / aspect + corner.x,
        -(rotated.y * scale) + corner.y,       // Y-flip for Vulkan
        rotated.z * 0.0001 + 0.001,            // near plane (renders on top)
        1.0
    );

    // Pass normals for lighting in fragment shader
    fragNormal = inNormal;
    fragPosition = inPosition;
}
