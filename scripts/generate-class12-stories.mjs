import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/data/class12Derivations.tsx';
let content = readFileSync(filePath, 'utf-8');

const stories = {
  gravitation_law: [
    "🍎 It's 1666, and Isaac Newton sits under an apple tree at Woolsthorpe Manor. An apple falls — but what if the same force that pulls the apple extends to the Moon? Newton realized the gravitational force between any two masses depends on how much matter each has: F_g ∝ m₁ × m₂. Double one mass = double the pull. A 50 kg person and a 70 kg friend feel 1.4× the force of two 50 kg people.",
    "📏 But as objects get farther apart, gravity weakens rapidly. Newton figured: F_g ∝ 1/r². If you double the distance, the force drops to 1/4. This inverse-square law explains why astronauts on the ISS (400 km up) feel about 90% of Earth's surface gravity despite appearing weightless — they're in free fall!",
    "🧮 Combine both insights: F_g ∝ (m₁ × m₂)/r². The force is proportional to the product of masses divided by the square of the distance. Newton had the form — but he needed a constant to make it an equation.",
    "✅ F_g = G × (m₁ × m₂)/r². The constant G = 6.67×10⁻¹¹ N·m²/kg² is tiny — it took Henry Cavendish 71 years after Newton's death to measure it using a delicate torsion balance with lead spheres. Two 1 kg masses 1 m apart attract with just 6.67×10⁻¹¹ N — that's billionths of a Newton! Gravity truly is the weakest force."
  ],
  g_on_surface: [
    "⚖️ You step on a bathroom scale. It reads your weight mg. But why does a 70 kg person weigh 686 N? The answer lies in equating weight with Newton's law: mg = G × m × M_E / R_E². Your mass m appears on both sides — cancel it! This means the acceleration due to gravity doesn't depend on your mass at all.",
    "🧮 Cancel mass m: g = G × M_E / R_E². This is why Galileo's legendary Leaning Tower of Pisa experiment works — a feather and a hammer fall at the same rate in vacuum. Mass doesn't matter!",
    "📐 Plug in Earth's values: M_E = 5.97×10²⁴ kg (about 6 sextillion tons), R_E = 6.37×10⁶ m (6370 km). G = 6.67×10⁻¹¹. Calculate: g = 6.67×10⁻¹¹ × 5.97×10²⁴ / (6.37×10⁶)² = 9.81 m/s².",
    "🌍 g = 9.81 m/s². Every second in free fall, your speed increases by 9.81 m/s. But g varies: at the equator (9.78 m/s²) due to Earth's rotation, at the poles (9.83 m/s²) due to flattening. On Mount Everest, g is 9.79 m/s² — 0.2% less. On Mars, g is just 3.71 m/s² — you'd weigh only 38% of your Earth weight!"
  ],
  g_variation: [
    "🏔️ You're climbing Mount Everest. At the summit (8,848 m), you'd expect gravity to be weaker because you're farther from Earth's center. Indeed: g_h = G × M_E / (R_E + h)². At the top of Everest: g_h = 6.67×10⁻¹¹ × 5.97×10²⁴ / (6.37×10⁶ + 8848)² = 9.79 m/s² — just a bit less than sea level's 9.81.",
    "📐 Divide by surface g: g_h/g = R_E²/(R_E + h)². As h increases, the ratio drops. For small heights compared to R_E (6370 km), we can approximate using binomial expansion.",
    "🧮 For h << R_E: (1 + h/R_E)⁻² ≈ 1 − 2h/R_E. So g_h ≈ g(1 − 2h/R_E). At 10 km altitude (airliner cruising): g_h = 9.81 × (1 − 2×10/6370) = 9.81 × 0.9969 = 9.78 m/s² — only 0.3% less. That's why you don't feel noticeably lighter on a plane!",
    "🛰️ At the International Space Station (h = 400 km): g_h = 9.81 × (6370)²/(6370+400)² = 8.69 m/s². That's 89% of surface gravity! Astronauts feel weightless NOT because gravity is gone — but because they're in continuous free fall around Earth, exactly like Newton's cannonball."
  ],
  orbital_velocity: [
    "🚀 You're a SpaceX engineer preparing a Falcon 9 launch. The satellite needs to reach Low Earth Orbit. But how fast must it go? For a satellite in circular orbit, the centripetal force (mv²/r) must exactly equal the gravitational force (GMm/r²). If it's too slow, it falls back to Earth. Too fast, it flies away.",
    "🧮 Set mv²/r = GMm/r². The satellite's mass m cancels out completely — orbital velocity doesn't depend on the satellite's mass! A tiny CubeSat and a massive ISS need the same speed at the same altitude. Cancel m: v²/r = GM/r².",
    "📐 Multiply by r: v² = GM/r. For low Earth orbit (r = 6,570 km, just 200 km above surface): v² = 6.67×10⁻¹¹ × 5.97×10²⁴ / 6.57×10⁶ = 60.6×10⁶. v = √(60.6×10⁶) = 7,790 m/s ≈ 7.8 km/s.",
    "✅ v_o = √(GM/r). At the surface (r = R_E): v_o = √(GM/R_E) = √(gR_E) ≈ 7.9 km/s ≈ 28,000 km/h. That's Mach 23! The ISS orbits at about 7.66 km/s, completing one lap around Earth every 90 minutes. In 24 hours, astronauts see 16 sunrises and sunsets!"
  ],
  geostationary: [
    "📡 You're designing a communications satellite for satellite TV. It needs to stay fixed above the same point on Earth so your dish never has to move. This requires a geostationary orbit — the satellite's orbital period must equal Earth's rotation period: 24 hours exactly.",
    "📐 Orbital speed: v = 2πr/T (circumference ÷ period). For geostationary, T = 86,400 s (24 hours). From orbital velocity: v = √(GM/r). Set them equal: 2πr/T = √(GM/r).",
    "🧮 Square both sides: 4π²r²/T² = GM/r. Multiply by r: 4π²r³/T² = GM. So r³ = GMT²/4π². The cube of the radius is proportional to the square of the period — Kepler's Third Law!",
    "✅ r = (GMT²/4π²)^(1/3). Plugging in: r = (6.67×10⁻¹¹ × 5.97×10²⁴ × 86400² / 4π²)^(1/3) = 42,164 km from Earth's center. Subtract R_E = 6,370 km: height = 35,786 km above the surface. At this altitude, the satellite covers about 1/3 of Earth's surface — just 3 satellites can cover the entire globe!"
  ],
  absolute_gpe: [
    "🌍 You're calculating how much energy is needed to launch a rocket to infinity — to escape Earth's gravity completely. But there's a catch: gravity weakens with distance (1/r²), so the force isn't constant. You can't just use W = Fd. You need calculus to sum up the work over an infinite path.",
    "📐 The work done against gravity from Earth's surface R to infinity is the integral: U = ∫ₚ^∞ (GMm/r²) dr. This integral sums up the tiny bits of work at each distance, where the force gets weaker and weaker the farther you go.",
    "🧮 The integral of 1/r² is −1/r. Evaluating from R to ∞: U = [−GMm/r]ₚ^∞ = (−GMm/∞) − (−GMm/R) = 0 + GMm/R = −GMm/R. Wait — the reference point matters. We define U = 0 at infinity (where gravity is negligible). So at Earth's surface, U = −GMm/R. The negative sign means you're bound!",
    "✅ U = −GMm/r. A satellite at r = 7,000 km: U = −6.67×10⁻¹¹ × 5.97×10²⁴ × 1000 / 7×10⁶ = −5.69×10¹⁰ J. The negative value means it's gravitationally bound — you need to ADD 5.69×10¹⁰ J of kinetic energy to make U = 0 (escape). This is why reaching escape velocity (11.2 km/s) is so much harder than orbital velocity (7.9 km/s)!"
  ],
  gravitational_potential: [
    "🕳️ You're studying black holes — regions where gravity is so intense that nothing, not even light, can escape. Gravitational potential V = U/m tells you the 'gravitational energy per kilogram' at any point in space, independent of the test mass.",
    "📐 By definition: V = U/m. Substitute U = −GMm/r. The mass m cancels: V = (−GMm/r)/m = −GM/r. Potential depends only on Earth's mass and distance, not on the object you're considering.",
    "🧮 At Earth's surface: V = −6.67×10⁻¹¹ × 5.97×10²⁴ / 6.37×10⁶ = −62.5×10⁶ J/kg = −62.5 MJ/kg. Every kilogram of you has −62.5 MJ of gravitational potential energy relative to infinity. To escape Earth, each kg needs 62.5 MJ of kinetic energy — that's the energy in 1.5 liters of gasoline!",
    "⚫ The potential well near a black hole is incredibly deep. For a black hole with mass 10× the Sun, at its event horizon (r = 30 km): V = −GM/r = −6.67×10⁻¹¹ × 2×10³¹ / 30000 = −4.4×10¹⁶ J/kg. That's 700 million times deeper than Earth's well! No wonder light can't escape."
  ],
  ideal_gas_pressure: [
    "🚲 You're pumping up a bicycle tire. With each pump stroke, you compress more air molecules into the tire, and the pressure increases. But what is pressure, really? It's the collective effect of billions of trillions of gas molecules slamming into the tire walls billions of times per second!",
    "📐 When a molecule of mass m hits the wall with x-velocity v_x, it bounces back with −v_x. Momentum change per collision: Δp = −2mv_x. The force from one molecule = Δp/Δt. Time between hits on the same wall: Δt = 2L/v_x. So F_one = mv_x²/L.",
    "🧮 Summing over all N molecules: F_total = (m/L) × Σv_x². Since motion is random, <v_x²> = <v_y²> = <v_z²> = <v²>/3. So Σv_x² = N<v²>/3. Total force F = (Nm<v²>)/(3L). Pressure P = F/A = (Nm<v²>)/(3LA) = (Nm<v²>)/(3V).",
    "✅ P = (1/3)(N/V)m<v²> = (1/3)ρ<v²>. For air at sea level (ρ = 1.2 kg/m³, <v²> = (483 m/s)²): P = (1/3)×1.2×233,000 = 93,200 Pa ≈ 0.92 atm. Close to 1 atm! Each square centimeter of your tire wall is struck by about 2.5×10²³ molecules per second. That's 250 billion billion impacts — every single second!"
  ],
  pressure_ke: [
    "🍲 You're cooking with a pressure cooker. The lid seals tight, trapping steam inside. The pressure builds up because the gas molecules are moving faster (heated) in the same volume. Let's connect pressure to the microscopic kinetic energy of individual molecules.",
    "📐 From kinetic theory: P = (1/3)(N/V)m<v²>. Multiply and divide by 2: P = (2/3)(N/V)×(½)m<v²>. The term (½)m<v²> is the average translational kinetic energy per molecule!",
    "🧮 P = (2/3)(N/V)×KE_avg. Pressure is directly proportional to both the number density of molecules and their average kinetic energy. In a pressure cooker, as you heat the contents, KE_avg increases, so pressure rises — that's why the safety valve is critical!",
    "✅ P ∝ (2/3) × (number density) × KE_avg. At room temperature (KE_avg = 6.2×10⁻²¹ J, N/V = 2.5×10²⁵ m⁻³): P = (2/3)×2.5×10²⁵×6.2×10⁻²¹ = 103,000 Pa ≈ 1 atm. The pressure doubles if you double either the density or the temperature!"
  ],
  temperature_ke: [
    "🌡️ You're checking a fever with a thermometer. Mercury rises — but what does temperature really measure at the molecular level? The ideal gas law PV = NkT relates macroscopic pressure/volume/temperature. Combine this with the microscopic kinetic theory result PV = (2/3)N×KE_avg.",
    "📐 PV from ideal gas law: PV = NkT. PV from kinetic theory: PV = (2/3)N×KE_avg. Here k = 1.38×10⁻²³ J/K is Boltzmann's constant — it connects the macroscopic world (temperature) to the microscopic world (molecular energy).",
    "🧮 Equate: NkT = (2/3)N×KE_avg. The number N cancels! Temperature is directly proportional to average kinetic energy per molecule, independent of how many molecules there are.",
    "✅ KE_avg = (3/2)kT. At 300 K (room temp): KE_avg = (3/2)×1.38×10⁻²³×300 = 6.21×10⁻²¹ J. At 0 K (−273°C), all molecular motion stops — absolute zero! This is why you can't reach absolute zero: to extract that last bit of kinetic energy would require infinite work. The coldest temperature ever achieved in a lab is about 100 pK (picokelvin)!"
  ],
  rms_speed: [
    "👃 You walk into a room and smell freshly baked bread. The aroma molecules travel from the kitchen to your nose — but how fast are individual molecules actually moving? Start with KE_avg = (3/2)kT = (½)m<v²>. This relates temperature to molecular motion.",
    "📐 Solve for mean square speed: <v²> = 3kT/m. The mean square speed is 3kT divided by molecular mass. Lighter molecules move faster at the same temperature. Hydrogen (H₂) molecules at room temperature have about 16× the mean square speed of oxygen (O₂)!",
    "🧮 RMS speed v_rms = √(3kT/m). For oxygen (m = 5.3×10⁻²⁶ kg) at 300 K: v_rms = √(3×1.38×10⁻²³×300/5.3×10⁻²⁶) = √(2.34×10⁵) = 483 m/s.",
    "✅ v_rms = √(3kT/m) = √(3RT/M). Oxygen molecules zip around at 483 m/s = 1,740 km/h — faster than a jet fighter! But they don't travel far in a straight line; they collide with other molecules about 7 billion times per second, each collision changing direction. This zigzag path (diffusion) is why smell takes seconds to cross a room, not milliseconds."
  ],
  shm_mass_spring: [
    "🚗 Your car hits a bump and the suspension bounces. The spring pushes back with a force proportional to how much it's compressed — Hooke's Law: F = −kx. The negative sign means the force always pushes toward equilibrium. This restoring force is the heart of Simple Harmonic Motion.",
    "📐 Newton's Second Law: F = ma. So ma = −kx. But for SHM, acceleration is proportional to displacement in the opposite direction: a = −ω²x (ω is angular frequency). Substitute: m(−ω²x) = −kx.",
    "🧮 Cancel −x from both sides: mω² = k, so ω² = k/m. The angular frequency depends on the spring constant and mass. A stiffer spring (higher k) = faster oscillation. A heavier mass = slower oscillation. ω = √(k/m).",
    "✅ ω = √(k/m), T = 2π√(m/k). For a car with 1000 kg on springs with k = 40,000 N/m total: ω = √(40000/1000) = 6.32 rad/s, T = 2π/6.32 = 0.99 s. Your car bounces about once per second. Race cars use stiffer springs (higher k) for better handling — that's why they feel harsh on bumpy roads!"
  ],
  shm_displacement: [
    "🎵 A metronome ticks back and forth, marking time for a pianist. Its motion is SHM — the projection of uniform circular motion onto a diameter. Imagine a point moving around a circle at constant angular speed ω. Its x-coordinate traces out a cosine wave over time.",
    "📐 Displacement: x = x₀ cos(ωt). At t = 0, x = x₀ (fully right). At t = π/(2ω), x = 0 (center). At t = π/ω, x = −x₀ (fully left). Velocity is the derivative: v = −ωx₀ sin(ωt). Using sin² + cos² = 1: v = ±ω√(x₀² − x²). At the center, speed is maximum. At extremes, speed is zero.",
    "📐 Acceleration is the derivative of velocity: a = −ω²x₀ cos(ωt) = −ω²x. This is the hallmark of SHM — acceleration is always proportional to displacement and opposite in direction. At the extremes, acceleration is maximum. At center, acceleration is zero.",
    "✅ x = x₀ cos(ωt), v = ±ω√(x₀²−x²), a = −ω²x. For a metronome with ω = 2π rad/s and x₀ = 0.1 m: at t = 0.2 s, x = 0.1×cos(2π×0.2) = 0.1×cos(72°) = 0.031 m, v = −2π×0.1×sin(72°) = −0.6 m/s, a = −(2π)²×0.031 = −1.22 m/s². This simple pattern describes everything from guitar strings to swaying buildings!"
  ],
  simple_pendulum: [
    "🕰️ You're watching a grandfather clock. The pendulum swings majestically — and it keeps near-perfect time because its period doesn't depend on how wide it swings (for small angles). Galileo supposedly discovered this watching a swinging chandelier in Pisa Cathedral, timing it with his pulse.",
    "📐 The restoring force is the component of gravity along the arc: F = −mg sin θ. For small angles (θ < 15°), sin θ ≈ θ. And arc length x = Lθ, so θ = x/L. Therefore F ≈ −mg(x/L) = −(mg/L)x. The force is proportional to displacement — SHM!",
    "🧮 Using F = ma: ma = −(mg/L)x. The mass m cancels! a = −(g/L)x. Comparing with a = −ω²x: ω² = g/L. The period depends only on length and gravity — not on mass or amplitude.",
    "✅ T = 2π√(L/g). A 1 m pendulum: T = 2π√(1/9.81) = 2.01 s. This is why grandfather clocks have pendulums about 1 m long — each swing takes one second. On the Moon (g = 1.62 m/s²), the same pendulum would take T = 2π√(1/1.62) = 4.93 s — nearly 5 seconds per swing!"
  ],
  shm_energy: [
    "🪃 You're bouncing on a trampoline. At the top, you're momentarily motionless — all your energy is gravitational potential. As you fall, PE converts to KE. At the bottom, the mat stretches and stores elastic energy. Then you're launched back up. Total mechanical energy is conserved throughout.",
    "📐 For a mass-spring system: Elastic PE = ½kx². KE = ½mv². At any point, total E = PE + KE = ½kx² + ½mv². Energy sloshes back and forth between these two forms.",
    "🧮 Substituting SHM velocity: v² = ω²(x₀² − x²) and ω² = k/m: KE = ½m × (k/m)(x₀² − x²) = ½k(x₀² − x²). Total E = PE + KE = ½kx² + ½k(x₀² − x²) = ½kx₀².",
    "✅ E_total = ½kx₀² = constant! For a trampoline with k = 5000 N/m bouncing 0.5 m amplitude: E = ½×5000×0.25 = 625 J. This energy is always conserved — it just trades between potential at the extremes and kinetic at the center. A real trampoline loses energy to air resistance and internal friction, which is why you need to keep pumping your legs!"
  ],
  youngs_double_slit: [
    "💡 It's 1801. Thomas Young performs a revolutionary experiment that proves light is a wave. He shines light through two tiny slits and observes alternating bright and dark bands on a screen — interference! Water waves do the same thing when passing through two openings in a barrier.",
    "📐 The path difference from the two slits to a point on the screen is Δ = d sin θ. If this equals a whole number of wavelengths (mλ), the waves arrive in phase and interfere constructively — bright fringe. If it's a half-wavelength (m+½)λ, they cancel — dark fringe.",
    "🧮 For bright fringes: d sin θ = mλ. For small angles (screen far away), sin θ ≈ y/L, so y = mλL/d. The distance from center to the mth bright fringe is proportional to wavelength and screen distance, inversely proportional to slit spacing.",
    "✅ Δy = λL/d. For red light (λ = 650 nm) with d = 0.5 mm, L = 2 m: Δy = 650×10⁻⁹×2/0.0005 = 2.6 mm. Young measured these tiny fringe spacings and calculated the wavelength of light — less than a micrometer! This experiment settled the centuries-old debate: light is a wave."
  ],
  diffraction_grating: [
    "💿 You hold a CD up to the light and see a rainbow of colors. The CD's surface has a spiral track with grooves spaced 1.6 μm apart — it acts as a diffraction grating! When white light hits it, different wavelengths (colors) bend at different angles, creating the rainbow.",
    "📐 The grating equation is the same as double-slit: d sin θ = mλ. But a grating has thousands of slits per mm, producing much sharper, brighter fringes. The grating spacing d = 1/N where N is the number of lines per unit length.",
    "🧮 For a grating with 500 lines/mm: d = 1/500 mm = 2×10⁻⁶ m. For green light (λ = 550 nm), m = 1: sin θ = 1×550×10⁻⁹/2×10⁻⁶ = 0.275, so θ₁ = 16.0°. For red light (λ = 650 nm): sin θ = 0.325, θ₁ = 19.0°. The colors spread out!",
    "✅ Maximum order: m_max < d/λ. For d = 2 μm, λ = 550 nm: m_max = floor(2×10⁻⁶/550×10⁻⁹) = floor(3.64) = 3. You can see up to 3rd order on each side — 6 bright spots plus the central maximum! CD rainbows, spectrometers, and even the beautiful colors of butterfly wings all use diffraction gratings."
  ],
  electric_potential_point: [
    "⚡ You're standing near a lightning rod during a thunderstorm. The rod concentrates charge at its tip, creating a strong electric field that ionizes the air and safely conducts lightning to ground. The electric potential V at any point tells you the potential energy per unit charge.",
    "📐 To find V from a point charge Q, calculate the work to bring a test charge q from infinity to distance r: W = ∫_∞^r F dr = ∫_∞^r (kQq/r²) dr. The integral of 1/r² is −1/r.",
    "🧮 Evaluating: W = kQq[−1/r]_∞^r = kQq(0 + 1/r) = kQq/r. But potential V = W/q (work per unit charge). The test charge cancels: V = kQ/r.",
    "✅ V = kQ/r = Q/(4πε₀r). For a Van de Graaff generator dome (Q = 1 μC, r = 0.15 m): V = 9×10⁹ × 10⁻⁶/0.15 = 60,000 V = 60 kV! That's enough to make your hair stand on end. Potential is positive for positive charges, negative for negative. Near a proton (Q = 1.6×10⁻¹⁹ C, r = 1 Å): V = 14.4 V — a huge potential at the atomic scale!"
  ],
  capacitance: [
    "📱 Your phone's touchscreen detects your finger's touch using capacitors. When you touch the screen, you change the capacitance at that point. A capacitor is two parallel plates separated by an insulator. The capacitance C tells you how much charge it stores per volt: C = Q/V.",
    "📐 Between parallel plates, the electric field is uniform: E = V/d. Also, from Gauss's law, E = σ/ε₀ = Q/(Aε₀), where σ is surface charge density. Set these equal: V/d = Q/(Aε₀).",
    "🧮 Solve for Q: Q = (ε₀A/d)V. Since C = Q/V: C = ε₀A/d. For a touchscreen sensor (A = 4 mm², d = 0.1 mm glass): C = 8.85×10⁻¹²×4×10⁻⁶/1×10⁻⁴ = 3.5×10⁻¹³ F = 0.35 pF. Tiny!",
    "✅ C = ε₀A/d. With a dielectric (like glass) of relative permittivity εᵣ: C = ε₀εᵣA/d. For a typical capacitor with A = 0.01 m², d = 0.1 mm: C = 8.85×10⁻¹²×0.01/0.0001 = 8.85×10⁻¹⁰ F ≈ 885 pF. Larger plates, closer spacing, and higher-εᵣ dielectrics all increase capacitance."
  ],
  equivalent_capacitance: [
    "⚡ Your camera's flash needs a sudden burst of energy. A large capacitor bank stores charge slowly, then releases it instantly. Sometimes capacitors are connected in series (to handle higher voltage) or parallel (to store more charge). Their equivalent capacitance is the opposite of resistors.",
    "📐 In SERIES: The same charge Q flows through each capacitor. Q = Q₁ = Q₂ = Q₃. Voltages add: V = V₁ + V₂ + V₃ = Q/C₁ + Q/C₂ + Q/C₃ = Q(1/C₁ + 1/C₂ + 1/C₃). Since V = Q/C_eq: 1/C_eq = 1/C₁ + 1/C₂ + 1/C₃. Series capacitance is LESS than the smallest individual — like making a thicker insulator.",
    "📐 In PARALLEL: Voltage is the SAME across each: V = V₁ = V₂ = V₃. Charges add: Q = Q₁ + Q₂ + Q₃ = C₁V + C₂V + C₃V = V(C₁ + C₂ + C₃). Since Q = C_eqV: C_eq = C₁ + C₂ + C₃. Parallel capacitance ADDS — like making larger plates.",
    "✅ Series: 1/C_eq = Σ(1/Cᵢ). Parallel: C_eq = ΣCᵢ. For C₁ = 10 μF, C₂ = 20 μF: series gives 1/(1/10+1/20) = 6.67 μF (less), parallel gives 10+20 = 30 μF (more). Camera flash capacitors use parallel banks: four 100 μF in parallel = 400 μF, storing enough energy for a brilliant flash!"
  ],
  capacitor_energy: [
    "❤️ A defibrillator delivers a life-saving electric shock to restart a heart. Inside, a capacitor stores energy and releases it in milliseconds. The energy stored in a capacitor comes from the work done to separate charges — building up positive charge on one plate and negative on the other against the growing electric field.",
    "📐 To charge a capacitor from 0 to Q, you move small charge increments Δq. The voltage increases linearly: V = q/C. On a V-q graph, voltage rises from 0 to V as charge builds from 0 to Q. The work done is the area under this line.",
    "🧮 The area is a triangle: Area = ½ × base × height = ½ × Q × V. This area equals the stored energy E. Using Q = CV: E = ½QV = ½CV² = Q²/2C.",
    "✅ E = ½CV². A defibrillator capacitor: C = 100 μF, charged to 5000 V: E = ½×100×10⁻⁶×5000² = 1250 J. That 1250 J is delivered in about 5 ms — a power of 250,000 W for an instant! This is why the patient's chest jumps. The same physics powers camera flashes (E = ½×200×10⁻⁶×300² = 9 J per flash), delivering a brilliant burst of light."
  ],
  rc_circuit: [
    "🚗 Your car's windshield wipers have an intermittent setting — wipe, pause, wipe again. The timing is controlled by an RC circuit: a resistor and capacitor work together to create a precise time delay. The capacitor charges through the resistor, and when it reaches a threshold voltage, the wipers activate.",
    "📐 Apply Kirchhoff's Voltage Law: V_battery = IR + Q/C. Since I = dQ/dt, we get a differential equation: R(dQ/dt) + Q/C = V. This describes how the charge builds up over time.",
    "🧮 The solution: Q(t) = CV(1 − e⁻ᵗ/ᴿᶜ). The charge approaches Q₀ = CV exponentially. τ = RC is the time constant — the time to reach 63% of full charge. After 3τ: 95%. After 5τ: 99.3% — essentially fully charged.",
    "✅ τ = RC. For the wiper circuit (R = 100 kΩ, C = 100 μF): τ = 100,000 × 100×10⁻⁶ = 10 s. The capacitor reaches the threshold at about 7 s, triggering the wiper sweep. Discharging: Q(t) = Q₀e⁻ᵗ/ᴿᶜ. After t = RC, only 37% remains. RC circuits are everywhere — from pacemakers to audio filters to the 60 Hz debounce filter on your keyboard!"
  ],
  ac_power: [
    "💡 You look at your electricity bill. It charges you for kilowatt-hours of energy used. But the voltage and current in your home are alternating — they reverse direction 50 or 60 times per second. How do you calculate the average power when voltage and current are constantly changing?",
    "📐 Instantaneous power in a resistor: P(t) = I²R = (I₀ sin ωt)²R = I₀²R sin²ωt. The power pulses at twice the frequency — it's always positive (heating is the same regardless of current direction), but varies between 0 and I₀²R.",
    "🧮 Average of sin²ωt over a full cycle = ½. So <P> = ½I₀²R. Define RMS (Root Mean Square) current: I_rms = √(<I²>) = I₀/√2. Then <P> = I_rms²R = I_rmsV_rms.",
    "✅ <P> = I_rmsV_rms. For US household supply (V_rms = 120 V, I_rms = 10 A): <P> = 1200 W. Peak voltage V₀ = 120×√2 = 170 V. Peak-to-peak = 340 V! Your '120 V' outlet actually swings from +170 V to −170 V, 60 times per second. The 120 V you read is the RMS value — the DC voltage that would deliver the same average power."
  ],
  inductive_reactance: [
    "🌀 Your electric fan has an inductor (a coil of wire) inside. When AC passes through it, the inductor resists changes in current — creating back EMF. This opposition to AC is called inductive reactance X_L. Unlike a resistor, it doesn't dissipate energy — it stores and releases it in the magnetic field.",
    "📐 The voltage across an inductor: V = L(dI/dt). For sinusoidal current I = I₀ sin ωt: V = L × d(I₀ sin ωt)/dt = ωLI₀ cos ωt. Notice: voltage involves cos, current involves sin — they're 90° out of phase! Voltage LEADS current by 90°.",
    "🧮 The peak voltage V₀ = ωLI₀. By analogy with Ohm's Law (V = IR), define inductive reactance X_L = V₀/I₀ = ωL = 2πfL. Like resistance, its unit is ohms. But X_L depends on frequency — at DC (f=0), X_L = 0 (inductor acts as a short). At high frequencies, X_L is huge (inductor blocks AC).",
    "✅ X_L = 2πfL. For a fan motor inductor (L = 0.5 H) at 50 Hz: X_L = 2π×50×0.5 = 157 Ω. At 60 Hz: X_L = 188 Ω. At 1000 Hz: X_L = 3142 Ω — 20× more! This is why inductors are used in audio crossovers: they block high frequencies from reaching the woofer and let low frequencies pass through."
  ],
  capacitive_reactance: [
    "📻 Your radio tuner uses a variable capacitor to select different stations. When AC passes through a capacitor, the plates alternately charge and discharge. The capacitor resists voltage changes — this opposition is capacitive reactance X_C, which behaves opposite to inductors.",
    "📐 The current through a capacitor: I = C(dV/dt). For sinusoidal voltage V = V₀ sin ωt: I = C × d(V₀ sin ωt)/dt = ωCV₀ cos ωt. Current involves cos, voltage involves sin — also 90° out of phase, but current LEADS voltage (opposite of inductor)!",
    "🧮 Peak current I₀ = ωCV₀. Define capacitive reactance X_C = V₀/I₀ = 1/(ωC) = 1/(2πfC). At DC (f=0), X_C → ∞ (capacitor blocks DC). At high frequencies, X_C → 0 (capacitor passes AC easily). This is why capacitors are used to couple AC signals while blocking DC bias.",
    "✅ X_C = 1/(2πfC). For a radio tuning capacitor (C = 100 pF) at 1 MHz (AM band): X_C = 1/(2π×10⁶×100×10⁻¹²) = 1/(6.28×10⁻⁴) = 1592 Ω. At 100 MHz (FM band): X_C = 1/(2π×10⁸×10⁻¹⁰) = 15.9 Ω. The capacitor passes FM easily but resists AM — exactly what a radio tuner needs!"
  ],
  impedance: [
    "🎵 Your stereo system has a crossover network that splits the audio signal: low frequencies go to the woofer, high frequencies to the tweeter. This uses the frequency-dependent behavior of inductors and capacitors. The total opposition to AC is impedance Z — a combination of resistance R and reactance X.",
    "📐 In a series RL or RC circuit, the voltages across R and X are 90° out of phase. They add as vectors (Pythagorean theorem), not as simple numbers. The total voltage squared = V_R² + V_X².",
    "🧮 Using Ohm's Law for each: V_R = IR (in phase), V_L = IX_L (leading 90°), V_C = IX_C (lagging 90°). Substituting: (IZ)² = (IR)² + (IX)². Cancel I²: Z² = R² + X².",
    "✅ Z = √(R² + X²). For a speaker crossover: woofer path has L = 5 mH (X_L = 2π×1000×0.005 = 31.4 Ω at 1 kHz) and R = 8 Ω: Z_woofer = √(8² + 31.4²) = √1057 = 32.5 Ω. The tweeter path uses a capacitor C = 10 μF (X_C = 1/(2π×1000×10⁻⁵) = 15.9 Ω at 1 kHz): Z_tweeter = √(8² + 15.9²) = 17.8 Ω. At 100 Hz, the woofer impedance drops (easier to drive) while the tweeter impedance skyrockets — effectively directing frequencies to the right driver!"
  ],
  photoelectric: [
    "☀️ You walk through automatic sliding doors at the supermarket. A light beam above the door is broken by your presence, triggering the mechanism. But here's the puzzle: shine dim blue light and it works fine; shine bright red light and nothing happens — even if the red light is 100× brighter! This baffled physicists until Einstein explained it in 1905.",
    "📐 Planck proposed that light comes in discrete packets (quanta) called photons, each with energy E = hf. Here h = 6.63×10⁻³⁴ J·s is Planck's constant — a fundamental constant of nature. Blue light (f ≈ 6.5×10¹⁴ Hz) has more energy per photon than red light (f ≈ 4.5×10¹⁴ Hz).",
    "🧮 Each metal has a work function Φ = hf₀ — the minimum energy needed to eject an electron. For sodium: Φ ≈ 2.3 eV. A photon with energy > Φ can eject an electron; the excess becomes kinetic energy. Conservation of energy: hf = Φ + KE_max.",
    "✅ KE_max = hf − Φ. This is Einstein's photoelectric equation, for which he won the Nobel Prize. If hf < Φ, no electrons are ejected — regardless of intensity! Solar panels use this: photons knock electrons loose, creating current. Silicon's work function (≈ 1.1 eV) means it responds to infrared through visible light — perfectly matched to the Sun's spectrum!"
  ],
  de_broglie: [
    "🔬 You're looking at an image from an electron microscope, showing individual atoms arranged like a crystal lattice. But how can a microscope see something smaller than the wavelength of visible light? The answer: use electrons instead of photons! In 1924, Louis de Broglie proposed that all matter has wave-like properties.",
    "📐 For photons: E = hf = hc/λ (Planck-Einstein). Also E = pc (from special relativity for massless particles). Equate: hc/λ = pc. Cancel c: h/λ = p. So λ = h/p. For photons, wavelength = Planck's constant / momentum.",
    "🧮 De Broglie's bold hypothesis: this applies to ALL matter, not just photons! Any object with momentum p has a wavelength λ = h/p = h/(mv). An electron (m = 9.11×10⁻³¹ kg) moving at v = 10⁶ m/s: λ = 6.63×10⁻³⁴/(9.11×10⁻³¹×10⁶) = 7.28×10⁻¹⁰ m = 0.73 nm. That's smaller than atomic spacing!",
    "✅ λ = h/p = h/(mv). Electron microscopes use this: electrons accelerated to 100,000 eV have λ ≈ 0.0037 nm — 100,000× smaller than visible light! This is why they can resolve individual atoms. A cricket ball (m = 0.16 kg) moving at 30 m/s has λ = 1.4×10⁻³⁴ m — so tiny it's undetectable, which is why macroscopic objects don't show obvious wave behavior."
  ],
  mass_defect: [
    "☢️ A nuclear power plant generates electricity by splitting uranium atoms. When a uranium nucleus splits, the products have slightly less total mass than the original nucleus. Where does the mass go? It's converted to energy! E = mc². A small amount of mass releases an enormous amount of energy.",
    "📐 A nucleus is made of Z protons and (A−Z) neutrons. The total mass of these separate nucleons: m_total = Zm_p + (A−Z)m_n. For helium-4 (2 protons, 2 neutrons): m_total = 2×1.00728 + 2×1.00866 = 4.03188 amu.",
    "🧮 But the actual mass of a helium-4 nucleus is 4.00151 amu. Mass defect Δm = 4.03188 − 4.00151 = 0.03037 amu = 5.04×10⁻²⁹ kg. Using E = Δm × c²: E = 5.04×10⁻²⁹ × (3×10⁸)² = 4.54×10⁻¹² J = 28.3 MeV.",
    "✅ E_binding = Δm × c². For helium-4, 28.3 MeV of binding energy holds the nucleus together — that's about 7.1 MeV per nucleon. To put this in perspective: 1 kg of nuclear fuel (uranium) releases about 2.5 million times more energy than 1 kg of coal! This is the principle behind both nuclear power and nuclear weapons — harnessing Einstein's most famous equation."
  ],
  decay_law: [
    "🦴 You're an archaeologist who's discovered an ancient wooden tool. How old is it? Carbon-14 dating tells you. Carbon-14 is radioactive — it decays over time. The rate of decay depends only on how many radioactive atoms remain: dN/dt = −λN, where λ is the decay constant. This differential equation describes exponential decay.",
    "📐 Separate variables: dN/N = −λ dt. Integrate both sides: ∫(dN/N) = −λ∫dt. ln N = −λt + C. At t = 0, N = N₀, so C = ln N₀. Therefore ln N = −λt + ln N₀.",
    "🧮 Rearranging: ln(N/N₀) = −λt. Take exponential of both sides: N/N₀ = e⁻ˡᵗ. So N = N₀e⁻ˡᵗ. The number of undecayed nuclei decreases exponentially over time. Each nucleus has the same probability of decaying per unit time, independent of its age — there's no 'aging' of individual nuclei!",
    "✅ N = N₀e⁻ˡᵗ. For carbon-14 (λ = 1.21×10⁻⁴ year⁻¹), after 5730 years (one half-life): N = N₀e⁻⁰·⁶⁹³ = N₀/2 — exactly half remains. By measuring the remaining ¹⁴C in the ancient wooden tool, you can calculate when the tree was cut down. This works for samples up to about 50,000 years old — beyond that, too little ¹⁴C remains."
  ],
  half_life: [
    "🏥 You're a nuclear medicine technician preparing a radioactive tracer for a patient's PET scan. The tracer (fluorine-18) has a half-life of 110 minutes. You need to calculate how much remains active by the time it's injected. Half-life is the time for half the nuclei to decay — and it's related to the decay constant by a simple formula.",
    "📐 By definition: at t = T_½, N = N₀/2. Substitute into the decay law: N₀/2 = N₀e⁻ˡᵀ_½. Cancel N₀: 1/2 = e⁻ˡᵀ_½.",
    "🧮 Take natural log: ln(1/2) = −λT_½. Since ln(1/2) = −ln(2) = −0.693: −0.693 = −λT_½. So T_½ = 0.693/λ.",
    "✅ T_½ = ln(2)/λ = 0.693/λ. For fluor-18 (T_½ = 110 min): λ = 0.693/110 = 0.00630 min⁻¹. If prepared at 8:00 AM and injected at 10:00 AM (2 hours later): N/N₀ = e⁻⁰·⁰⁰⁶³⁰×¹²⁰ = e⁻⁰·⁷⁵⁶ = 0.47. Only 47% of the tracer remains active! Different half-lives: uranium-238 (4.5 billion years — Earth's age), iodine-131 (8 days — medical treatment), polonium-214 (164 microseconds — barely exists!)."
  ],
  wien_law: [
    "🔥 A blacksmith heats a piece of iron. First it glows dull red, then orange, then yellow, then white-hot — and would turn blue if it didn't melt first. The color of hot objects tells us their temperature. Wien's Displacement Law: the peak wavelength λ_max is inversely proportional to temperature T.",
    "📐 All objects emit thermal radiation. The spectrum has a peak — the wavelength where most energy is emitted. As temperature increases, this peak shifts to shorter (bluer) wavelengths: λ_max ∝ 1/T.",
    "🧮 Wien's constant: b = 2.9×10⁻³ m·K. λ_max × T = b. For the Sun (T = 5800 K): λ_max = 2.9×10⁻³/5800 = 500 nm — that's green light! Our eyes evolved to be most sensitive to the Sun's peak wavelength. For a red star (T = 3000 K): λ_max = 967 nm (infrared). For a blue star (T = 30,000 K): λ_max = 97 nm (ultraviolet).",
    "✅ λ_max × T = 2.9×10⁻³ m·K. A blacksmith's forge at 1300 K: λ_max = 2.9×10⁻³/1300 = 2230 nm (far infrared — you FEEL the heat before you see it glow). At 800 K: λ_max = 3625 nm. The human body (310 K): λ_max = 9350 nm — we glow in the infrared! This is how thermal imaging cameras and night vision work."
  ],
  hubble_law: [
    "🌌 You're an astronomer at the Mount Wilson Observatory in 1929. Edwin Hubble makes a shocking discovery: every distant galaxy is moving away from us, and the farther away they are, the faster they recede. The universe is expanding! v ∝ d — recession velocity is proportional to distance.",
    "📐 Hubble's Law: v = H₀ × d. H₀ (the Hubble constant) ≈ 70 km/s/Mpc. A galaxy at 100 Mpc (326 million light-years) recedes at 7000 km/s. A galaxy at 1000 Mpc recedes at 70,000 km/s — that's 23% of the speed of light!",
    "🧮 If the universe has been expanding at a constant rate, we can rewind: time = distance/speed = d/(H₀d) = 1/H₀. This gives the age of the universe! t = 1/(70 km/s/Mpc). Convert: 1 Mpc = 3.086×10¹⁹ km, so t = 3.086×10¹⁹/70 = 4.41×10¹⁷ s ≈ 14 billion years.",
    "✅ v = H₀d, Age ≈ 1/H₀ ≈ 13.8 billion years. The current best estimate from the Planck satellite: H₀ = 67.4 km/s/Mpc, giving age = 13.8 billion years. Everything in the universe was once concentrated at a single point — the Big Bang! This discovery transformed our view of the cosmos and earned Hubble a place among the greatest scientists in history."
  ],
  coriolis: [
    "🌀 You're watching a weather forecast. The meteorologist points to a swirling cyclone spinning counterclockwise in the Northern Hemisphere. Why do storms spin? The Coriolis force — an apparent force that deflects moving objects on the rotating Earth. It's why winds don't blow straight from high to low pressure.",
    "📐 Earth rotates once per 24 hours: ω = 2π/86400 = 7.27×10⁻⁵ rad/s. A point on the equator moves at v = ωR = 7.27×10⁻⁵ × 6.37×10⁶ = 463 m/s (1670 km/h). At latitude 45°, the rotational speed is v = ωR cos 45° = 327 m/s.",
    "🧮 When air moves toward the equator, it conserves angular momentum: L = mvR cos θ = constant. As latitude decreases, R cos θ increases, so v must decrease — but the air retains its higher eastward speed from higher latitudes, so it appears to deflect to the right in the Northern Hemisphere. The force: F_c = 2mvω sin θ.",
    "✅ F_c = 2mvω sin θ. For a hurricane-force wind (m = 1 kg of air, v = 50 m/s) at latitude 30°: F_c = 2×1×50×7.27×10⁻⁵×0.5 = 0.0036 N/kg. Tiny, but over hundreds of kilometers, it deflects air masses enough to create cyclones! Northern Hemisphere: deflection right. Southern: left. Zero at equator — hurricanes can't form there. This is why the Coriolis effect determines global wind patterns and ocean currents."
  ],
  newton_cannon: [
    "🛰️ Isaac Newton imagined a cannon on a mountaintop firing balls horizontally. A slow ball falls to Earth in a curve. A faster ball travels farther before hitting the ground. But what if you fire it so fast that the Earth curves away beneath it at exactly the same rate as the ball falls? The ball would circle Earth forever — it's in orbit!",
    "📐 Horizontal motion: x = vt. The ball moves at constant speed horizontally with no air resistance. Vertical motion: y = ½gt². It falls under gravity just like any dropped object. Combining: y = (g/2v²)x² — the path is a parabola.",
    "🧮 But Earth is round! It curves away with drop = x²/(2R) over horizontal distance x. For the cannonball to stay at constant height, its fall must match Earth's curvature: ½gt² = x²/(2R). Using x = vt: ½gt² = (vt)²/(2R). Cancel ½t²: g = v²/R.",
    "✅ Orbital condition: a_c = v²/r = g. Solving: v = √(gR) = √(9.81 × 6.37×10⁶) = 7905 m/s ≈ 7.9 km/s! Newton realized this in the 1680s — more than 250 years before the first rocket reached orbit in 1957 (Sputnik 1). Today, the ISS orbits at about 7.66 km/s, completing a lap around Earth every 90 minutes. Newton's thought experiment was the birth of orbital mechanics!"
  ]
};

