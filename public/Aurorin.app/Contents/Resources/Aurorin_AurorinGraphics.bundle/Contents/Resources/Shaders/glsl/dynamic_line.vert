#version 450
// dynamic_line.vert - GPU-instanced line rendering with screen-space line widths

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

// Per-line instance data (storage buffer)
struct LineInstance {
    float startX;
    float startY;
    float endX;
    float endY;
    float z;
    float widthPixels;
    float colorR;
    float colorG;
    float colorB;
    float colorA;
    float _pad0;
    float _pad1;
};

layout(std430, set = 0, binding = 2) readonly buffer LineBuffer {
    LineInstance lines[];
};

// Vertex input - unit quad vertex
layout(location = 0) in vec2 localPos;

// Output to fragment shader
layout(location = 0) out vec4 fragColor;

void main() {
    // Get line instance data
    LineInstance line = lines[gl_InstanceIndex];
    
    // Extract line endpoints
    vec2 start = vec2(line.startX, line.startY);
    vec2 end = vec2(line.endX, line.endY);
    float z = line.z;
    
    // Transform line endpoints to clip space
    vec4 startWorld = vec4(start, z, 1.0);
    vec4 endWorld = vec4(end, z, 1.0);
    
    vec4 startClip = camera.projection * camera.view * startWorld;
    vec4 endClip = camera.projection * camera.view * endWorld;
    
    // Convert to NDC by perspective divide
    vec2 startNDC = startClip.xy / startClip.w;
    vec2 endNDC = endClip.xy / endClip.w;
    
    // Calculate line direction in NDC
    vec2 lineDir = endNDC - startNDC;
    float lineLength = length(lineDir);
    
    // Handle degenerate lines
    vec2 perpNDC;
    vec2 dirNDC;
    if (lineLength < 0.0001) {
        perpNDC = vec2(0.0, 1.0);
        dirNDC = vec2(1.0, 0.0);
    } else {
        dirNDC = lineDir / lineLength;
        perpNDC = vec2(-dirNDC.y, dirNDC.x);
    }
    
    // Convert pixel width to NDC width
    vec2 halfWidthNDC = vec2(
        line.widthPixels / viewport.width,
        line.widthPixels / viewport.height
    );
    
    // Build quad vertex position in NDC
    vec2 posAlongLine = mix(startNDC, endNDC, localPos.x);
    
    // Perpendicular offset
    float perpOffset = (localPos.y - 0.5) * 2.0;
    
    // Apply perpendicular offset with screen-space width
    float avgHalfWidthNDC = (halfWidthNDC.x + halfWidthNDC.y) * 0.5;
    vec2 finalPosNDC = posAlongLine + perpNDC * perpOffset * avgHalfWidthNDC;
    
    // Convert back to clip space
    float w = mix(startClip.w, endClip.w, localPos.x);
    float finalZ = mix(startClip.z, endClip.z, localPos.x);
    
    gl_Position = vec4(finalPosNDC * w, finalZ, w);
    fragColor = vec4(line.colorR, line.colorG, line.colorB, line.colorA);
}
