import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const stories = {};

stories['LabP10DerivationCriticalAngle.tsx'] = [
  `Swimming underwater, you look up at the surface. The world above appears as a shimmering circle. Light bends as it leaves water (n=1.33) into air (n=1.0). Snell's law n₁ sinθᵢ = n₂ sinθr describes exactly how much it bends.`,
  `As you swim deeper and look up at a steeper angle, the bright circle shrinks. At a certain angle, the refracted ray runs along the surface at 90 degrees. This is the critical angle — beyond it, you can no longer see above the water.`,
  `With sin 90 = 1, Snell's law simplifies: n₁ sinθc = n₂. The water surface turns into a perfect mirror. Below the critical angle, total internal reflection takes over.`,
  `θc = sin⁻¹(n₂/n₁). For water: θc = 49 degrees. This is why diamonds sparkle (n=2.42, θc=24 degrees) — light gets trapped inside, bouncing around before escaping. Optical fibers use this principle to transmit internet data across oceans!`
];

stories['LabP10DerivationEcho.tsx'] = [
  `You re a sonar operator on a research ship mapping the ocean floor. You send a powerful ping into the deep. Speed = distance over time — the sound pulse travels through water at 1500 m/s, searching for the bottom.`,
  `The ping hits the ocean floor and reflects back up. The total journey is there AND back: D = 2d. Your sound travels twice the target distance. You wait, listening for the echo...`,
  `Your equipment measures exactly 0.4 seconds between sending the ping and receiving the echo. v = 2d/t means 1500 = 2d/0.4. The sound traveled 600 m total.`,
  `d = v x t / 2 = 1500 x 0.4 / 2 = 300 m. Divide by 2 because the sound went down AND back up! This same formula maps the ocean floor, detects submarines, and creates ultrasound images of babies in the womb.`
];

stories['LabP10DerivationElectricalEnergy.tsx'] = [
  `Your phone battery is dead. You plug it into a charger. Potential difference V = W/q means voltage tells us how much energy each coulomb of charge carries. E = qV — energy = charge times voltage.`,
  `The charger supplies current I for time t. Charge q = I x t flows into your battery. Substitute: E = IVt. That is the basic electrical energy formula. Your 5V 2A charger delivers 10 Joules every second.`,
  `Your phone circuits have resistance R. Using Ohm's law V = IR, we get E = I x (IR) x t = I-squared-R-t. This form is great for calculating heat dissipated in circuits — why your phone gets warm while charging.`,
  `Or substitute I = V/R: E = V x (V/R) x t = V-squared-t/R. Three forms, same energy. Your electricity bill charges in kWh. A 100W bulb burning 10 hours uses 1 kWh = 3.6 million Joules. Energy companies use E = Pt!`
];

stories['LabP10DerivationElectricPower.tsx'] = [
  `You re shopping for light bulbs. An LED says 9W and an old incandescent says 60W. Power is energy per time: P = E/t. The LED uses far less energy each second for the same brightness!`,
  `Substitute E = IVt: P = IVt/t = IV. Power = current times voltage. At 230V, the 60W bulb draws I = 60/230 = 0.26A. The 9W LED draws only 0.04A. Watts tell you the energy appetite!`,
  `Using Ohm's law V = IR: P = I-squared-R. This form reveals why power lines use high voltage. P-loss = I-squared-R — lower current means dramatically less power wasted as heat.`,
  `And P = V-squared/R from I = V/R. A 230V iron with R = 53 ohms draws P = 230-squared/53 = 1000W. Three formulas, one power. Choose whichever you have the numbers for!`
];

stories['LabP10DerivationExpansionLiquids.tsx'] = [
  `On a hot summer day, you check the outdoor thermometer. The red liquid climbs up the glass tube. But here is the trick: the glass itself also expands. You are only seeing the APPARENT expansion of the liquid.`,
  `Gamma-r = Gamma-a + Gamma-g. The real expansion of the liquid (Gamma-r) equals what you observe (Gamma-a) plus the glass flask expansion (Gamma-g). The glass hides some of the liquid true expansion.`,
  `Since Gamma-r is greater than Gamma-a always, the real expansion is always bigger than what you see. The glass container grows too, making extra room for the liquid.`,
  `Gamma-a = Gamma-r - Gamma-g. Mercury thermometers work because mercury expands Gamma-r = 1.8e-4 per degree C while glass expands only Gamma-g = 2.5e-5 per degree C. The difference is visible as a clear measurement!`
];

