# Aurorin CAD DSL Reference

## ⚠️ CRITICAL: DO NOT INVENT SYNTAX ⚠️

**You MUST only use syntax shown in this document. Do NOT invent primitives or properties.**

❌ THESE DO NOT EXIST - NEVER USE:
- `Box`, `Cylinder`, `Sphere` - NO primitive shapes
- `size`, `position`, `rotation`, `color` - NO such properties
- `segments: [...]` - NO array syntax
- Any JSON-like `{ key: value }` blocks inside elements

✅ THE ONLY WAY TO CREATE GEOMETRY:
1. Create a `Sketch` with 2D profile elements (`Point`, `Line`, `Arc`, `Close`, `Circle`, `Rectangle`)
2. Apply `.extrude()` or `.revolve()` to make it 3D

**If you need a box**: Use `Rectangle` in a sketch, then `.extrude()`
**If you need a cylinder**: Use `Circle` in a sketch, then `.extrude()`

---

This document explains the DSL (Domain Specific Language) you use to read and write CAD documents.

## When to Use This

- **Reading documents**: Call `read_file("document.dsl")` to see the user's live document as DSL code.
- **Writing documents**: Write DSL to `workspace.dsl`, then `apply()` to update the live document.

---

## SECTION 1: Coordinate System Overview

```
3D World Coordinates:
  Y (up)
  |
  |___ X (right)
 /
Z (toward viewer)

Standard Planes:
- XY plane: flat floor/ceiling (normal points +Z)
- XZ plane: vertical wall facing you (normal points -Y)
- YZ plane: vertical wall on left/right (normal points +X)
```

---

## SECTION 2: Complete Syntax Reference Tables

### Document Structure

| Element | Syntax | Required |
|---------|--------|----------|
| Document | `Document("Name") { features... }` | Yes |
| Sketch | `Sketch("Name", plane: P) { profile... }` | Yes |
| Holes | `} holes: { hole_profiles... }` | Optional |

### Sketch Planes

| Syntax | Where it is | When to use |
|--------|------------|-------------|
| `.xy` | Horizontal at z=0 | Base/floor of your model |
| `.xy.offset(by: N)` | Horizontal at z=N | Feature stacked on top of another |
| `.xz` | Vertical at y=0 | Front profile (looking at model from front) |
| `.xz.offset(by: N)` | Vertical at y=N | Front/back face of a part |
| `.yz` | Vertical at x=0 | Side profile (looking from right) |
| `.yz.offset(by: N)` | Vertical at x=N | Left/right face of a part |
| Custom | See below | Angled/tilted surfaces |

### Custom Planes (simplified)

```swift
plane: (normal: (nx, ny, nz), xAxis: (xx, xy, xz), distance: D)
```
- `normal`: Direction the plane faces (perpendicular to plane surface)
- `xAxis`: Which way is "right" when drawing on this plane
- `distance`: How far from world origin (0,0,0) along the normal direction

### Custom Planes (full control)

```swift
plane: (origin: (ox, oy, oz), normal: (nx, ny, nz), xAxis: (xx, xy, xz))
```
Use this when the plane origin is not on the normal ray from world origin.

### Profile Elements (2D shapes drawn on sketch plane)

| Element | Syntax | What it does |
|---------|--------|--------------|
| Point | `Point(x: N, y: N)` | Start position (required for line/arc paths) |
| Line | `Line(to: (x, y))` | Draw straight line from current position |
| Arc | `Arc(to: (x, y), radius: R, direction: .clockwise)` | Draw curved line |
| Close | `Close()` | Connect back to starting Point |
| Circle | `Circle(center: (x, y), radius: R)` | Complete circle (use alone, no Point/Close) |
| Rectangle | `Rectangle(center: (x, y), width: W, height: H)` | Complete rect (use alone) |

### Profile Modifiers (for rounded corners)

