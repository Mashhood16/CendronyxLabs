#!/usr/bin/perl
use strict;
use warnings;

# ========== Add theorem modules to labModules.ts ==========
{
  local $/;
  open(my $fh, '<', 'src/data/labModules.ts') or die "Can't open labModules.ts: $!";
  my $content = <$fh>;
  close($fh);

  my $theorem_block = qq(
  // Class 9 Math Theorems
  { id: 'm9_theorem_product_log', classLevel: '9', subject: 'math', title: 'Theorem: Product Law of Logarithms', desc: 'Prove log_b(mn) = log_b m + log_b n with an interactive sound-engineering simulation.', built: true, bg: 'from-teal-500 to-emerald-600' },
  { id: 'm9_theorem_quotient_log', classLevel: '9', subject: 'math', title: 'Theorem: Quotient Law of Logarithms', desc: 'Prove log_b(m/n) = log_b m - log_b n with an interactive chemistry dilution simulator.', built: true, bg: 'from-purple-500 to-violet-600' },
  { id: 'm9_theorem_power_log', classLevel: '9', subject: 'math', title: 'Theorem: Power Law of Logarithms', desc: 'Prove log_b(m^n) = n log_b m with an interactive investment growth calculator.', built: true, bg: 'from-rose-500 to-pink-600' },
  { id: 'm9_theorem_change_base', classLevel: '9', subject: 'math', title: 'Theorem: Change of Base Law', desc: 'Prove log_a m = log_b m * log_a b and convert between any bases.', built: true, bg: 'from-cyan-500 to-blue-600' },
  { id: 'm9_theorem_union_assoc', classLevel: '9', subject: 'math', title: 'Theorem: Associative Property of Union', desc: 'Prove (A U B) U C = A U (B U C) with interactive Venn diagrams.', built: true, bg: 'from-indigo-500 to-indigo-600' },
  { id: 'm9_theorem_intersection_assoc', classLevel: '9', subject: 'math', title: 'Theorem: Associative Property of Intersection', desc: 'Prove (A intersect B) intersect C = A intersect (B intersect C).', built: true, bg: 'from-indigo-500 to-violet-600' },
  { id: 'm9_theorem_distributive_union', classLevel: '9', subject: 'math', title: 'Theorem: Distributive Union over Intersection', desc: 'Prove A U (B intersect C) = (A U B) intersect (A U C).', built: true, bg: 'from-sky-500 to-blue-600' },
  { id: 'm9_theorem_distributive_intersection', classLevel: '9', subject: 'math', title: 'Theorem: Distributive Intersection over Union', desc: 'Prove A intersect (B U C) = (A intersect B) U (A intersect C).', built: true, bg: 'from-sky-500 to-indigo-600' },
  { id: 'm9_theorem_quotient_identity', classLevel: '9', subject: 'math', title: 'Theorem: Quotient Trigonometric Identities', desc: 'Prove tan(theta) = sin(theta)/cos(theta) using right triangle geometry.', built: true, bg: 'from-yellow-500 to-amber-600' },
  { id: 'm9_theorem_pythagorean_identity', classLevel: '9', subject: 'math', title: 'Theorem: Pythagorean Trigonometric Identity', desc: 'Prove sin^2(theta) + cos^2(theta) = 1 with a unit circle simulator.', built: true, bg: 'from-emerald-500 to-teal-600' },
  { id: 'm9_theorem_distance_formula', classLevel: '9', subject: 'math', title: 'Theorem: Distance Formula', desc: 'Prove d = sqrt((x2-x1)^2 + (y2-y1)^2) using coordinate geometry.', built: true, bg: 'from-violet-500 to-purple-600' },
  { id: 'm9_theorem_slope_intercept', classLevel: '9', subject: 'math', title: 'Theorem: Slope-Intercept Form', desc: 'Prove y = mx + c derived from slope definition with interactive graphing.', built: true, bg: 'from-amber-500 to-orange-600' },
  { id: 'm9_theorem_point_slope', classLevel: '9', subject: 'math', title: 'Theorem: Point-Slope Form', desc: 'Prove y - y1 = m(x - x1) from the slope formula.', built: true, bg: 'from-blue-500 to-indigo-600' },
  { id: 'm9_theorem_two_point', classLevel: '9', subject: 'math', title: 'Theorem: Two-Point Form', desc: 'Prove the equation of a line through two given points.', built: true, bg: 'from-pink-500 to-rose-600' },
  { id: 'm9_theorem_two_intercept', classLevel: '9', subject: 'math', title: 'Theorem: Two-Intercept Form', desc: 'Prove x/a + y/b = 1 using x-intercept and y-intercept.', built: true, bg: 'from-indigo-500 to-purple-600' },
  { id: 'm9_theorem_normal_form', classLevel: '9', subject: 'math', title: 'Theorem: Normal Form of a Line', desc: 'Prove x cos(alpha) + y sin(alpha) = p for perpendicular distance.', built: true, bg: 'from-orange-500 to-red-600' },
  { id: 'm9_theorem_angle_between_lines', classLevel: '9', subject: 'math', title: 'Theorem: Angle Between Two Lines', desc: 'Prove tan(theta) = |(m2-m1)/(1+m1*m2)| for intersecting lines.', built: true, bg: 'from-rose-500 to-red-600' },
);

  # Insert after the Class 9 Mathematics section (after m9_9 line)
  $content =~ s/(  \{ id: 'm9_9'.*\n)/$1$theorem_block/s
    or die "Could not find insertion point in labModules.ts!";

  open($fh, '>', 'src/data/labModules.ts') or die "Can't write labModules.ts: $!";
  print $fh $content;
  close($fh);
  print "Successfully added theorem modules to labModules.ts\n";
}

# ========== Add LabM9Theorems import and route to labRoutes.ts ==========
{
  local $/;
  open(my $fh, '<', 'src/routes/labRoutes.ts') or die "Can't open labRoutes.ts: $!";
  my $content = <$fh>;
  close($fh);

  # Add the lazy import before the closing brace of labComponents
  $content =~ s/(  \/\/ Class 12 English\n  LabE12NounsPronouns)/  \/\/ Class 9 Math Theorems\n  LabM9Theorems: lazy\(\(\) => import\('\.\.\/components\/LabM9Theorems'\)\),\n\n  $1/s
    or die "Could not find insertion point for LabM9Theorems import!";

  # Add route mappings for all 18 theorems
  my $route_block = qq(
  // Class 9 Math Theorems
  'm9_theorem_product_log': 'LabM9Theorems',
  'm9_theorem_quotient_log': 'LabM9Theorems',
  'm9_theorem_power_log': 'LabM9Theorems',
  'm9_theorem_change_base': 'LabM9Theorems',
  'm9_theorem_union_assoc': 'LabM9Theorems',
  'm9_theorem_intersection_assoc': 'LabM9Theorems',
  'm9_theorem_distributive_union': 'LabM9Theorems',
  'm9_theorem_distributive_intersection': 'LabM9Theorems',
  'm9_theorem_quotient_identity': 'LabM9Theorems',
  'm9_theorem_pythagorean_identity': 'LabM9Theorems',
  'm9_theorem_distance_formula': 'LabM9Theorems',
  'm9_theorem_slope_intercept': 'LabM9Theorems',
  'm9_theorem_point_slope': 'LabM9Theorems',
  'm9_theorem_two_point': 'LabM9Theorems',
  'm9_theorem_two_intercept': 'LabM9Theorems',
  'm9_theorem_normal_form': 'LabM9Theorems',
  'm9_theorem_angle_between_lines': 'LabM9Theorems',
);

  # Insert after the Class 9 Mathematics route mappings section
  $content =~ s/(  \/\/ Class 9 Mathematics\n\n)/$1$route_block/s
    or die "Could not find insertion point for theorem routes!";

  open($fh, '>', 'src/routes/labRoutes.ts') or die "Can't write labRoutes.ts: $!";
  print $fh $content;
  close($fh);
  print "Successfully added LabM9Theorems route mappings to labRoutes.ts\n";
}

print "\nAll done!\n";