stories['LabP10DerivationLinearExpansion.tsx'] = [
  `On a scorching summer day, train tracks can buckle under the heat. The rails expand — a 100 m steel track grows several centimeters. The change in length is proportional to original length and temperature change.`,
  `Engineers use expansion joints (gaps between rails) to prevent buckling. The constant alpha is the coefficient of linear expansion: Delta-L = alpha x L-zero x Delta-T. Steel has alpha = 1.2e-5 per degree C.`,
  `Rearranging: alpha = Delta-L/(L-zero x Delta-T). A 100 m rail heating from 15 C to 45 C expands by 3.6 cm. That gap is the sound you hear when trains go clickety-clack!`,
  `L = L-zero(1 + alpha x Delta-T). Every material has its own alpha. Invar barely expands at all — used in precision instruments like clocks and telescopes. Bimetallic strips in thermostats use two different metals to bend and switch circuits!`
];

stories['LabP10DerivationMagnification.tsx'] = [
  `You re examining a tiny antique watch with a magnifying glass. The intricate gears appear huge. Magnification M is the ratio of image height I to object height O: M = I/O. The lens makes a small thing look big.`,
  `From ray diagram geometry, similar triangles reveal the same ratio equals image distance q divided by object distance p: M = q/p. The lens creates a virtual image that your brain interprets as larger.`,
  `M = I/O = q/p. If the watch gear (O=2mm) appears as I=10mm, M = 5x. For a concave mirror, q is negative for real images. Both height ratio and distance ratio give the same answer.`,
  `For mirrors with the Cartesian sign convention: M = -q/p. Negative M means the image is inverted (upside down). A microscope uses two stages — objective lens magnifies first, then eyepiece magnifies again. Total M = M1 x M2!`
];

stories['LabP10DerivationParallelResistance.tsx'] = [
  `You flip a switch and the ceiling light turns on. Add another lamp — both stay bright. That is because they are wired in parallel. The total current splits among branches: I = I1 + I2 + I3. Each bulb gets full voltage.`,
  `Using Ohm's law for each branch: V/Req = V/R1 + V/R2 + V/R3. Voltage V is the same across all parallel components. Each bulb conducts independently.`,
  `Divide by V: 1/Req = 1/R1 + 1/R2 + 1/R3. The reciprocals add. For two 100-ohm resistors in parallel: 1/Req = 1/100 + 1/100 = 2/100, so Req = 50 ohms. Adding more paths DECREASES total resistance.`,
  `Req is always smaller than the smallest individual resistor. Three 100-ohm resistors in parallel give Req = 33 ohms. More paths = less opposition = more total current. Modern LED lights are always in parallel so if one fails, the others stay lit!`
];

stories['LabP10DerivationPhotonEnergy.tsx'] = [
  `You re at the beach on a sunny day. The sunlight feels warm, but tomorrow you might have a sunburn. Max Planck discovered that light comes in tiny packets called photons. E = hf — each photon energy equals Planck constant times frequency.`,
  `For light, c = f x lambda, so f = c/lambda. Red light (700nm) has low frequency. UV light (below 380nm) has higher frequency — meaning more energetic photons that can damage your skin.`,
  `E = hc/lambda. Shorter wavelength = higher energy. UV photons have enough energy (about 4-12 eV) to damage DNA molecules in your skin cells — that is what causes sunburn and skin cancer risk.`,
  `Light even has momentum. p = h/lambda (from de Broglie). This is why solar sails work — sunlight pushes them through space. NASA LightSail 2 uses this principle. The momentum of countless photons can propel a spacecraft!`
];