| Modifier | Syntax | What it does |
|----------|--------|--------------|
| Fillet | `.fillet(R)` | Add rounded corners with radius R |

**⚠️ IMPORTANT: For rounded corners, ALWAYS use `.fillet()` instead of manual Arc segments.**

The `.fillet()` modifier can be applied to profiles AND holes:
- `Rectangle(center: (x, y), width: W, height: H).fillet(R)` - rounds all 4 corners
- `Line(to: (x, y)).fillet(R)` - rounds the corners at both ends of that line
- `Group { ... }.fillet(R)` - rounds all corners in the group
- Works inside `holes: { }` too — e.g. `Rectangle(...).fillet(R)` as a hole creates a rounded rectangular cutout

### 3D Operations

| Operation | Syntax | What it does |
|-----------|--------|--------------|
| Extrude | `.extrude("name", height: H)` | Pull 2D shape into 3D along plane normal |
| Extrude + draft | `.extrude("name", height: H, draftAngle: .deg(A))` | Tapered extrusion |
| Extrude subtract | `.extrude("name", height: H, operation: .subtract)` | Cut material away |
| Revolve | `.revolve("name", axis: ((ox,oy,oz), (dx,dy,dz)))` | Spin 360 degrees around axis |
| Revolve partial | `.revolve(..., angle: .deg(A))` | Spin partial rotation |
| Revolve subtract | `.revolve("name", axis: ..., operation: .subtract)` | Cut material by revolving |

---

## SECTION 3: Decision Guide for Planes

| I want to... | Use this plane |
|--------------|----------------|
| Create a base that sits flat | `.xy` |
| Add a feature on TOP of existing geometry | `.xy.offset(by: height_of_base)` |
| Create a profile viewed from the FRONT | `.xz` |
| Create a feature on the FRONT face | `.xz.offset(by: distance_forward)` |
| Create a profile viewed from the SIDE | `.yz` |
| Create a feature on a SIDE face | `.yz.offset(by: distance_sideways)` |
| Create something at an ANGLE | Custom plane |

---

## SECTION 4: Common Patterns with Examples

### Pattern 1: Stacking features vertically

```swift
// Base is 10 units tall, add cylinder on top
Sketch("Base", plane: .xy) {
    Rectangle(center: (0, 0), width: 20, height: 20)
}
.extrude("Base", height: 10)

Sketch("Top Cylinder", plane: .xy.offset(by: 10)) {
    Circle(center: (0, 0), radius: 5)
}
.extrude("Cylinder", height: 8)
```

### Pattern 2: Adding side features

```swift
// Main body, then boss on the side
Sketch("Body", plane: .xy) {
    Rectangle(center: (0, 0), width: 30, height: 20)
}
.extrude("Body", height: 15)

Sketch("Side Boss", plane: .yz.offset(by: 15)) {
    Circle(center: (0, 7.5), radius: 3)
}
.extrude("Boss", height: 5)
```

### Pattern 3: Cutting holes with subtract

**⚠️ CRITICAL: The height sign determines cut direction. Positive height extrudes along the plane normal, negative height extrudes OPPOSITE to the plane normal. To cut INTO a body, the height must point toward the body's interior.**

```swift
// Box with a hole cut down from the top face
Sketch("Base", plane: .xy) {
    Rectangle(center: (0, 0), width: 20, height: 20)
}
.extrude("Base", height: 10)                          // Body fills z=0 to z=10

// Cut sketch is on the TOP face at z=10
// .xy normal points UP (+Z), so height must be NEGATIVE to cut DOWN into the body
Sketch("Hole Profile", plane: .xy.offset(by: 10)) {
    Circle(center: (0, 0), radius: 3)
}
.extrude("Pocket", height: -5, operation: .subtract)  // Cuts from z=10 down to z=5
```

