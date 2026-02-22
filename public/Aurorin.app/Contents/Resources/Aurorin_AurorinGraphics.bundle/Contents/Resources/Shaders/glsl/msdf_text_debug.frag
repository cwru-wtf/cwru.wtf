//
//  msdf_text_debug.frag
//  AurorinGraphics
//
//  Debug fragment shader for text - draws solid color without MSDF sampling
//

#version 450

// Inputs from vertex shader
layout(location = 0) in vec2 fragUV;
layout(location = 1) in vec4 fragColor;

// Output
layout(location = 0) out vec4 outColor;

void main() {
    // Just output the color directly - no texture sampling
    // This lets us verify glyph positioning without worrying about UVs
    outColor = fragColor;
}
