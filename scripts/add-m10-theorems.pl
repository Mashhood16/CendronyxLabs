#!/usr/bin/perl
use strict;
use warnings;

# === 1. Add module entries to labModules.ts ===

my $module_entries = <<'MODULES';
  // Class 10 Math Theorems
  { id: 'm10_theorem_quadratic_formula', classLevel: '10', subject: 'math', title: 'Theorem: Quadratic Formula', desc: 'Derive x = [−b ± √(b²−4ac)]/2a with an interactive parabolic arch simulation.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'm10_theorem_vector_diff', classLevel: '10', subject: 'math', title: 'Theorem: Vector from Position Vectors', desc: 'Prove AB = b − a with an interactive drone tracking simulation.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'm10_theorem_law_cosines', classLevel: '10', subject: 'math', title: 'Theorem: Law of Cosines', desc: 'Prove a² = b² + c² − 2bc cos α with an interactive land surveyor simulation.', built: true, bg: 'from-rose-500 to-red-600' },
  { id: 'm10_theorem_law_sines', classLevel: '10', subject: 'math', title: 'Theorem: Law of Sines', desc: 'Prove a/sin α = b/sin β = c/sin γ with an interactive mountain expedition simulation.', built: true, bg: 'from-sky-500 to-cyan-600' },
  { id: 'm10_theorem_law_tangents', classLevel: '10', subject: 'math', title: 'Theorem: Law of Tangents', desc: 'Prove (a+b)/(a−b) = tan[(α+β)/2]/tan[(α−β)/2] with interactive navigation.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'm10_theorem_half_angle_cos', classLevel: '10', subject: 'math', title: 'Theorem: Half Angle Cosine Formula', desc: 'Prove cos(α/2) = √[S(S−a)/bc] using Law of Cosines and double-angle identity.', built: true, bg: 'from-emerald-500 to-green-600' },
  { id: 'm10_theorem_half_angle_sin', classLevel: '10', subject: 'math', title: 'Theorem: Half Angle Sine Formula', desc: 'Prove sin(α/2) = √[(S−b)(S−c)/bc] and connect to Heros formula.', built: true, bg: 'from-emerald-600 to-teal-700' },
  { id: 'm10_theorem_area_sas', classLevel: '10', subject: 'math', title: 'Theorem: Area of Triangle (SAS)', desc: 'Prove Δ = ½ bc sin α with an interactive surveyor plot simulation.', built: true, bg: 'from-violet-500 to-purple-700' },
  { id: 'm10_theorem_area_aas', classLevel: '10', subject: 'math', title: 'Theorem: Area of Triangle (AAS)', desc: 'Prove Δ = ½ a² sin β sin γ / sin α for mountain profile measurements.', built: true, bg: 'from-violet-600 to-fuchsia-700' },
  { id: 'm10_theorem_heros', classLevel: '10', subject: 'math', title: "Theorem: Hero's Formula (SSS)", desc: 'Prove Δ = √[S(S−a)(S−b)(S−c)] with an interactive triangular garden simulation.', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'm10_theorem_circum_radius', classLevel: '10', subject: 'math', title: 'Theorem: Circum-Radius', desc: 'Prove R = abc/(4Δ) with an interactive circumcircle construction.', built: true, bg: 'from-orange-500 to-amber-600' },
  { id: 'm10_theorem_in_radius', classLevel: '10', subject: 'math', title: 'Theorem: In-Radius', desc: 'Prove r = Δ/S with an interactive incircle construction.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'm10_theorem_ex_radius', classLevel: '10', subject: 'math', title: 'Theorem: Ex-Radius', desc: 'Prove r₁ = Δ/(S−a) with an interactive excircle demonstration.', built: true, bg: 'from-teal-600 to-cyan-700' },
  { id: 'm10_theorem_three_point_circle', classLevel: '10', subject: 'math', title: 'Theorem 9.1: Three Points Determine a Circle', desc: 'Prove one and only one circle passes through three non-collinear points.', built: true, bg: 'from-indigo-400 to-indigo-600' },
  { id: 'm10_theorem_centre_bisects', classLevel: '10', subject: 'math', title: 'Theorem 9.2: Centre to Midpoint ⟂ Chord', desc: 'Prove the line from centre to the midpoint of a chord is perpendicular.', built: true, bg: 'from-indigo-500 to-indigo-700' },
  { id: 'm10_theorem_perp_bisects', classLevel: '10', subject: 'math', title: 'Theorem 9.3: Perpendicular from Centre Bisects Chord', desc: 'Prove the perpendicular from centre to a chord bisects it.', built: true, bg: 'from-indigo-500 to-blue-700' },
  { id: 'm10_theorem_equal_chords_equal_dist', classLevel: '10', subject: 'math', title: 'Theorem 9.4: Equal Chords Equidistant', desc: 'Prove equal chords are equidistant from the centre.', built: true, bg: 'from-indigo-500 to-purple-700' },
  { id: 'm10_theorem_equidistant_chords', classLevel: '10', subject: 'math', title: 'Theorem 9.5: Equidistant Chords Congruent', desc: 'Prove chords equidistant from the centre are equal in length.', built: true, bg: 'from-indigo-500 to-cyan-700' },
  { id: 'm10_theorem_congruent_arcs', classLevel: '10', subject: 'math', title: 'Theorem 9.6: Congruent Arcs → Equal Chords', desc: 'Prove congruent arcs subtend equal chords.', built: true, bg: 'from-indigo-500 to-teal-700' },
  { id: 'm10_theorem_equal_chords_arcs', classLevel: '10', subject: 'math', title: 'Theorem 9.7: Equal Chords → Congruent Arcs', desc: 'Prove equal chords subtend congruent arcs.', built: true, bg: 'from-indigo-500 to-rose-700' },
  { id: 'm10_theorem_equal_chords_angles', classLevel: '10', subject: 'math', title: 'Theorem 9.8: Equal Chords → Equal Angles', desc: 'Prove equal chords subtend equal angles at the centre.', built: true, bg: 'from-indigo-500 to-amber-700' },
  { id: 'm10_theorem_equal_angles_chords', classLevel: '10', subject: 'math', title: 'Theorem 9.9: Equal Angles → Equal Chords', desc: 'Prove equal central angles subtend equal chords.', built: true, bg: 'from-indigo-500 to-orange-700' },
  { id: 'm10_theorem_perp_radius_tangent', classLevel: '10', subject: 'math', title: 'Theorem 10.1: Perp to Radius = Tangent', desc: 'Prove a line perpendicular to a radius at its endpoint is a tangent.', built: true, bg: 'from-purple-500 to-violet-600' },
  { id: 'm10_theorem_tangent_perp_radius', classLevel: '10', subject: 'math', title: 'Theorem 10.2: Tangent ⟂ Radius', desc: 'Prove the tangent is perpendicular to the radius at point of contact.', built: true, bg: 'from-purple-500 to-pink-600' },
  { id: 'm10_theorem_equal_tangents', classLevel: '10', subject: 'math', title: 'Theorem 10.3: Two Tangents Equal', desc: 'Prove two tangents from an external point are equal in length.', built: true, bg: 'from-purple-500 to-indigo-600' },
  { id: 'm10_theorem_external_touching', classLevel: '10', subject: 'math', title: 'Theorem 10.4: External Touching Circles', desc: 'Prove d = r₁ + r₂ when circles touch externally.', built: true, bg: 'from-purple-500 to-rose-600' },
  { id: 'm10_theorem_internal_touching', classLevel: '10', subject: 'math', title: 'Theorem 10.5: Internal Touching Circles', desc: 'Prove d = |r₁ − r₂| when circles touch internally.', built: true, bg: 'from-purple-500 to-amber-600' },
  { id: 'm10_theorem_alternate_segment', classLevel: '10', subject: 'math', title: 'Theorem 10.6: Alternate Segment Theorem', desc: 'Prove angle between tangent and chord equals angle in alternate segment.', built: true, bg: 'from-pink-500 to-rose-600' },
  { id: 'm10_theorem_central_angle', classLevel: '10', subject: 'math', title: 'Theorem 10.7: Central Angle Theorem', desc: 'Prove the central angle is double the inscribed angle.', built: true, bg: 'from-cyan-500 to-sky-600' },
  { id: 'm10_theorem_same_segment', classLevel: '10', subject: 'math', title: 'Theorem 10.8: Same Segment Angles Equal', desc: 'Prove all angles subtended by a chord in the same segment are equal.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'm10_theorem_semicircle', classLevel: '10', subject: 'math', title: 'Theorem 10.9: Angle in Semicircle', desc: 'Prove the angle in a semicircle is always a right angle (90°).', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'm10_theorem_major_segment', classLevel: '10', subject: 'math', title: 'Theorem 10.10: Major Segment Angle < 90°', desc: 'Prove angles in a major segment are acute.', built: true, bg: 'from-cyan-500 to-teal-600' },
  { id: 'm10_theorem_minor_segment', classLevel: '10', subject: 'math', title: 'Theorem 10.11: Minor Segment Angle > 90°', desc: 'Prove angles in a minor segment are obtuse.', built: true, bg: 'from-cyan-500 to-violet-600' },
  { id: 'm10_theorem_cyclic_quad', classLevel: '10', subject: 'math', title: 'Theorem 10.12: Cyclic Quadrilateral', desc: 'Prove opposite angles of a cyclic quadrilateral sum to 180°.', built: true, bg: 'from-cyan-500 to-emerald-600' },
MODULES

my $lab_modules_file = 'src/data/labModules.ts';
my $content = do { local (@ARGV, $/) = $lab_modules_file; <> };
$content =~ s/(\n  \/\/ Class 9 Math Theorems)/$module_entries$1/ or die "Could not find insertion point in labModules.ts!";
open(my $fh, '>', $lab_modules_file) or die "Cannot write $lab_modules_file: $!";
print $fh $content;
close $fh;
print "✓ Added 34 theorem modules to labModules.ts\n";

# === 2. Add route mappings to labRoutes.ts ===

my @route_ids = (
  'm10_theorem_quadratic_formula',
  'm10_theorem_vector_diff',
  'm10_theorem_law_cosines',
  'm10_theorem_law_sines',
  'm10_theorem_law_tangents',
  'm10_theorem_half_angle_cos',
  'm10_theorem_half_angle_sin',
  'm10_theorem_area_sas',
  'm10_theorem_area_aas',
  'm10_theorem_heros',
  'm10_theorem_circum_radius',
  'm10_theorem_in_radius',
  'm10_theorem_ex_radius',
  'm10_theorem_three_point_circle',
  'm10_theorem_centre_bisects',
  'm10_theorem_perp_bisects',
  'm10_theorem_equal_chords_equal_dist',
  'm10_theorem_equidistant_chords',
  'm10_theorem_congruent_arcs',
  'm10_theorem_equal_chords_arcs',
  'm10_theorem_equal_chords_angles',
  'm10_theorem_equal_angles_chords',
  'm10_theorem_perp_radius_tangent',
  'm10_theorem_tangent_perp_radius',
  'm10_theorem_equal_tangents',
  'm10_theorem_external_touching',
  'm10_theorem_internal_touching',
  'm10_theorem_alternate_segment',
  'm10_theorem_central_angle',
  'm10_theorem_same_segment',
  'm10_theorem_semicircle',
  'm10_theorem_major_segment',
  'm10_theorem_minor_segment',
  'm10_theorem_cyclic_quad',
);

my $route_file = 'src/routes/labRoutes.ts';
my $content2 = do { local (@ARGV, $/) = $route_file; <> };

# Add lazy import
$content2 =~ s/(\n  LabM9Theorems: lazy\(\) => import\('..\/components\/LabM9Theorems'\)\,)/$1\n  LabM10Theorems: lazy(() => import('..\/components\/LabM10Theorems')),/ or die "Could not add lazy import!";
print "✓ Added LabM10Theorems lazy import\n";

# Add route mappings after last Class 9 theorem mapping
my $route_mappings = join("\n", map { "  '$_': 'LabM10Theorems'," } @route_ids);
$content2 =~ s/(\n  'm9_theorem_angle_between_lines': 'LabM9Theorems',)/$1\n\n  \/\/ Class 10 Math Theorems\n$route_mappings/ or die "Could not add route mappings!";
print "✓ Added 34 theorem route mappings\n";

open(my $fh2, '>', $route_file) or die "Cannot write $route_file: $!";
print $fh2 $content2;
close $fh2;

print "\nAll done!\n";