**How to choose the height sign for subtract:**
- Determine which direction the plane normal points (see Rule 1 below)
- If the body is BEHIND the plane (opposite to normal), use **negative** height
- If the body is IN FRONT of the plane (same direction as normal), use **positive** height
- Example: `.xy.offset(by: 10)` normal points UP — body is BELOW — use negative height

The `operation: .subtract` parameter removes material instead of adding it. It works on both `.extrude()` and `.revolve()`. When omitted, the default is `.none` (additive).

### Pattern 4: Parts on opposite sides

```swift
// Wheels - use opposite normals to extrude outward
Sketch("Left Wheel", plane: (normal: (0, -1, 0), xAxis: (1, 0, 0), distance: 10)) {
    Circle(center: (0, 0), radius: 5)
}
.extrude("Left Wheel", height: 3)

Sketch("Right Wheel", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: 10)) {
    Circle(center: (0, 0), radius: 5)
}
.extrude("Right Wheel", height: 3)
```

---

## SECTION 5: Multi-Feature Positioning (CRITICAL)

This section is crucial - most mistakes happen when placing multiple features relative to each other.

### Rule 1: Extrude direction = plane normal direction

- `.xy` extrudes UP (+Z direction)
- `.xz` extrudes BACKWARD (-Y direction, into the screen)
- `.yz` extrudes RIGHT (+X direction)

### Rule 2: Offset = where the plane IS, not where extrusion goes

- `.xy.offset(by: 10)` = plane at z=10, extrudes UPWARD from there
- Feature will occupy z=10 to z=10+height

### Rule 3: Sketch coordinates are 2D on the plane

When drawing on `.xy`: Point(x: 5, y: 3) = world position (5, 3, plane_z)
When drawing on `.xz`: Point(x: 5, y: 3) = world position (5, plane_y, 3)
When drawing on `.yz`: Point(x: 5, y: 3) = world position (plane_x, 5, 3)

### Rule 4: Subtract cuts must extrude TOWARD the body (⚠️ CRITICAL)

When using `operation: .subtract`, the extrude must go INTO the existing body, not away from it. Since positive height follows the plane normal, you often need **negative height** when the sketch plane is on a face whose normal points away from the body.

- `.xy.offset(by: 10)` on top of a body that fills z=0→10: normal is +Z (up), body is below → use **negative** height
- `.xy` at z=0 under a body that fills z=0→10: normal is +Z (up), body is above → use **positive** height
- `.xz.offset(by: -10)` on the front face of a body: normal is -Y, body is behind → check which way -Y points relative to body

**Common mistake:** Sketching on the top face of a box and using `height: 5` with `.subtract` — this extrudes the cut UPWARD into empty space. Use `height: -5` to cut downward into the box.

### Worked Example: Box with cylinder on top

```swift
// Step 1: Box base, 20x20x10
Sketch("Base", plane: .xy) {           // At z=0
    Rectangle(center: (0, 0), width: 20, height: 20)
}
.extrude("Base", height: 10)           // Fills z=0 to z=10

// Step 2: Cylinder on top
// Box ends at z=10, so cylinder starts at z=10
Sketch("Cylinder", plane: .xy.offset(by: 10)) {  // At z=10
    Circle(center: (0, 0), radius: 5)
}
.extrude("Cylinder", height: 15)       // Fills z=10 to z=25
```

### Worked Example: L-bracket with mounting holes

```swift
// Horizontal base
Sketch("Base", plane: .xy) {
    Rectangle(center: (25, 0), width: 50, height: 20)
}
.extrude("Base", height: 5)            // z=0 to z=5

// Vertical part (standing up from one end)
// Plane is on the front face, at y=-10 (front edge of 20-wide base)
Sketch("Upright", plane: .xz.offset(by: -10)) {
    Rectangle(center: (0, 12.5), width: 10, height: 25)  // x=0, z centered at 12.5
}
.extrude("Upright", height: 20)        // Extrudes in -Y direction (into the base)
```

---

## SECTION 6: Orientation Reference