for (const [key, storyLines] of Object.entries(stories)) {
  const keyPos = content.indexOf(`${key}: {`);
  if (keyPos === -1) { console.log(`Could not find: ${key}`); continue; }

  const afterKey = content.substring(keyPos);
  const stepsStart = afterKey.indexOf('steps: [');
  if (stepsStart === -1) { console.log(`No steps for: ${key}`); continue; }

  const stepsContentStart = keyPos + stepsStart + 8;

  let depth = 1;
  let pos = stepsContentStart;
  while (depth > 0 && pos < content.length) {
    if (content[pos] === '[') depth++;
    else if (content[pos] === ']') depth--;
    pos++;
  }
  const stepsEnd = pos - 1;

  const stepsSection = content.substring(stepsContentStart, stepsEnd);

  let searchPos = 0;
  let stepIdx = 0;
  let modifiedSection = stepsSection;

  while (stepIdx < storyLines.length) {
    const detailStart = modifiedSection.indexOf("detail: '", searchPos);
    if (detailStart === -1) break;

    const valueStart = detailStart + 9;

    let quoteEnd = valueStart;
    while (quoteEnd < modifiedSection.length) {
      if (modifiedSection[quoteEnd] === "'" && modifiedSection[quoteEnd - 1] !== '\\') {
        break;
      }
      quoteEnd++;
    }

    const escStory = storyLines[stepIdx].replace(/'/g, "\\'");
    modifiedSection = modifiedSection.substring(0, valueStart) + escStory + modifiedSection.substring(quoteEnd);
    searchPos = valueStart + escStory.length;
    stepIdx++;
  }

  if (stepIdx !== storyLines.length) {
    console.log(`Warning: ${key} - expected ${storyLines.length} steps, found ${stepIdx} detail fields`);
  }

  content = content.substring(0, stepsContentStart) + modifiedSection + content.substring(stepsEnd);
  console.log(`Updated: ${key} (${stepIdx} steps)`);
}

writeFileSync(filePath, content);
console.log('\nAll Class 12 derivations updated!');
