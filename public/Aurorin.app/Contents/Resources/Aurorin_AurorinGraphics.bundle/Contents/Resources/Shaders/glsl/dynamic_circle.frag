#version 450
// dynamic_circle.frag - Fragment shader for GPU-instanced circle rendering

layout(location = 0) in vec4 fillColor;
layout(location = 1) in vec4 outlineColor;
layout(location = 2) in vec2 localUV;
layout(location = 3) in float radiusPixels;
layout(location = 4) in float outlineWidthPixels;

layout(location = 0) out vec4 outColor;

void main() {
    // Calculate distance from center in normalized quad space
    float distNormalized = length(localUV);
    
    // Convert to pixel distance
    float totalRadius = radiusPixels + 1.0;
    float distPixels = distNormalized * totalRadius;
    
    // Define regions
    float outerRadius = radiusPixels;
    float innerRadius = radiusPixels - outlineWidthPixels;
    
    // Anti-aliasing width in pixels
    float aaWidth = 1.0;
    
    // Discard fragments outside the circle
    if (distPixels > outerRadius + aaWidth * 0.5) {
        discard;
    }
    
    // Calculate alpha for outer edge anti-aliasing
    float outerAlpha = 1.0 - smoothstep(outerRadius - aaWidth * 0.5, outerRadius + aaWidth * 0.5, distPixels);
    
    // If no outline, just render fill with outer AA
    if (outlineWidthPixels <= 0.0) {
        vec4 result = fillColor;
        result.a *= outerAlpha;
        outColor = result;
        return;
    }
    
    // Calculate blend factor between fill and outline
    float outlineBlend = smoothstep(innerRadius - aaWidth * 0.5, innerRadius + aaWidth * 0.5, distPixels);
    
    // Blend between fill and outline colors
    vec4 blendedColor = mix(fillColor, outlineColor, outlineBlend);
    
    // Apply outer edge anti-aliasing
    blendedColor.a *= outerAlpha;
    
    outColor = blendedColor;
}