stories['LabP10DerivationPotentialDivider.tsx'] = [
  `You turn the volume knob on your speakers. Inside is a potentiometer — a variable resistor that divides voltage. For two resistors R1 and R2 in series, the current I depends on total resistance: I = Vin/(R1+R2).`,
  `The voltage you want is across R2. Using Ohm's law: Vout = I x R2. The same current flows through both resistors.`,
  `Substituting I: Vout = (Vin/(R1+R2)) x R2 = R2/(R1+R2) x Vin. The voltage divides proportionally to the resistance ratio. Turn the knob — R2 changes, Vout changes, volume changes!`,
  `When R2 goes to 0, Vout goes to 0 (silence). When R2 is huge relative to R1, Vout goes to Vin (full volume). This circuit is everywhere: dimmer switches, light sensors (LDR plus resistor), and even touchscreens!`
];

stories['LabP10DerivationRadioactiveDecay.tsx'] = [
  `An archaeologist discovers an ancient wooden tool. How old is it? Carbon-14 dating holds the answer. After one half-life (5,730 years for C-14), exactly half of the radioactive nuclei remain: N1 = half of N0.`,
  `After two half-lives (11,460 years), only a quarter remains: N2 = half x half x N0 = (half)squared x N0. The pattern is clear — each 5,730 years halves what remains.`,
  `After n half-lives: N = (half)to-the-n x N0 = N0 / 2-to-the-n. This is exponential decay. The number of half-lives n = total-time / half-life-period.`,
  `N = N0/2-to-the-(t-over-T-half). If the tool has 25 percent of original C-14, then N/N0 = 1/4 = 1/2-squared, so n = 2 half-lives = 11,460 years old. The Shroud of Turin was dated using this exact formula!`
];

stories['LabP10DerivationResistivity.tsx'] = [
  `An electrician is wiring a new house. Should she use copper or aluminum wire? Resistance depends on geometry: R is proportional to L/A. Longer wires resist more; thicker wires resist less.`,
  `R = rho x L/A. The constant rho is resistivity — the material's inherent opposition to current. Copper rho = 1.68e-8 ohm-meters. Aluminum rho = 2.65e-8 ohm-meters. Copper wins for house wiring!`,
  `rho = R x A / L. Units: ohm-meters. Silver has the lowest resistivity (1.59e-8), but it is too expensive for house wiring. Copper is the practical champion. Rubber has rho above 10-to-the-13 ohm-meters!`,
  `This is why copper is the standard for household wiring, aluminum is used in power lines (lighter, cheaper), and silicon (rho approx 640 ohm-meters) is a semiconductor — it can be tuned. Resistivity is the material electrical fingerprint!`
];

stories['LabP10DerivationSeriesResistance.tsx'] = [
  `Remember old Christmas lights where if ONE bulb burned out, the WHOLE string went dark? That is series wiring. Total voltage = V1 + V2 + V3. The sum of voltage drops equals the battery voltage.`,
  `Using Ohm's law: I x Req = I x R1 + I x R2 + I x R3. The same current I flows through every bulb — only one path. If one breaks, the current stops everywhere!`,
  `Divide by I (same everywhere): Req = R1 + R2 + R3. Simple addition. Three 100-ohm bulbs in series give 300 ohms total. More bulbs = higher resistance = dimmer each becomes.`,
  `Req is ALWAYS greater than any individual resistor. Adding more increases opposition to current. This is why modern Christmas lights are wired in parallel — each bulb gets full voltage and the rest stay lit when one fails!`
];

stories['LabP10DerivationSpecificHeatElectrical.tsx'] = [
  `You fill an electric kettle with water and switch it on. The heating element converts electrical energy into heat: Q-heater = V x I x t. A 230V 10A kettle running for 120 seconds delivers 276,000 J of energy.`,
  `The heat warms both the water AND the metal calorimeter: Q-heater = m-liquid x c-liquid x Delta-T + m-cup x c-cup x Delta-T. Some heat is stolen by the container — we must account for it.`,
  `Rearrange to find specific heat of water: c-liquid = (Q-heater - m-cup x c-cup x Delta-T) / (m-liquid x Delta-T). Subtract the calorimeter share, then divide by water mass and temperature rise.`,
  `c-liquid = (VIt - m-cup x c-cup x (Tf - Ti)) / (m-liquid x (Tf - Ti)). For water: c approx 4186 J/kg-K. That is why water is great for heating systems — it stores enormous energy per degree. The electrical method gives precise control!`
];

