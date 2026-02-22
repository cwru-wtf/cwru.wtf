#version 450
// dynamic_polygon.vert - Vertex shader for GPU-rendered filled polygons

// Camera uniform buffer
layout(set = 0, binding = 0) uniform Camera {
    mat4 view;
    mat4 projection;
} camera;

// Per-polygon instance data (storage buffer)
struct PolygonInstance {
    float colorR;
    float colorG;
    float colorB;
    float colorA;
    float z;
    float _pad0;
    float _pad1;
    float _pad2;
};

layout(std430, set = 0, binding = 1) readonly buffer PolygonBuffer {
    PolygonInstance instances[];
};

// Vertex input
layout(location = 0) in vec2 worldPos;      // Vertex position in world coordinates
layout(location = 1) in uint instanceIndex;  // Which polygon instance this vertex belongs to

// Output to fragment shader
layout(location = 0) out vec4 fragColor;

void main() {
    // Get polygon instance data
    PolygonInstance instance = instances[instanceIndex];
    
    // Transform vertex to clip space
    vec4 worldPos4 = vec4(worldPos, instance.z, 1.0);
    gl_Position = camera.projection * camera.view * worldPos4;
    
    // Output color
    fragColor = vec4(instance.colorR, instance.colorG, instance.colorB, instance.colorA);
}
