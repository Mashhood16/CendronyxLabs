import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/data/class11Derivations.tsx';
let content = readFileSync(filePath, 'utf-8');

const stories = {
  dimensional_wavelength: [
    "🔬 You're an electron microscope designer trying to see individual atoms. You know electrons behave like waves — but what determines their wavelength? You guess it depends on Planck's constant h (the quantum world's ruler), the electron's mass m (heavier = shorter wavelength), and its velocity v (faster = shorter wavelength). You write: λ = h^a m^b v^c, where a, b, c are unknown powers you must find.",
    "📏 You pull out your dimensional analysis toolkit. Planck's constant h has dimensions [ML²T⁻¹] (energy × time), mass m has [M], velocity v has [LT⁻¹]. The wavelength λ has [L]. You set up: [L] = [ML²T⁻¹]^a [M]^b [LT⁻¹]^c. It's like a puzzle where each dimension M, L, T must match on both sides.",
    "🧩 You solve three simultaneous equations: For M: a+b=0, for L: 2a+c=1, for T: -a-c=0. Working through: from T: c=-a, from L: 2a-a=1 so a=1, from M: 1+b=0 so b=-1. Three equations, three unknowns — perfectly determined!",
    "✨ Substituting back: λ = constant × h¹ m⁻¹ v⁻¹ = h/(mv). When physicist Louis de Broglie proposed this in 1924, it was revolutionary — particles like electrons have wave nature! Today, electron microscopes use this exact principle, achieving resolutions of 0.05 nm — enough to image individual atoms!"
  ],
  dimensional_pendulum: [
    "🕰️ You're a clockmaker in the 1600s, inspired by Galileo's observation of a swinging chandelier in a cathedral. You want to design a pendulum clock that keeps perfect time. But what determines the period T? Maybe mass m of the bob, length l of the string, angle θ of swing, or gravity g? You write T = m^a l^b θ^c g^d.",
    "📐 You write dimensions: [T] = [M]^a [L]^b [1]^c [LT⁻²]^d. Angle θ is dimensionless (ratio of arc to radius). Time T has dimension T. Equating: M: a=0 (mass doesn't matter!), L: b+d=0, T: -2d=1. The angle's power c=0 too!",
    "🎯 Solving: a=0, d=-1/2, b=1/2, c=0. The period doesn't depend on mass at all — Galileo was right! A heavier bob doesn't swing faster or slower. Length has power 1/2, gravity has power -1/2. The angle doesn't matter (for small swings).",
    "⏰ Final formula: T = constant × √(l/g). The constant turns out to be 2π (from solving the SHM equation for small angles). T = 2π√(l/g). In 1656, Christiaan Huygens built the first pendulum clock using this formula. A 1-meter pendulum gives T ≈ 2 seconds — perfect for a clock's tick-tock!"
  ],
  rectangular_components: [
    "🗺️ You're a pilot navigating from New York to London. Your flight path forms a 3,000 km vector at 30° north of east. But your navigation system works in east-west (x) and north-south (y) components. You need to break this vector apart — just like resolving forces on an inclined plane or calculating the effective wind component on a runway.",
    "📐 The vector A makes angle θ with the x-axis. Dropping a perpendicular to the x-axis creates a right triangle. The x-component is the adjacent side: Ax = A cos θ. For your flight: Ax = 3000 × cos 30° = 2598 km eastward.",
    "📐 The y-component is the opposite side: Ay = A sin θ. For your flight: Ay = 3000 × sin 30° = 1500 km northward. These two perpendicular components are independent — you can adjust east-west and north-speed speeds separately without affecting each other.",
    "🔄 Given components, you can always reconstruct the original vector: magnitude A = √(Ax² + Ay²) (Pythagoras) and direction θ = tan⁻¹(Ay/Ax). This works for forces, velocities, electric fields — any vector quantity. GPS uses this to calculate your precise position from satellite signals!"
  ],
  first_equation: [
    "🚗 You're at a traffic light in your car. The light turns green and you slam the accelerator. Your speed increases steadily from 0 to 60 km/h (16.7 m/s) — your phone's GPS shows it takes exactly 5 seconds. Acceleration is simply the rate at which velocity changes: how many m/s you gain each second.",
    "📊 By definition: a = (vf - vi)/t. In your car: a = (16.7 - 0)/5 = 3.33 m/s². Your speed increases by 3.33 m/s every second. Cross-multiplying: a × t = vf - vi. The change in velocity equals acceleration multiplied by time.",
    "➗ Rearranging: vf = vi + at. This is the first equation of motion. For your car: vf = 0 + 3.33 × 5 = 16.7 m/s. Simple but powerful — it tells you your final speed after any acceleration for any duration.",
    "📈 On a velocity-time graph, this equation gives a straight line. The slope is acceleration, the y-intercept is initial velocity. Drag racers use this: from 0 to 100 km/h (27.8 m/s) in 3 seconds means a = 9.27 m/s² — nearly 1 g of acceleration!"
  ],
  second_equation: [
    "🏎️ You're a Formula 1 engineer calculating exactly where your driver will be after accelerating out of a corner. Final velocity isn't enough — you need the distance traveled. On a velocity-time graph, the area under the line equals displacement. The shape is a trapezoid (rectangle + triangle).",
    "📐 The rectangle part: initial velocity × time. If you start the corner at 15 m/s and take 4 seconds, the rectangle area = 15 × 4 = 60 m. This is how far you'd go at constant speed.",
    "📐 The triangle part: the extra distance from acceleration. Area = ½ × (vf - vi) × t = ½ × (at) × t = ½at². For acceleration 5 m/s² over 4 s: ½ × 5 × 16 = 40 m. The triangle sits on top of the rectangle.",
    "✅ Total distance S = vit + ½at². For your F1 car: S = 15×4 + ½×5×16 = 60 + 40 = 100 m. You precisely know where the car will be. This equation is used everywhere — from calculating stopping distances to launching rockets!"
  ],
  third_equation: [
    "🛑 You're a safety engineer designing brake systems. You need to know: given a certain braking deceleration, how much distance does a car need to stop? The challenge: you know initial speed and braking force, but you don't know the stopping time. You need an equation without t.",
    "📐 Start with the trapezoid area: S = ½(vi + vf) × t. This is distance = average velocity × time. Smart — it doesn't assume constant velocity, just constant acceleration.",
    "🧮 Eliminate t using the first equation: t = (vf - vi)/a. Substitute: S = ½(vi + vf) × (vf - vi)/a. Multiply both sides by 2a: 2aS = (vi + vf)(vf - vi) = vf² - vi² (difference of squares).",
    "✅ 2aS = vf² - vi². For braking from 30 m/s to 0 with deceleration 5 m/s²: 2×5×S = 0 - 900, so S = 90 m. That's your stopping distance! This equation powers everything from airbag deployment calculations to roller coaster safety systems."
  ],
  projectile_height: [
    "🏀 You're a basketball player taking a jump shot. You launch the ball at 10 m/s at 60° above horizontal. How high will the ball go? The vertical component determines the height: v_iy = vi sin θ = 10 × sin 60° = 10 × 0.866 = 8.66 m/s. The horizontal component (5 m/s) doesn't affect how high the ball goes — it just carries it forward.",
    "📈 At the maximum height, the ball's vertical velocity is momentarily zero — it's the turning point between going up and coming down. v_fy = 0. This is the peak of the parabolic arc.",
    "🧮 Use the third equation of motion in the vertical direction: v_fy² = v_iy² + 2a_yH. Here a_y = -g (gravity pulls down). Substituting: 0 = (vi sin θ)² - 2gH. Rearranging: 2gH = (vi sin θ)².",
    "✅ H = (vi² sin²θ)/(2g). For your shot: H = 100 × 0.75 / 19.62 = 3.82 m. Add release height of 2.5 m, and the ball peaks at 6.32 m — well above the 3.05 m rim! The maximum height for a given speed occurs at θ = 90° (straight up): H_max = vi²/(2g)."
  ],
  projectile_range: [
    "⚽ You're a soccer player lining up a free kick 30 m from goal. You need the ball to clear the wall and dip into the top corner. The range R is how far the ball travels horizontally. You know the horizontal velocity is constant (ignoring air resistance): v_x = vi cos θ. If you kick at 25 m/s and 30°: v_x = 25 × 0.866 = 21.65 m/s.",
    "⏱️ The ball stays in the air for time T = 2vi sin θ / g (twice the time to reach max height). For your kick: T = 2 × 25 × 0.5 / 9.81 = 25/9.81 = 2.55 seconds. That's your hang time — you need it to clear the wall.",
    "📐 Range = horizontal velocity × time of flight: R = (vi cos θ) × (2vi sin θ / g) = 2vi² sin θ cos θ / g. For your kick: R = 2 × 625 × 0.866 × 0.5 / 9.81 = 541.25/9.81 = 55.2 m.",
    "🎯 Using 2 sin θ cos θ = sin 2θ: R = vi² sin 2θ / g. For θ = 45°: sin 90° = 1, R_max = vi²/g = 625/9.81 = 63.7 m. That's the maximum range at this speed. But in soccer, you want accuracy, not just distance — top players like Messi use angles around 25-30° for precision!"
  ],
  projectile_time_flight: [
    "🏃 You're a long jump athlete running down the track. Your takeoff speed is 9 m/s at 20° above horizontal. How long will you be airborne before hitting the sand pit? The answer depends only on vertical motion — your horizontal speed doesn't affect hang time at all.",
    "📏 Your initial vertical velocity: v_iy = vi sin θ = 9 × sin 20° = 9 × 0.342 = 3.08 m/s. This upward component is what keeps you off the ground. The higher your launch angle, the longer you stay up — but too high and you lose horizontal distance.",
    "🧮 Using the second equation of motion vertically: S_y = v_iy T + ½a_y T². At landing, S_y = 0 (same height as takeoff). a_y = -g. So 0 = (vi sin θ)T - ½gT². Factor T: T(vi sin θ - ½gT) = 0.",
    "✅ Non-zero solution: T = 2vi sin θ / g. For your jump: T = 2 × 9 × 0.342 / 9.81 = 6.16/9.81 = 0.628 seconds. World-class long jumpers achieve about 1 second of hang time with takeoff speeds near 10 m/s and angles around 22°. That second feels like an eternity!"
  ],
  elastic_collision: [
    "🎱 You're playing pool. The cue ball (m₁ = 0.17 kg) rolls at 3 m/s toward the 8-ball (m₂ = 0.17 kg) at rest. After the crash, what happens? In the ideal case (elastic collision), both balls bounce perfectly — no energy lost to heat or deformation. Two laws govern this: conservation of momentum and conservation of kinetic energy.",
    "⚡ Momentum conservation: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. With u₁=3, u₂=0, m₁=m₂: 0.17×3 = 0.17v₁ + 0.17v₂, so v₁ + v₂ = 3. But one equation, two unknowns — you need more information.",
    "🔋 Kinetic energy conservation: ½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂². Canceling ½m: 9 = v₁² + v₂². Combined with v₁ + v₂ = 3: solving gives v₁ = 0, v₂ = 3. The cue ball stops dead, the 8-ball rolls away at 3 m/s — a perfect transfer!",
    "🎯 The general solution: v₁ = (m₁-m₂)/(m₁+m₂) × u₁ + 2m₂/(m₁+m₂) × u₂. For equal masses: the first ball stops, the second takes its speed. For a heavy car hitting a light car: the light one flies backward. For a neutron hitting a proton in a nuclear reactor: the neutron transfers most of its energy — this is how nuclear moderators work!"
  ],
  linear_angular: [
    "🎡 You're at an amusement park on the Ferris wheel. The wheel rotates at a constant angular speed ω, but you're moving much faster at the outer edge than someone near the center. The same angular motion produces very different linear speeds depending on your distance from the axis — this is the fundamental link between rotation and straight-line motion.",
    "📐 When a point at radius r rotates through angle θ (in radians), it travels arc length S = rθ. On a Ferris wheel with radius 20 m, a half rotation (θ = π rad) means you travel S = 20π ≈ 62.8 m through the air!",
    "🔄 Linear speed v = S/t = rθ/t = rω. If the Ferris wheel completes a rotation (2π rad) in 40 seconds: ω = π/20 ≈ 0.157 rad/s, and your speed v = 20 × 0.157 = 3.14 m/s. The kid at half the radius (10 m) moves at only 1.57 m/s.",
    "🎯 Tangential acceleration a_t = rα (where α is angular acceleration). But there's also centripetal acceleration a_c = v²/r pulling you toward the center. Total acceleration is the vector sum of these two perpendicular components — your Ferris wheel seat experiences both changing speed and changing direction!"
  ],
  centripetal_acceleration: [
    "🎢 You're riding a roller coaster through a sharp curve. You feel pushed sideways — that's centripetal acceleration pulling you toward the center. But where does this formula come from? Imagine a particle moving in a circle: in a small time Δt, it moves through a small angle Δθ. The position vectors before and after make a small triangle — similar to the velocity vectors before and after.",
    "📐 From the position triangle: Δr/r ≈ Δθ (for small angles). From the velocity triangle: Δv/v ≈ Δθ (same Δθ). Since the triangles are similar: Δv/v = Δr/r. The change in velocity is proportional to the original velocity and the angular change.",
    "🧮 Acceleration a = Δv/Δt = v(Δθ/Δt) = vω. Since Δv = vΔθ (from similar triangles), dividing by Δt: a = v(Δθ/Δt) = vω. The direction of a is perpendicular to v — toward the center of the circle.",
    "✅ Substituting ω = v/r: a_c = v(v/r) = v²/r. Or a_c = (rω)ω = rω². For a car taking a curve of radius 50 m at 20 m/s: a_c = 400/50 = 8 m/s² ≈ 0.8g. This is why you feel thrown outward — your inertia wants to go straight while the road pushes you centripetally!"
  ],
  angular_momentum: [
    "⛸️ You're watching an Olympic figure skater. She starts spinning with arms extended, then pulls her arms in — and suddenly spins much faster! This is conservation of angular momentum in action. Angular momentum L is the rotational equivalent of linear momentum (p = mv), and it's defined as L = r × p (position vector cross linear momentum).",
    "📐 For an object moving in a circle of radius r: L = r × mv. Since r and v are perpendicular (circular motion): L = rmv. If a skater with mass 50 kg spins at radius 1 m with speed 3 m/s: L = 1 × 50 × 3 = 150 kg·m²/s.",
    "🔄 Substitute v = rω: L = r × m × (rω) = mr²ω. The quantity I = mr² is called the moment of inertia — it measures how hard it is to spin an object. When the skater pulls arms in from r = 1 m to r = 0.3 m, I drops from 50 to 4.5 kg·m².",
    "🎯 Conservation of angular momentum: L = Iω = constant. If I decreases, ω must increase: ω_new = ω_old × (I_old/I_new). The skater's spin speed multiplies by 11! This also explains why neutron stars spin at hundreds of times per second — they're the collapsed cores of massive stars, with unimaginably small moments of inertia."
  ],
  torque_inertia: [
    "🚪 You're trying to open a heavy door. You instinctively push as far from the hinges as possible. Why? Torque τ = rF depends on both the force F and the lever arm distance r. Pushing at the door edge (r = 0.8 m) with 20 N gives τ = 16 N·m. Pushing near the hinge (r = 0.1 m) with the same force gives only τ = 2 N·m — eight times less effective!",
    "🏗️ Newton's Second Law says F = ma for linear motion. For rotation: τ = rF = r(ma_t). The tangential acceleration a_t = rα, where α is angular acceleration. Substituting: τ = r × m × (rα) = mr²α.",
    "📐 The quantity I = mr² is the moment of inertia — it's the rotational equivalent of mass. Just as heavier objects are harder to push linearly, objects with larger I are harder to spin. For the door (mass 30 kg, treat as concentrated at r = 0.4 m): I ≈ 30 × 0.16 = 4.8 kg·m².",
    "✅ Newton's Second Law for rotation: τ = Iα. A wrench uses this — applying 50 N at 0.3 m gives τ = 15 N·m. If the bolt's I = 0.01 kg·m², α = 1500 rad/s² — the bolt spins fast!"
  ],
  artificial_gravity: [
    "🛸 You're the engineer designing a rotating space station for a Mars mission, like the one from '2001: A Space Odyssey'. Astronauts in zero gravity suffer bone loss and muscle atrophy. Your solution: spin the station to create artificial gravity using centripetal acceleration. The target: a_c = 9.81 m/s² — Earth-normal gravity.",
    "📐 Centripetal acceleration a_c = v²/R. Set this equal to Earth's gravity: v²/R = g = 9.81 m/s². Multiply both sides by R: v² = gR. The required linear speed v = √(gR). For a station with radius R = 50 m: v = √(9.81 × 50) = √490.5 = 22.1 m/s ≈ 80 km/h.",
    "🔄 Using v = ωR: ω²R² = gR, so ω² = g/R, ω = √(g/R). For R = 50 m: ω = √(9.81/50) = √0.1962 = 0.443 rad/s. One full rotation takes T = 2π/ω = 2π/0.443 ≈ 14.2 seconds.",
    "🌍 A smaller station (R = 10 m) would need ω = √(9.81/10) = 0.99 rad/s, rotating once every 6.3 seconds — fast enough to cause dizziness! This is why space stations need large radii. NASA's proposed Nautilus-X would use a 9 m radius rotating section to provide partial gravity for Mars-bound astronauts."
  ],
  kinetic_energy: [
    "🚗 You're a crash test engineer analyzing vehicle safety. A car of mass 1500 kg traveling at 20 m/s (72 km/h) carries enormous energy that must be dissipated in a crash. Work = force × distance, and this work equals the change in kinetic energy — the work-energy theorem.",
    "📐 Work W = F × d. From Newton's Second Law: F = ma. So W = (ma) × d. The force that stops you does work over the crumple zone distance.",
    "🧮 Use the third equation of motion: 2ad = vf² - vi². If stopping from vi to 0: 2ad = -vi², so d = -vi²/(2a). Substituting into W: W = ma × (-vi²/(2a)) = -½mvi². The work is negative — energy is being removed from the car.",
    "✅ KE = ½mv². Your 1500 kg car at 20 m/s: KE = ½ × 1500 × 400 = 300,000 J. That's enough to lift a 1000 kg car 30 m in the air! Modern crumple zones absorb this energy over about 0.5 m of deformation, requiring an average force of 600,000 N — about 60 tons of force!"
  ],
  archimedes: [
    "🛳️ You're designing a cargo ship. A massive steel vessel weighing 50,000 tons floats effortlessly while a tiny steel nail sinks. Why? Archimedes' principle: the buoyant force equals the weight of fluid displaced. Imagine a cylinder of height h submerged in water of density ρ.",
    "📐 Pressure at the top: P₁ = ρgh₁. Force at top: F₁ = P₁A = ρgh₁A. Pressure at bottom: P₂ = ρgh₂. Force at bottom: F₂ = ρgh₂A. Since h₂ > h₁, the upward force from the bottom is larger than the downward force from the top.",
    "🧮 Net upward (buoyant) force: F_up = F₂ - F₁ = ρgA(h₂ - h₁) = ρgAΔh. But AΔh = V — the volume of the object! So F_up = ρgV. This is the weight of the displaced fluid: ρV × g.",
    "✅ A ship floats when its weight equals the weight of water it displaces. For a 50,000-ton cargo ship: it must displace 50,000 m³ of seawater (density 1025 kg/m³). This is why hollow objects float — they displace a lot of water for their mass. Hot air balloons use the same principle: the hot air inside is less dense than the cool air outside!"
  ],
  continuity: [
    "🌊 You're standing by a river. The river is wide and slow upstream, but narrows into a fast-flowing rapids downstream. The same amount of water must pass every point each second — water is incompressible. Mass entering = mass leaving.",
    "📐 Mass entering in time Δt: Δm₁ = ρA₁v₁Δt. Density ρ × area A₁ × velocity v₁ × time Δt. This is the mass of water flowing through cross-section A₁ in time Δt.",
    "📐 Mass leaving: Δm₂ = ρA₂v₂Δt. For incompressible flow (ρ₁ = ρ₂), conservation of mass means Δm₁ = Δm₂. Cancel density and time: A₁v₁ = A₂v₂.",
    "✅ Flow rate is constant: Av = constant. If the river is 10 m wide and 2 m deep (A₁ = 20 m²) flowing at 1 m/s, then through a narrows of 5 m²: v₂ = 20 × 1 / 5 = 4 m/s — four times faster! This explains how garden hose nozzles work: squeezing the opening makes the water shoot farther."
  ],
  bernoulli: [
    "✈️ You're an aerospace engineer designing an airplane wing. How does a 380-ton Airbus lift off the ground? Bernoulli's principle: faster-moving fluid has lower pressure. The wing is curved on top, making air travel faster there — creating lower pressure above than below.",
    "📐 Work done on the fluid at the lower end: W₁ = P₁A₁Δx₁ = P₁V. The pressure pushes fluid in. Work done by the fluid at the upper end: W₂ = -P₂A₂Δx₂ = -P₂V. The negative sign means the fluid does work on its surroundings to exit.",
    "🧮 Net work = Change in mechanical energy: (P₁ - P₂)V = (½mv₂² - ½mv₁²) + (mgh₂ - mgh₁). Net work on the fluid = change in kinetic energy + change in gravitational potential energy (Work-Energy Theorem).",
    "✅ Divide by volume (m = ρV): P + ½ρv² + ρgh = constant along a streamline. For an airplane wing: air travels faster above (v₂ > v₁), so P₂ < P₁ — creating net upward force! A typical Boeing 747 wing generates about 0.5 psi pressure difference over 500 m², producing 170,000 N of lift per square meter!"
  ],
  venturi_meter: [
    "🧪 You're a plumber diagnosing a clogged pipe. You attach a Venturi meter — a tube that narrows in the middle — to measure flow rate. The constriction makes the fluid speed up, which drops its pressure. The pressure difference tells you the flow velocity.",
    "📐 In a horizontal pipe (h₁ = h₂), Bernoulli simplifies: P₁ + ½ρv₁² = P₂ + ½ρv₂². Rearranging: P₁ - P₂ = ½ρ(v₂² - v₁²). The pressure drop between the wide and narrow sections equals the change in dynamic pressure.",
    "🔄 From continuity: A₁v₁ = A₂v₂, so v₂ = v₁(A₁/A₂). The fluid must speed up in the narrow section by the ratio of areas. Substitute: P₁ - P₂ = ½ρv₁²((A₁/A₂)² - 1).",
    "📊 The pressure difference is measured by a manometer: P₁ - P₂ = ρgh. Equating: ρgh = ½ρv₁²((A₁/A₂)² - 1). Solve: v₁ = √(2gh/((A₁/A₂)² - 1)). This formula is used in carburetors to mix fuel with air, in perfume atomizers, and in medical nebulizers!"
  ],
  elastic_potential_energy: [
    "🏹 You're an archer drawing a bow. The more you pull back the string, the harder it becomes to pull further — Robert Hooke discovered this in 1660: F = kx, where k is the spring constant. A typical bow has k = 200 N/m. Pulling back 0.5 m requires 100 N of force.",
    "📐 On a force-extension graph, F = kx is a straight line through the origin. The work done to stretch the spring equals the area under this line — which is a triangle! Area = ½ × base × height = ½ × x × F.",
    "🧮 Substitute F = kx: W = ½ × x × kx = ½kx². If you pull your bow 0.5 m with k = 200 N/m: W = ½ × 200 × 0.25 = 25 J. That 25 joules of work is stored as elastic potential energy.",
    "✅ U = ½kx². When released, this energy converts to kinetic energy of the arrow: ½mv² = ½kx². An arrow of mass 0.03 kg: v = √(kx²/m) = √(200×0.25/0.03) = √1667 = 40.8 m/s (147 km/h)! This same principle powers everything from trampolines to vehicle suspension systems."
  ],
  terminal_velocity: [
    "🌧️ You're a meteorologist studying raindrops. Why don't raindrops keep accelerating until they hit the ground? Because air drag increases with speed until it balances gravity. At that point, net force = 0, acceleration = 0, and the drop falls at constant terminal velocity.",
    "📐 For a small sphere in a viscous fluid, Stokes' Law gives drag force: F_drag = 6πηrv_t, where η is fluid viscosity, r is radius. A tiny raindrop (r = 0.5 mm) in air (η = 1.8×10⁻⁵ Pa·s) experiences drag proportional to its speed and radius.",
    "🧮 At terminal velocity: Weight = Drag. mg = 6πηrv_t. Mass of a sphere: m = ρV = ρ × (4/3)πr³. So ρ(4/3)πr³g = 6πηrv_t. Cancel π and one r: ρ(4/3)r²g = 6ηv_t.",
    "✅ Solve for v_t: v_t = 2ρgr²/(9η). For a raindrop (ρ = 1000 kg/m³, r = 0.5 mm): v_t = 2×1000×9.81×(5×10⁻⁴)²/(9×1.8×10⁻⁵) = 30.3 m/s (109 km/h). Larger drops fall faster — that's why drizzle floats gently while heavy rain pounds down! Skydivers: v_t ≈ 55 m/s (200 km/h) in belly-down position."
  ],
  work_done_gas: [
    "🔧 You're a mechanical engineer designing a car engine. Inside each cylinder, burning gasoline expands, pushing a piston that turns the crankshaft. The work done by the expanding gas is what propels your car forward. Think of a piston of area A being pushed by gas pressure P.",
    "📐 The gas exerts force F = P × A on the piston. Work = force × distance: W = F × Δy = (PA) × Δy. The piston moves a distance Δy as the gas expands.",
    "🧮 Substitute: W = P × (AΔy). But A × Δy = ΔV — the change in volume of the gas! So W = PΔV. For a car cylinder: if gas at 5×10⁵ Pa expands by 0.5 L (5×10⁻⁴ m³): W = 5×10⁵ × 5×10⁻⁴ = 250 J per stroke.",
    "🔥 A four-cylinder engine at 3000 RPM does 4 cylinders × 2 strokes/rotation = 6000 power strokes per minute. That's 6000 × 250 = 1,500,000 J/min = 25,000 W ≈ 33 horsepower! The negative sign (W = -PΔV) means work is done ON the gas during compression — like in a diesel engine's compression stroke."
  ],
  carnot_efficiency: [
    "🏭 You're a power plant engineer trying to maximize electricity generation. Your steam turbine operates between 800 K (steam from boiler) and 300 K (cooling water). What's the maximum possible efficiency? French engineer Sadi Carnot discovered the answer in 1824, laying the foundation of thermodynamics.",
    "📐 Efficiency η = Work output / Heat input = (Q₁ - Q₂)/Q₁ = 1 - Q₂/Q₁. Here Q₁ is heat absorbed from the hot reservoir, Q₂ is heat rejected to the cold reservoir. No engine can be more efficient than this fundamental limit.",
    "🧮 For a Carnot (ideal reversible) cycle, Q₂/Q₁ = T₂/T₁ (ratio of absolute temperatures). This is because heat transfer is proportional to temperature in a reversible cycle. Substitute: η = 1 - T₂/T₁.",
    "✅ η_max = 1 - 300/800 = 1 - 0.375 = 0.625 = 62.5%. Real steam turbines achieve about 40-45%. Since T₂ can never be 0 K (absolute zero), no engine can be 100% efficient. This is why billions are spent on materials that withstand higher T₁ — every 100 K increase in turbine temperature improves efficiency by 5-8%!"
  ],
  cop_refrigerator: [
    "❄️ You're designing a refrigerator. Your goal: remove as much heat as possible from the inside (cold reservoir at 270 K) while doing minimum work. The compressor does work W, heat Q₂ is extracted from the food compartment, and Q₁ is rejected to the kitchen (at 310 K).",
    "📐 COP (Coefficient of Performance) = Q₂/W (for cooling) — the heat removed per unit work input. A COP of 6 means you remove 6 J of heat for every 1 J of electrical work. Better than 100% 'efficiency' because you're moving heat, not creating it!",
    "🧮 For a Carnot refrigerator: W = Q₁ - Q₂ (work input = heat rejected - heat absorbed). COP = Q₂/(Q₁ - Q₂). Using Q₁/Q₂ = T₁/T₂ (for a reversible cycle): COP = T₂/(T₁ - T₂).",
    "✅ COP = 270/(310-270) = 270/40 = 6.75. For every 1 J of electricity, 6.75 J of heat is removed from your food! Your kitchen gets Q₁ = Q₂ + W = 6.75 + 1 = 7.75 J of heat — that's why the back of the fridge feels warm. Modern refrigerators achieve COP of 3-4 in practice."
  ],
  doppler_listener_towards: [
    "🚶 You're walking toward a stationary speaker playing a 440 Hz note (A4). As you approach, the pitch sounds higher. Why? Sound travels at v = 340 m/s in air. When you walk toward it at vL = 2 m/s, the sound waves reach you faster — the effective speed increases to v + vL = 342 m/s.",
    "📐 The wavelength is determined by the stationary source: λ = v/f = 340/440 = 0.773 m. The source isn't moving, so the wave pattern in air is unchanged — peaks are still 0.773 m apart.",
    "🧮 You encounter more wave peaks per second because you're moving toward them: f' = v_relative / λ = (v + vL)/(v/f) = f × (v + vL)/v. Each second, you cover the distance sound travels PLUS the distance you walk.",
    "✅ f' = 440 × (340 + 2)/340 = 440 × 342/340 = 442.6 Hz. The pitch rises by 2.6 Hz. This is why an approaching train horn sounds higher pitched — and why police radar uses the Doppler shift of radio waves bouncing off your car to measure your speed!"
  ],
  doppler_listener_away: [
    "🚶 You're walking away from a fixed speaker playing the same 440 Hz note. Now the pitch drops! Walking away at vL = 2 m/s, the sound waves reach you slower — effective speed decreases to v - vL = 338 m/s.",
    "📐 The wavelength is still unchanged: λ = v/f = 340/440 = 0.773 m. The source is stationary, so the spatial pattern of compressions and rarefactions in the air doesn't change regardless of your motion.",
    "🧮 You encounter fewer wave peaks per second: f' = v_relative / λ = (v - vL)/(v/f) = f × (v - vL)/v. You're running away from the waves, so they take longer to catch up to you.",
    "✅ f' = 440 × (340 - 2)/340 = 440 × 338/340 = 437.4 Hz. The pitch drops by 2.6 Hz. The same shift magnitude as approaching, just in the opposite direction. This symmetry is used in Doppler echocardiography — doctors measure blood flow velocity by comparing the frequency shift of ultrasound waves reflected from moving red blood cells!"
  ],
  doppler_source_towards: [
    "🚑 You're standing still as an ambulance races toward you with its siren blaring at 440 Hz. The pitch sounds much higher than when it's stationary. But the physics is different here: the source is moving, compressing the sound waves ahead of it.",
    "📐 In one period T = 1/f, the source moves distance vS × T toward you while the wave travels v × T. The new wavelength: λ' = vT - vST = (v - vS)/f. The waves are bunched up — compressed!",
    "🧮 You hear the compressed waves at: f' = v/λ' = v/((v - vS)/f) = f × v/(v - vS). Since the denominator is smaller than v, the frequency increases. The speed of sound v = 340 m/s is fixed, but the spacing between wavefronts is squeezed.",
    "✅ Ambulance at 30 m/s: f' = 440 × 340/(340-30) = 440 × 340/310 = 482.6 Hz. The pitch jumps by 42.6 Hz — a noticeable higher pitch! The formula breaks down when vS approaches v (the sound barrier) — at vS = v, the frequency becomes infinite, and you hear a sonic boom!"
  ],
  doppler_source_away: [
    "🚑 The ambulance passes you and races away. The pitch drops dramatically. Now the source is moving away, stretching the sound waves behind it — like a boat creating longer waves behind it as it moves forward.",
    "📐 In one period, the source moves vS × T away from you. The wave travels v × T. The new wavelength behind: λ' = vT + vST = (v + vS)/f. The waves are stretched — longer wavelength means lower frequency!",
    "🧮 Apparent frequency: f' = v/λ' = v/((v + vS)/f) = f × v/(v + vS). Now the denominator is larger than v, so frequency decreases. The waves are being 'left behind' by the receding source.",
    "✅ Ambulance at 30 m/s moving away: f' = 440 × 340/(340+30) = 440 × 340/370 = 404.3 Hz. The pitch drops by 35.7 Hz — the classic 'wooo' as it passes. Astronomers use the same principle to measure how fast stars and galaxies are moving toward or away from Earth!"
  ],
  stationary_waves_string: [
    "🎸 You're tuning your guitar before a concert. When you pluck a string, it vibrates at specific frequencies determined by its length, tension, and mass. The string is fixed at both ends — these are nodes (points of zero vibration). The vibration pattern must fit an integer number of half-wavelengths between the fixed ends.",
    "📐 For a string of length L, the nth harmonic has n half-wavelengths: L = n(λ_n/2). The fundamental (n=1): λ₁ = 2L (the whole string vibrates in one loop). The second harmonic (n=2): λ₂ = L (two loops), and so on.",
    "🧮 Wave speed v = f_n × λ_n. The wave speed on a string depends on tension and linear density: v = √(T/μ). For a typical guitar string: v ≈ 100 m/s. Longer strings produce lower fundamental frequencies.",
    "✅ f_n = nv/(2L). For a guitar string L = 0.65 m, v = 100 m/s: f₁ = 100/(2×0.65) = 76.9 Hz. The harmonics: f₂ = 153.8 Hz, f₃ = 230.7 Hz... These overtones give each instrument its unique timbre. The 12th fret sits exactly at the midpoint — pressing it halves the effective string length, doubling the frequency — that's an octave higher!"
  ],
  stationary_waves_air_column: [
    "🎵 You're a flute player in an orchestra. When you blow across the mouthpiece, the air column inside vibrates producing musical notes. An open pipe (open at both ends) has antinodes (maximum vibration) at both ends. The air must vibrate freely at the openings.",
    "📐 For an open pipe of length L: L = n(λ_n/2). Same formula as the string! The fundamental (n=1): λ₁ = 2L. Second harmonic (n=2): λ₂ = L. All harmonics are present in an open pipe, giving it a rich, bright sound.",
    "🧮 Using v = fλ: f_n = nv/(2L). The speed of sound in air v = 343 m/s at 20°C. A 0.6 m flute: f₁ = 343/(2×0.6) = 285.8 Hz (around middle C#). Warmer air increases v, raising the pitch — that's why orchestras tune before performances!",
    "✅ A closed pipe (one end closed) is different: it has a node at the closed end and an antinode at the open end. L = (2n-1)λ_n/4, so f_n = (2n-1)v/(4L) — only odd harmonics! A 0.6 m closed pipe: f₁ = 343/(4×0.6) = 142.9 Hz (lower, hollow sound). This is why clarinets (closed pipe) sound different from flutes (open pipe)!"
  ],
  electric_field_point: [
    "⚡ You're investigating a Van de Graaff generator in a science museum. As you bring your hand near the metal dome, you feel a crackling sensation — the electric field. A charged object creates an invisible 'force field' around it that pushes or pulls on other charges. The field E at any point is defined as the force per unit test charge: E = F/q.",
    "📐 Coulomb's Law: the force between two charges Q and q separated by distance r is F = kQq/r², where k = 9×10⁹ N·m²/C². For the Van de Graaff dome (Q = 1×10⁻⁶ C) and your hand with induced charge: the force is proportional to both charges and inversely proportional to distance squared.",
    "🧮 Substituting F into E = F/q: E = (kQq/r²)/q = kQ/r². The test charge q cancels! The electric field depends only on the source charge Q, not on whatever you use to measure it. A larger Q or closer distance = stronger field.",
    "✅ E = kQ/r². Near the Van de Graaff dome (r = 0.1 m, Q = 1×10⁻⁶ C): E = 9×10⁹ × 1×10⁻⁶ / 0.01 = 9×10⁵ N/C. That's 900,000 N/C — strong enough to ionize air molecules, creating the crackling sparks! Lightning is the same physics on a massive scale."
  ],
  potential_gradient: [
    "🔋 You're working with a parallel plate capacitor — two metal plates with a voltage difference across them. The electric field between the plates is uniform. If you move a test charge q from one plate to the other, you do work against the field. How does this work relate to voltage?",
    "📐 Work = force × displacement: W = FΔr = (qE)Δr. Moving a charge through a uniform field E over distance Δr requires force qE (overcoming the field's push).",
    "🧮 But work also equals the negative change in potential energy: W = -qΔV (negative because moving against the field increases potential energy). Equate: qEΔr = -qΔV. Cancel q: EΔr = -ΔV.",
    "✅ E = -ΔV/Δr. The electric field equals the negative potential gradient. For a capacitor with 12 V across 0.01 m gap: E = -12/0.01 = -1200 V/m. The negative sign means the field points from HIGH to LOW potential. Lightning forms when the potential gradient exceeds 3×10⁶ V/m!"
  ],
  drift_velocity: [
    "💡 You flip a light switch, and the bulb turns on instantly. But the electrons themselves move incredibly slowly through the wire. How can a light turn on instantly if electrons crawl? The answer: the signal propagates at near light speed through the electric field, while individual electrons drift at a snail's pace.",
    "📐 In a copper wire, there are n = 8.5×10²⁸ free electrons per cubic meter. Each has charge e = 1.6×10⁻¹⁹ C. In a wire of cross-sectional area A, a length L contains total charge Q = nALe. That's a staggering number of electrons!",
    "🧮 Current I = Q/t = nALe/t = nAe(L/t) = nAev_d. Here v_d = L/t is the drift velocity — the average speed electrons drift along the wire. For a 1 A current in a 1 mm² copper wire: v_d = I/(nAe) = 1/(8.5×10²⁸ × 10⁻⁶ × 1.6×10⁻¹⁹) = 7.4×10⁻⁵ m/s.",
    "✅ I = nAev_d. The drift velocity is only 0.074 mm/s — an electron takes over 3 hours to travel 1 meter! Yet the light turns on instantly because electrons throughout the wire are already there — like a tube filled with marbles: push one in, one immediately comes out the other end."
  ],
  resistance_series: [
    "🎄 You're decorating a Christmas tree with old-style incandescent fairy lights connected in series. If one bulb burns out, the whole string goes dark. In a series circuit, the same current I flows through every component. By Kirchhoff's Voltage Law, the total voltage equals the sum of individual voltage drops.",
    "📐 For three resistors in series: V_total = V₁ + V₂ + V₃. Each voltage drop follows Ohm's Law: V = IR. So: V_total = IR₁ + IR₂ + IR₃ = I(R₁ + R₂ + R₃).",
    "🧮 But by Ohm's Law for the equivalent resistance: V_total = IR_eq. Equating: IR_eq = I(R₁ + R₂ + R₃). The current I is common to all terms — cancel it!",
    "✅ R_eq = R₁ + R₂ + R₃. For 100 Ω + 50 Ω + 25 Ω: R_eq = 175 Ω. Series resistance always adds up — total is always larger than the largest individual. That's why the old Christmas lights went dark when one bulb failed: the broken bulb broke the only path for current."
  ],
  resistance_parallel: [
    "🏠 You're wiring your house. Every outlet, light, and appliance is connected in parallel across the 230 V mains. This is crucial: if you unplug your toaster, the rest of the house stays on. In parallel, each branch has the SAME voltage but carries its own current. By Kirchhoff's Current Law, total current = sum of branch currents.",
    "📐 For three resistors in parallel: I_total = I₁ + I₂ + I₃. Each branch follows Ohm's Law: I = V/R. So: V/R_eq = V/R₁ + V/R₂ + V/R₃. The voltage V is the same across all parallel branches.",
    "🧮 Factor out V: V(1/R_eq) = V(1/R₁ + 1/R₂ + 1/R₃). Cancel V (same for all branches): 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃.",
    "✅ 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃. For 100 Ω, 50 Ω, 25 Ω in parallel: 1/R_eq = 1/100 + 1/50 + 1/25 = 0.01 + 0.02 + 0.04 = 0.07, so R_eq = 14.3 Ω. The equivalent resistance is LESS than the smallest individual!"
  ],
  maximum_power_output: [
    "🔊 You're an audio engineer matching a speaker to an amplifier. An amplifier has internal resistance r = 4 Ω and EMF ε = 20 V. The speaker has resistance R. To get the loudest sound, you need to maximize the power delivered to R. But what value of R gives maximum power?",
    "📐 Power delivered to load R: P_out = I²R. Using Ohm's Law with internal resistance: I = ε/(R + r). So P_out = ε²R/(R + r)².",
    "🧮 For R = 2 Ω: P = 400×2/(6)² = 800/36 = 22.2 W. For R = 4 Ω: P = 400×4/(8)² = 1600/64 = 25.0 W. For R = 8 Ω: P = 400×8/(12)² = 3200/144 = 22.2 W. The power is maximized when R = r!",
    "✅ P_max = ε²/(4r). For ε = 20 V, r = 4 Ω: P_max = 400/16 = 25 W. This is the Maximum Power Transfer Theorem — load resistance equals source resistance for maximum power. It applies everywhere — from solar panels to wireless charging!"
  ],
  wheatstone_bridge: [
    "🔬 You're in a physics lab needing to measure an unknown resistance R precisely. A multimeter gives approximate values, but you need higher accuracy. Samuel Hunter Christie (1833) and later Charles Wheatstone created a bridge circuit that compares unknown to known resistors — and it's incredibly precise because it uses a null measurement (zero current through the galvanometer).",
    "📐 At balance, no current flows through the galvanometer — points B and D are at the same potential. In the upper branch: voltage across P = voltage across R. Since B and D are at same potential: I₁P = I₂R.",
    "📐 In the lower branch: similarly I₁Q = I₂S. The same current I₁ flows through P and Q (they're in series), and I₂ flows through R and S. At balance, the voltage divider ratios are equal.",
    "✅ Divide the equations: (I₁P)/(I₁Q) = (I₂R)/(I₂S). Cancel currents: P/Q = R/S, so R = PS/Q. If P = 100 Ω, Q = 50 Ω, S = 75 Ω: R = 100×75/50 = 150 Ω. The bridge gives precision to 0.01% because it detects ZERO current!"
  ],
  potentiometer: [
    "🔋 You're comparing two batteries to find the EMF of an unknown cell. You can't use a voltmeter directly because it draws some current and gives inaccurate readings. Instead, use a potentiometer — a long uniform wire with a sliding contact. The wire has a constant potential gradient (voltage per unit length is uniform).",
    "📐 The potential difference across any length l of the wire is proportional to l: V ∝ l. If the wire is 1 m long with a 2 V battery across it, the gradient is 2 V/m. Every centimeter gives exactly 0.02 V.",
    "📐 For cell 1 with known EMF ε₁: you slide the contact until the galvanometer reads zero (no current drawn). Balancing length = l₁. For cell 2: balancing length = l₂. Since the gradient is constant: ε₁ ∝ l₁, ε₂ ∝ l₂.",
    "✅ ε₂/ε₁ = l₂/l₁. If ε₁ = 1.5 V gives l₁ = 60 cm, and unknown cell gives l₂ = 40 cm: ε₂ = 1.5 × 40/60 = 1.0 V. The beauty: at balance, the cell draws ZERO current — you measure the true EMF!"
  ],
  magnetic_force: [
    "🔌 You're building an electric motor. A wire carrying current I placed in a magnetic field B experiences a force. This is the fundamental principle behind all electric motors — from the tiny vibration motor in your phone to the massive traction motors in electric trains.",
    "📐 A single charge q moving at velocity v through field B experiences force F = qvB sin θ (perpendicular to both v and B). In a wire, many charges move together. Total charge q = I × t (current × time).",
    "🧮 The average velocity of charges is v = L/t (length of wire per unit time). Substituting: F = (It) × (L/t) × B sin θ = ILB sin θ. The time cancels! The force depends on current, not on how long it flows.",
    "✅ F = BIL sin θ. Maximum force when θ = 90° (current perpendicular to field). For a motor coil: B = 0.5 T, I = 3 A, L = 0.2 m (per turn), N = 50 turns: F = 0.5 × 3 × (0.2×50) × 1 = 15 N. The right-hand rule gives the direction — it's the basis of every electric motor!"
  ],
  faraday_law: [
    "🍳 You're cooking with an induction cooktop. It generates heat WITHOUT any visible flame or glowing element — just a magnetic field that changes thousands of times per second. How? Michael Faraday discovered in 1831 that a changing magnetic field induces an electric current in nearby conductors — electromagnetic induction.",
    "📐 Magnetic flux Φ = BA cos θ — the amount of magnetic field passing through a surface. Think of it like the number of field lines piercing the area. A stronger field B, larger area A, or better alignment (θ = 0) all increase flux.",
    "🧮 Faraday found that the induced EMF is proportional to the rate of change of flux through N turns: ε = -N(ΔΦ/Δt). If flux through a 100-turn coil changes by 0.5 Wb in 0.5 s: ε = -100 × 0.5/0.5 = -100 V. The faster the change, the higher the voltage!",
    "✅ ε = -NdΦ/dt. The negative sign is Lenz's Law: the induced current opposes the change that created it. In an induction cooktop, coils under the glass generate a rapidly oscillating magnetic field (20-100 kHz) that induces eddy currents in the metal pan. The pan itself becomes the heating element!"
  ],
  force_between_conductors: [
    "🔌 You're designing a high-voltage transmission line. When two parallel wires carry current, they exert force on each other — like tiny electromagnets attracting or repelling. This interaction is the basis of the definition of the ampere, the fundamental unit of electric current.",
    "📐 A long straight wire carrying current I₁ produces a magnetic field at distance r: B₁ = μ₀I₁/(2πr), where μ₀ = 4π×10⁻⁷ T·m/A is the permeability of free space. This field circulates around the wire like concentric rings.",
    "🧮 The second wire (carrying I₂) experiences force F = B₁I₂L in this magnetic field. Substitute B₁: F/L = (μ₀I₁/(2πr)) × I₂ = μ₀I₁I₂/(2πr). Parallel currents attract; opposite currents repel.",
    "✅ F/L = μ₀I₁I₂/(2πr). For I₁ = I₂ = 1 A, r = 1 m: F/L = (4π×10⁻⁷)/(2π) = 2×10⁻⁷ N/m. This tiny force defines the ampere! In a high-voltage line with I = 1000 A, r = 0.5 m: F/L = (4π×10⁻⁷)×10⁶/(2π×0.5) = 0.4 N/m."
  ],
  charged_particle_b_field: [
    "📺 You're fixing an old CRT television. Inside the glass tube, electrons are fired at the screen to create the picture. A magnetic field bends their path — the electron beam scans across the screen 60 times per second. The force qvB acts perpendicular to the velocity, creating circular motion.",
    "📐 The magnetic force F_B = qvB (when v ⟂ B) acts as a centripetal force: it's always perpendicular to velocity, pulling the electron into a circular path. No work is done (force ⟂ displacement), so speed stays constant.",
    "🧮 Set magnetic force equal to centripetal force: qvB = mv²/r. Rearranging: r = mv/(qB). For an electron in a CRT: m = 9.11×10⁻³¹ kg, v = 2×10⁷ m/s, B = 0.01 T: r = (9.11×10⁻³¹ × 2×10⁷)/(1.6×10⁻¹⁹ × 0.01) = 1.14×10⁻² m = 1.14 cm.",
    "✅ r = mv/(qB). By varying the magnetic field in the deflection coils, the electron beam scans across the screen to create 625 lines of resolution. The same physics explains the aurora borealis: charged particles from the solar wind spiral along Earth's magnetic field lines, creating stunning light shows at the poles."
  ],
  velocity_selector: [
    "🧪 You're operating a mass spectrometer — a device that identifies molecules by their mass. But first, you need a beam of particles all moving at the same velocity. Enter the velocity selector: crossed electric and magnetic fields that filter particles by speed.",
    "📐 An electric field exerts force F_E = qE in the direction of the field. The particles are pulled one way by the electric field.",
    "📐 Simultaneously, a magnetic field exerts F_B = qvB perpendicular to both v and B. By orienting the fields perpendicularly (crossed), the two forces oppose each other. Particles experience F_E one way and F_B the opposite way.",
    "✅ When forces balance: qE = qvB, cancel q: v = E/B. Only particles with exactly this speed pass straight through. For E = 3000 N/C and B = 0.1 T: v = 3000/0.1 = 30,000 m/s. Mass spectrometers use this to identify molecules — this is how airports detect explosives!"
  ],
  dirac_momentum: [
    "🔬 You're analyzing data from the Large Hadron Collider at CERN. Particles smash together at nearly light speed, and Einstein's special relativity governs their behavior. For a particle with rest mass m and momentum p, the total energy E includes both rest energy and kinetic energy.",
    "📐 Einstein's energy-momentum relation: E² = (mc²)² + (pc)². This is the relativistic Pythagorean theorem — rest energy and momentum energy are perpendicular legs, total energy is the hypotenuse. For a stationary particle (p=0): E = mc². For a massless photon (m=0): E = pc.",
    "🧮 Squared: E² = m²c⁴ + p²c². Rearranging: p²c² = E² - m²c⁴. Divide by c²: p² = (E² - m²c⁴)/c².",
    "✅ p = √(E² - m²c⁴)/c. For a 1 TeV proton (m_pc² = 0.938 GeV) at the LHC: p ≈ 1 TeV/c. The ± sign Dirac noticed: E = ±√(m²c⁴ + p²c²). This led Dirac to predict antimatter — the positron — in 1928! Today, PET scanners in hospitals use positron annihilation to detect cancer."
  ]
};

