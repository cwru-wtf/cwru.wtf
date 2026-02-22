#version 450

// MSDF Text Gizmo Vertex Shader
// Screen-space variant: rotation-only camera + fixed NDC corner positioning.
// Same inputs/outputs as msdf_text.vert so the fragment shader is reused.

// Per-instance glyph data (from instance buffer)
layout(location = 0) in vec3 inPosition;    // Top-left corner position (x, y, z)
layout(location = 1) in vec2 inSize;        // Quad size (width, height)
layout(location = 2) in vec4 inUV;          // UV bounds (minX, minY, maxX, maxY)
layout(location = 3) in vec4 inColor;       // Text color (RGBA)

// Camera uniforms
layout(set = 0, binding = 0) uniform CameraUniforms {
    mat4 view;
    mat4 projection;
} camera;

// Outputs to fragment shader
layout(location = 0) out vec2 fragUV;
layout(location = 1) out vec4 fragColor;

// Quad vertices (generated from vertex ID)
// Vertex order: 0=TL, 1=TR, 2=BL, 3=BL, 4=TR, 5=BR (two triangles)
const vec2 quadPositions[6] = vec2[](
    vec2(0.0, 1.0),  // TL
    vec2(1.0, 1.0),  // TR
    vec2(0.0, 0.0),  // BL
    vec2(0.0, 0.0),  // BL
    vec2(1.0, 1.0),  // TR
    vec2(1.0, 0.0)   // BR
);

void main() {
    vec2 corner = quadPositions[gl_VertexIndex % 6];

    // Rotation-only camera transform (same as gizmo.vert)
    mat3 viewRotation = mat3(camera.view);
    vec3 rotatedPos = viewRotation * inPosition;            // rotate anchor only
    vec3 rotated = rotatedPos + vec3(corner * inSize, 0.0); // expand quad in screen space

    // Screen-space positioning (matching gizmo.vert constants)
    float aspect = abs(camera.projection[1][1]) / camera.projection[0][0];
    float scale = 0.15;
    vec2 screenCorner = vec2(0.70, 0.65);

    gl_Position = vec4(
        rotated.x * scale / aspect + screenCorner.x,
        -(rotated.y * scale) + screenCorner.y,
        rotated.z * 0.0001 + 0.0005,  // slightly in front of gizmo arrows (0.001)
        1.0
    );

    // Interpolate UV coordinates
    vec2 uvMin = inUV.xy;
    vec2 uvMax = inUV.zw;
    fragUV = mix(uvMin, uvMax, corner);

    // Pass color through
    fragColor = inColor;
}
