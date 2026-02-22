#version 450
// dynamic_circle.vert - GPU-instanced circle rendering with screen-space sizing

// Camera uniform buffer
layout(set = 0, binding = 0) uniform Camera {
    mat4 view;
    mat4 projection;
} camera;

// Viewport uniform buffer
layout(set = 0, binding = 1) uniform Viewport {
    float width;
    float height;
    float _pad0;
    float _pad1;
} viewport;

// Per-circle instance data (storage buffer)
struct CircleInstance {
    float centerX;
    float centerY;
    float z;
    float radiusPixels;
    float fillR;
    float fillG;
    float fillB;
    float fillA;
    float outlineR;
    float outlineG;
    float outlineB;
    float outlineA;
    float outlineWidthPixels;
    float _pad0;
    float _pad1;
    float _pad2;
};

layout(std430, set = 0, binding = 2) readonly buffer CircleBuffer {
    CircleInstance circles[];
};

// Vertex input - unit quad vertex
layout(location = 0) in vec2 localPos;

// Output to fragment shader
layout(location = 0) out vec4 fillColor;
layout(location = 1) out vec4 outlineColor;
layout(location = 2) out vec2 localUV;
layout(location = 3) out float radiusPixels;
layout(location = 4) out float outlineWidthPixels;

void main() {
    // Get circle instance data
    CircleInstance circle = circles[gl_InstanceIndex];
    
    // Extract circle center and transform to clip space
    vec2 center = vec2(circle.centerX, circle.centerY);
    float z = circle.z;
    
    vec4 centerWorld = vec4(center, z, 1.0);
    vec4 centerClip = camera.projection * camera.view * centerWorld;
    
    // Convert to NDC
    vec2 centerNDC = centerClip.xy / centerClip.w;
    
    // Calculate quad size in NDC
    float totalRadius = circle.radiusPixels + 1.0;  // +1 pixel for AA margin
    
    // Convert pixel radius to NDC
    vec2 radiusNDC = vec2(
        totalRadius * 2.0 / viewport.width,
        totalRadius * 2.0 / viewport.height
    );
    
    // Map localPos from [0,1] to [-1,1] for quad corners
    vec2 quadOffset = (localPos - 0.5) * 2.0;
    
    // Position the quad vertex in NDC
    vec2 vertexNDC = centerNDC + quadOffset * radiusNDC;
    
    // Convert back to clip space
    gl_Position = vec4(vertexNDC * centerClip.w, centerClip.z, centerClip.w);
    
    // Output to fragment shader
    fillColor = vec4(circle.fillR, circle.fillG, circle.fillB, circle.fillA);
    outlineColor = vec4(circle.outlineR, circle.outlineG, circle.outlineB, circle.outlineA);
    localUV = quadOffset;
    radiusPixels = circle.radiusPixels;
    outlineWidthPixels = circle.outlineWidthPixels;
}