// For each derivation, find the steps array and replace the detail values sequentially
for (const [key, storyLines] of Object.entries(stories)) {
  const keyPos = content.indexOf(`${key}: {`);
  if (keyPos === -1) { console.log(`Could not find: ${key}`); continue; }

  // Find "steps: [" after this key
  const afterKey = content.substring(keyPos);
  const stepsStart = afterKey.indexOf('steps: [');
  if (stepsStart === -1) { console.log(`No steps for: ${key}`); continue; }
  
  const stepsContentStart = keyPos + stepsStart + 8;
  
  // Find matching closing bracket for the steps array
  let depth = 1;
  let pos = stepsContentStart;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === '[') depth++;
    else if (content[pos] === ']') depth--;
    pos++;
  }
  const stepsEnd = pos - 1; // position of the closing ]
  
  const stepsSection = content.substring(stepsContentStart, stepsEnd);
  
  // Now find each "detail:" occurrence and replace its content
  // Pattern: detail: '...'
  let searchPos = 0;
  let stepIdx = 0;
  let modifiedSection = stepsSection;
  
  while (stepIdx < storyLines.length) {
    const detailStart = modifiedSection.indexOf("detail: '", searchPos);
    if (detailStart === -1) break;
    
    const valueStart = detailStart + 9; // skip "detail: '"
    
    // Find the closing quote by skipping escaped quotes
    let quoteEnd = valueStart;
    while (quoteEnd < modifiedSection.length) {
      if (modifiedSection[quoteEnd] === "'" && modifiedSection[quoteEnd - 1] !== '\\') {
        break;
      }
      quoteEnd++;
    }
    
    const oldDetail = modifiedSection.substring(valueStart, quoteEnd);
    const escapedStory = storyLines[stepIdx].replace(/'/g, "\\'");
    
    modifiedSection = modifiedSection.substring(0, valueStart) + escapedStory + modifiedSection.substring(quoteEnd);
    
    searchPos = valueStart + escapedStory.length;
    stepIdx++;
  }
  
  if (stepIdx !== storyLines.length) {
    console.log(`Warning: ${key} - expected ${storyLines.length} steps, found ${stepIdx} detail fields`);
  }
  
  content = content.substring(0, stepsContentStart) + modifiedSection + content.substring(stepsEnd);
  console.log(`Updated: ${key} (${stepIdx} steps)`);
}

writeFileSync(filePath, content);
console.log('\nAll Class 11 derivations updated!');