### What each plane "looks like" when you draw on it

**`.xy` plane (looking DOWN at floor):**
```
    +Y (up on screen)
     |
     |___+X (right on screen)
```
- Point(x: 10, y: 5) is 10 units right, 5 units up on screen
- Extruding goes OUT of the screen (towards viewer)

**`.xz` plane (looking at FRONT wall):**
```
    +Z (up on screen)
     |
     |___+X (right on screen)
```
- Point(x: 10, y: 5) is 10 units right, 5 units up (y in sketch = z in world)
- Extruding goes INTO the screen (away from viewer)

**`.yz` plane (looking at SIDE wall from right):**
```
    +Z (up on screen)
     |
     |___+Y (right on screen)
```
- Point(x: 10, y: 5) is 10 units right, 5 units up (x in sketch = y in world)
- Extruding goes to the RIGHT

---

## SECTION 7: Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| Forgetting `Close()` | Profile not closed | Add `Close()` after last `Line` |
| Arc radius too small | Invalid geometry | Radius must be >= half the straight-line distance |
| Hole outside boundary | Hole won't cut | Ensure hole profile is fully inside outer boundary |
| Wrong offset value | Feature floating in space | Offset = where previous feature ENDS |
| Confusing sketch coords | Feature misaligned | Remember: sketch (x,y) maps to plane's local axes |
| Using custom plane unnecessarily | Complexity + errors | Use `.offset(by:)` for parallel planes |
| Manual arcs for rounded corners | Complex and error-prone | Use `.fillet(R)` instead of manual Arc segments |
| Subtract with wrong height sign | Cut goes into empty space instead of into body | Height must point TOWARD the body. On a top face, use **negative** height to cut down |

---

## Complete Examples

### Simple Box

```swift
Document("Box") {
    Sketch("Base", plane: .xy) {
        Point(x: 0, y: 0)
        Line(to: (20, 0))
        Line(to: (20, 15))
        Line(to: (0, 15))
        Close()
    }
    .extrude("Body", height: 10)
}
```

### Cylinder with Center Hole

```swift
Document("Tube") {
    Sketch("Profile", plane: .xy) {
        Circle(center: (0, 0), radius: 10)
    } holes: {
        Circle(center: (0, 0), radius: 5)
    }
    .extrude("Body", height: 30)
}
```

### L-Shaped Bracket

```swift
Document("Bracket") {
    Sketch("Profile", plane: .xy) {
        Point(x: 0, y: 0)
        Line(to: (30, 0))
        Line(to: (30, 5))
        Line(to: (5, 5))
        Line(to: (5, 20))
        Line(to: (0, 20))
        Close()
    }
    .extrude("Body", height: 5)
}
```

### Rounded Rectangle (using .fillet)

```swift
Document("Rounded Rect") {
    Sketch("Profile", plane: .xy) {
        Rectangle(center: (15, 10), width: 30, height: 20).fillet(5)
    }
    .extrude("Body", height: 3)
}
```

**Note:** Always prefer `.fillet()` over manual Arc segments for rounded corners. It's simpler and ensures correct geometry.

### Plate with Rounded Rectangular Holes

`.fillet()` works on holes too — apply it to Rectangle or Line segments inside holes:

```swift
Document("Plate") {
    Sketch("Profile", plane: .xy) {
        Rectangle(center: (0, 0), width: 40, height: 20)
    } holes: {
        Rectangle(center: (-10, 0), width: 8, height: 5).fillet(1)
        Rectangle(center: (10, 0), width: 8, height: 5).fillet(1)
    }
    .extrude("Body", height: 3)
}
```

### Torus (donut shape)

```swift
Document("Torus") {
    // Profile on XZ plane, offset from Y axis
    Sketch("Circle Profile", plane: .xz) {
        Circle(center: (10, 0), radius: 2)
    }
    .revolve("Body", axis: ((0, 0, 0), (0, 0, 1)))
}
```

