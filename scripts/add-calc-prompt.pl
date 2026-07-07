use strict;
use warnings;

my $prompt = qq(\n          <div className="text-center">\n            <p className="text-[11px] text-slate-400 dark:text-[#71717a]">\n              Need to crunch numbers?{' '}\n              <span className="font-semibold text-indigo-500 dark:text-indigo-400">\n                Calculator\n              </span>\n              {' '}is in the header\n            </p>\n          </div>);

# Process LabP10Derivation files (inline format)
for my $file (glob 'src/components/LabP10Derivation*.tsx') {
    local $/;
    open my $fh, '<', $file or die "Can't open $file: $!";
    my $content = <$fh>;
    close $fh;
    
    my $changed = 0;
    if ($content =~ s|</div>}\n          </div>\n        </div>|</div>}\n          </div>${prompt}\n        </div>|g) {
        $changed = 1;
    }
    
    if ($changed) {
        open $fh, '>', $file or die "Can't write $file: $!";
        print $fh $content;
        close $fh;
        print "Fixed: $file\n";
    } else {
        print "NO MATCH: $file\n";
    }
}

# Process LabP9Derivation individual files (multi-line format) - exclude LabP9Derivations.tsx
for my $file (glob 'src/components/LabP9Derivation*.tsx') {
    next if $file =~ /LabP9Derivations\.tsx$/;
    local $/;
    open my $fh, '<', $file or die "Can't open $file: $!";
    my $content = <$fh>;
    close $fh;
    
    my $changed = 0;
    if ($content =~ s|</div>\n            \)}\n          </div>\n        </div>|</div>\n            )}\n          </div>${prompt}\n        </div>|g) {
        $changed = 1;
    }
    
    if ($changed) {
        open $fh, '>', $file or die "Can't write $file: $!";
        print $fh $content;
        close $fh;
        print "Fixed: $file\n";
    } else {
        print "NO MATCH: $file\n";
    }
}

print "\nDone!\n";
