#version 450
// gizmo.frag - Simple flat-color fragment shader for axis gizmo rendering.
// Uses only push constant tint color and basic Lambert lighting.
// No material UBO or IBL textures — keeps the gizmo pipeline independent of PBR.

// Inputs from vertex shader
layout(location = 0) in vec3 fragNormal;
layout(location = 1) in vec3 fragPosition;

// Push constant for tint color
layout(push_constant) uniform PushConstants {
    vec4 tintColor;  // RGB + flag (w > 0 means apply tint)
} pc;

// Output
layout(location = 0) out vec4 outColor;

void main() {
    vec3 N = normalize(fragNormal);

    // Simple directional light for gizmo readability
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
    float NdotL = max(dot(N, lightDir), 0.0);

    vec3 baseColor = vec3(0.7);
    if (pc.tintColor.w > 0.0) {
        baseColor = pc.tintColor.rgb;
    }

    vec3 color = baseColor * (0.3 + 0.7 * NdotL);
    outColor = vec4(color, 1.0);
}