### Stacked Cylinders (using offset planes)

```swift
Document("Stacked Cylinders") {
    // Base cylinder
    Sketch("Base", plane: .xy) {
        Circle(center: (0, 0), radius: 15)
    }
    .extrude("Base", height: 5)

    // Middle cylinder (starts at z=5)
    Sketch("Middle", plane: .xy.offset(by: 5)) {
        Circle(center: (0, 0), radius: 10)
    }
    .extrude("Middle", height: 10)

    // Top cylinder (starts at z=15)
    Sketch("Top", plane: .xy.offset(by: 15)) {
        Circle(center: (0, 0), radius: 5)
    }
    .extrude("Top", height: 8)
}
```

### Toy Car (multi-body document)

A more complex example showing multiple sketches with custom planes:

```swift
Document("Car") {
    Sketch("Body Profile", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: -13)) {
        Point(x: -46, y: 3)
        Line(to: (-33, 3))
        Arc(to: (-17, 3), radius: 10, direction: .clockwise)
        Line(to: (17, 3))
        Arc(to: (33, 3), radius: 10, direction: .clockwise)
        Line(to: (42, 3))
        Line(to: (44, 6))
        Line(to: (44, 16))
        Line(to: (36, 20))
        Line(to: (18, 32))
        Line(to: (-8, 34))
        Line(to: (-22, 22))
        Line(to: (-40, 16))
        Line(to: (-46, 14))
        Line(to: (-48, 10))
        Line(to: (-48, 6))
        Close()
    }
    .extrude("Body", height: 26)

    Sketch("Front Axle Sketch", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: -15)) {
        Circle(center: (-25, 0), radius: 2)
    }
    .extrude("Front Axle", height: 30)

    Sketch("Rear Axle Sketch", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: -15)) {
        Circle(center: (25, 0), radius: 2)
    }
    .extrude("Rear Axle", height: 30)

    Sketch("FL Wheel", plane: (normal: (0, -1, 0), xAxis: (1, 0, 0), distance: 15)) {
        Circle(center: (-25, 0), radius: 8)
    }
    .extrude("Front Left Wheel", height: 5)

    Sketch("FR Wheel", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: 15)) {
        Circle(center: (-25, 0), radius: 8)
    }
    .extrude("Front Right Wheel", height: 5)

    Sketch("RL Wheel", plane: (normal: (0, -1, 0), xAxis: (1, 0, 0), distance: 15)) {
        Circle(center: (25, 0), radius: 8)
    }
    .extrude("Rear Left Wheel", height: 5)

    Sketch("RR Wheel", plane: (normal: (0, 1, 0), xAxis: (1, 0, 0), distance: 15)) {
        Circle(center: (25, 0), radius: 8)
    }
    .extrude("Rear Right Wheel", height: 5)
}
```

This example demonstrates:
- **Custom planes with distance**: Simpler than specifying full origin
- **Arc segments**: The body profile uses arcs for wheel wells
- **Multiple parts**: Body, two axles, and four wheels in one document
- **Flipped normals**: Wheels on opposite sides use opposite normal directions `(0, 1, 0)` vs `(0, -1, 0)` to extrude outward

---

## Tips

1. **Use `.offset(by:)` for stacked features** - much simpler than custom planes
2. **Start simple**: Begin with Rectangle or Circle, add complexity later
3. **Check coordinates**: Make sure Line endpoints connect properly
4. **Use Close()**: It automatically returns to your starting Point
5. **Holes must be inside**: Hole profiles must be within the outer boundary
6. **One outline per sketch**: The main profile is one closed path (use holes for cutouts)
7. **Prefer distance: syntax** for custom planes when the plane passes through a point on the normal ray
8. **Use `.fillet()` for rounded corners** - NEVER use manual Arc segments for filleted corners; use `Rectangle(...).fillet(R)` or `Line(...).fillet(R)` instead
