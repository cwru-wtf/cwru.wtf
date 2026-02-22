#version 450

// MSDF Text Fragment Shader
// Implements multi-channel signed distance field text rendering
// Based on Chlumsky's MSDF algorithm: https://github.com/Chlumsky/msdfgen

// Inputs from vertex shader
layout(location = 0) in vec2 fragUV;
layout(location = 1) in vec4 fragColor;

// MSDF atlas texture
layout(set = 0, binding = 1) uniform sampler2D msdfAtlas;

// Push constants for MSDF parameters
layout(push_constant) uniform PushConstants {
    float pxRange;      // Distance field range in screen pixels
    float screenPxRange; // Computed screen pixel range for current scale
    vec2 atlasSize;     // Atlas texture dimensions
} pc;

// Output
layout(location = 0) out vec4 outColor;

// Median of three values (core of MSDF algorithm)
float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

// Screen pixel range calculation for proper antialiasing
float screenPxRange() {
    vec2 unitRange = vec2(pc.pxRange) / pc.atlasSize;
    vec2 screenTexSize = vec2(1.0) / fwidth(fragUV);
    return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

void main() {
    // Sample the MSDF texture (RGB channels contain distance fields)
    vec3 msd = texture(msdfAtlas, fragUV).rgb;
    
    // Get the median of the three channels
    float sd = median(msd.r, msd.g, msd.b);
    
    // Calculate screen pixel distance
    float screenPxDist = screenPxRange() * (sd - 0.5);
    
    // Apply antialiased step function
    float opacity = clamp(screenPxDist + 0.5, 0.0, 1.0);
    
    // Discard fully transparent fragments
    if (opacity < 0.001) {
        discard;
    }
    
    // Output final color with computed opacity
    outColor = vec4(fragColor.rgb, fragColor.a * opacity);
}
