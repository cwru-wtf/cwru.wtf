#version 450

// Inputs from vertex shader
layout(location = 0) in vec3 fragNormal;
layout(location = 1) in vec3 fragPosition;
layout(location = 2) in float localZ;

// Camera uniforms
layout(set = 0, binding = 0) uniform CameraUniforms {
    mat4 view;
    mat4 projection;
    vec3 cameraPosition;
    float _posPad;
} camera;

// IBL textures
layout(set = 0, binding = 1) uniform samplerCube irradianceMap;
layout(set = 0, binding = 2) uniform samplerCube prefilteredMap;
layout(set = 0, binding = 3) uniform sampler2D brdfLUT;

// Push constants: per-draw tint + material data (offset 64, after model matrix)
layout(push_constant) uniform PushConstants {
    layout(offset = 64) vec4 tintColor;    // RGB + flag (w > 0 means apply tint)
    vec4 baseColor;    // RGB + materialType (w: 0.0 = PBR, 1.0 = fixedColor)
    float metallic;
    float roughness;
    float ghostClipEnabled;  // 1.0 = clip localZ > 0 (ghost mesh clipping)
    float _pad1;
} pc;

// Output
layout(location = 0) out vec4 outColor;

const float PI = 3.14159265359;
const float MAX_REFLECTION_LOD = 4.0;

// --- PBR Functions ---

// GGX/Trowbridge-Reitz normal distribution function
float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;

    float denom = NdotH2 * (a2 - 1.0) + 1.0;
    denom = PI * denom * denom;

    return a2 / max(denom, 0.0000001);
}

// Smith-GGX geometry function (single direction)
float geometrySchlickGGX(float NdotV, float roughness) {
    float r = roughness + 1.0;
    float k = (r * r) / 8.0;
    return NdotV / (NdotV * (1.0 - k) + k);
}

// Smith geometry function (combined view + light)
float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    return geometrySchlickGGX(NdotV, roughness) * geometrySchlickGGX(NdotL, roughness);
}

// Fresnel-Schlick approximation
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

// Fresnel-Schlick with roughness (for IBL)
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

void main() {
    // Ghost clip: discard geometry in front of sketch plane (model-space z > 0).
    // Use small epsilon to avoid clipping geometry right on the sketch plane
    // (floating-point interpolation can push fragments slightly past z=0).
    if (pc.ghostClipEnabled > 0.5 && localZ > 0.001) {
        discard;
    }

    // Fixed-color early out
    if (pc.baseColor.w > 0.5) {
        outColor = vec4(pc.baseColor.rgb, 1.0);
        return;
    }

    // --- PBR path ---
    vec3 albedo = pc.baseColor.rgb;
    float met = pc.metallic;
    float rough = max(pc.roughness, 0.04);  // Clamp to avoid division issues

    // Apply selection tint override if active
    if (pc.tintColor.w > 0.0) {
        albedo = pc.tintColor.rgb;
    }

    vec3 N = normalize(fragNormal);
    vec3 V = normalize(camera.cameraPosition - fragPosition);
    vec3 R = reflect(-V, N);

    // Base reflectance at normal incidence
    vec3 F0 = mix(vec3(0.04), albedo, met);

    // --- Direct lighting (single directional key light) ---
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    float lightIntensity = 2.0;

    vec3 L = lightDir;
    vec3 H = normalize(V + L);
    float NdotL = max(dot(N, L), 0.0);

    // Cook-Torrance BRDF
    float NDF = distributionGGX(N, H, rough);
    float G = geometrySmith(N, V, L, rough);
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);

    vec3 numerator = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * NdotL + 0.0001;
    vec3 specular = numerator / denominator;

    vec3 kD = (vec3(1.0) - F) * (1.0 - met);
    vec3 direct = (kD * albedo / PI + specular) * lightColor * lightIntensity * NdotL;

    // --- IBL ambient ---
    float NdotV = max(dot(N, V), 0.0);
    vec3 F_ibl = fresnelSchlickRoughness(NdotV, F0, rough);
    vec3 kD_ibl = (vec3(1.0) - F_ibl) * (1.0 - met);

    // Diffuse IBL
    vec3 irradiance = texture(irradianceMap, N).rgb;
    vec3 diffuseIBL = irradiance * albedo * kD_ibl;

    // Specular IBL
    vec3 prefilteredColor = textureLod(prefilteredMap, R, rough * MAX_REFLECTION_LOD).rgb;
    vec2 envBRDF = texture(brdfLUT, vec2(NdotV, rough)).rg;
    vec3 specularIBL = prefilteredColor * (F0 * envBRDF.x + envBRDF.y);

    vec3 ambient = diffuseIBL + specularIBL;

    // Combine
    vec3 color = direct + ambient;

    // Simple tone mapping (Reinhard) and gamma correction
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    outColor = vec4(color, 1.0);
}