stories['LabP10DerivationSpecificHeatMixtures.tsx'] = [
  `You re making tea. You pour hot water into a cup and add cold milk. After a moment, the mixture reaches a comfortable drinking temperature. Conservation of energy: heat lost = heat gained.`,
  `The hot solid cools down: Q-s = m-s x c-s x (T2 - T3). It loses heat from initial high temperature T2 to final equilibrium T3. Greater specific heat means more energy released per degree.`,
  `The water and calorimeter warm up: Q-w + Q-c = (m-w x c-w + m-c x c-c)(T3 - T1). Both the liquid and the container absorb heat. The calorimeter has its own specific heat to account for.`,
  `c-s = (m-w x c-w + m-c x c-c)(T3 - T1) / (m-s x (T2 - T3)). All values are measurable in the lab. Drop a hot metal into cold water, measure temperatures, and you can identify the metal by its specific heat. This is how scientists discovered many material properties!`
];

stories['LabP10DerivationTempCoefficient.tsx'] = [
  `Your phone dies faster on a freezing winter day. That is because resistance changes with temperature. The change in resistivity is proportional to initial resistivity and temperature change.`,
  `rho-T - rho-0 = alpha x rho-0 x Delta-T. alpha is the temperature coefficient. For copper (and most metals), alpha is positive — resistance INCREASES when hot. That is why your laptop fan spins faster when working hard.`,
  `alpha = (rho-T - rho-0)/(rho-0 x Delta-T). Copper alpha = 0.0039 per degree C. A copper wire heating up by 50 C increases its resistance by 19.5 percent. This matters for power lines in summer.`,
  `rho-T = rho-0 (1 + alpha (T - T0)). Metals: positive alpha. Carbon and semiconductors: NEGATIVE alpha (resistance DOWN with heat). This is used in thermistors — digital thermometers in your car engine temperature sensor!`
];

stories['LabP10DerivationTransformer.tsx'] = [
  `A power plant generates electricity at 25,000V. To send it across the country, transformers step it up to 500,000V. An ideal transformer conserves power: Power-in = Power-out. No energy is lost ideally.`,
  `P = IV for both coils: I-p V-p = I-s V-s. If voltage goes up, current must go down to keep power the same. This is WHY we use high voltage — low current means low I-squared-R heating losses.`,
  `Rearranging: I-s = (Vp/Vs) x I-p. A step-down transformer (500kV to 230V) has Vp/Vs approx 2174. Current multiplies by 2174. Big voltage drop = big current increase for your home appliances.`,
  `Vs/Vp = Ns/Np = Ip/Is. The voltage ratio equals the turns ratio, which is inverse of the current ratio. The transformer at the pole outside your house steps 11kV down to 230V. Without transformers power distribution would be impossible!`
];

stories['LabP10DerivationTransistorGain.tsx'] = [
  `You re at a concert. The singer whispers into a microphone and it fills the stadium. Inside the mic, a tiny transistor amplifies the signal. IE = IB + IC — emitter current equals base plus collector current.`,
  `Beta = IC/IB. Beta is the current gain — typically 50 to 400. A tiny base current (the whisper) controls a much larger collector current (the stadium speakers). That is amplification!`,
  `Alpha = IC/IE. Alpha is always slightly less than 1 (0.95-0.99). Alpha = Beta/(Beta+1). Most of the emitter current flows to the collector with only a tiny fraction going to the base.`,
  `IC = Beta x IB. A 1 microamp change in base current produces a 200 microamp change in collector current if Beta=200. This is the magic of transistors — your smartphone has BILLIONS amplifying signals billions of times per second.`
];

stories['LabP10DerivationVolumetricExpansion.tsx'] = [
  `On a hot day, the fuel in your car gas tank expands. The change in volume is proportional to original volume and temperature change. Gas station tanks are calibrated to account for this.`,
  `Delta-V = beta x V0 x Delta-T. beta is the coefficient of volumetric expansion. For liquids, beta is much larger than for solids. Gasoline beta approx 9.5e-4 per degree C — it expands visibly on a hot day.`,
  `beta = Delta-V/(V0 x Delta-T). For isotropic solids, beta approx 3 x alpha. Why? Volume = L cubed. If length expands by (1+alpha Delta-T), then volume expands by about 1+3 alpha Delta-T for small changes.`,
  `This beta = 3 alpha relationship is why hot air balloons rise — the air inside expands (big beta for gases), becomes less dense, and floats. Mercury thermometers work because mercury beta is much larger than glass beta!`
];

stories['LabP10DerivationWaveEquation.tsx'] = [
  `You re at the beach watching waves roll in. You time them — one wave crashes every 5 seconds. The distance between wave crests is 8 meters. How fast are they moving? Wave speed = distance over time: v = d/t.`,
  `In one complete wave cycle, a wave travels exactly one wavelength in one time period T. Substituting: v = lambda/T. The faster the waves, the more distance they cover in each cycle.`,
  `Frequency f = 1/T. Higher frequency means more waves per second. The surfer wants long-period waves (low f, long lambda). Light waves have enormous frequencies — 5e14 Hz for green light.`,
  `v = f x lambda. This is the UNIVERSAL wave equation — it works for ALL waves. Sound in air: v = 343 m/s. Light: v = 3e8 m/s. Radio stations tune by changing frequency. But the wave equation works for everything: water, sound, light, seismic — all obey v = f-lambda!`
];

// Process each file
const derivationFiles = glob.sync('src/components/LabP10Derivation*.tsx');

for (const filepath of derivationFiles) {
  const filename = filepath.split(/[/\\]/).pop();
  const storySteps = stories[filename];
  
  if (!storySteps) {
    console.log(`Skipping ${filename} — no story defined`);
    continue;
  }
  
  let content = readFileSync(filepath, 'utf-8');
  
  // Find the steps array
  const startIdx = content.indexOf('const steps = [');
  if (startIdx === -1) {
    console.log(`Could not find steps in ${filename}`);
    continue;
  }
  
  // Find the end of the steps array
  let endIdx = startIdx + 'const steps = ['.length;
  let depth = 1;
  while (depth > 0 && endIdx < content.length) {
    if (content[endIdx] === '[') depth++;
    if (content[endIdx] === ']') depth--;
    endIdx++;
  }
  
  const oldStepsBlock = content.substring(startIdx, endIdx);
  
  // Extract the label and formula from each step in the existing array
  const stepRegex = /{ label:\s*'([^']+)',\s*formula:\s*'([^']+)',\s*detail:\s*'[^']*'\s*}/g;
  const matches = [...oldStepsBlock.matchAll(stepRegex)];
  
  if (matches.length === 0) {
    console.log(`Could not parse steps in ${filename}, trying alternate pattern...`);
    // Try alternate pattern with double quotes for label
    const altRegex = /{ label:\s*"([^"]+)",\s*formula:\s*'([^']+)',\s*detail:\s*'[^']*'\s*}/g;
    const altMatches = [...oldStepsBlock.matchAll(altRegex)];
    if (altMatches.length === 0) {
      console.log(`Could not parse steps in ${filename} with alternate pattern either`);
      continue;
    }
    
    // Build replacement with stories
    const newSteps = altMatches.map((m, i) => {
      const label = m[1];
      const formula = m[2];
      const story = storySteps[i] || '';
      return `    { label: "${label}", formula: '${formula}', detail: '${story.replace(/'/g, "\\'")}' }`;
    }).join(',\n');
    
    const newBlock = `const steps = [\n${newSteps}\n  ]`;
    content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  } else {
    // Build replacement with stories
    const newSteps = matches.map((m, i) => {
      const label = m[1];
      const formula = m[2];
      const story = storySteps[i] || '';
      return `    { label: '${label}', formula: '${formula}', detail: '${story.replace(/'/g, "\\'")}' }`;
    }).join(',\n');
    
    const newBlock = `const steps = [\n${newSteps}\n  ]`;
    content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  }
  
  writeFileSync(filepath, content, 'utf-8');
  console.log(`Updated ${filename}`);
}

console.log('\nAll files updated!');
