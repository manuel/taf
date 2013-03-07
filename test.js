var taf = taf_init();

taf.assert(taf.equals(taf.nil, taf.nil));
taf.assert(!taf.equals(taf.nil, taf.unit));
taf.assert(!taf.equals(taf.unit, taf.nil));
taf.assert(taf.equals(taf.unit, taf.unit));
taf.assert(taf.equals(taf.make_cons(taf.unit, taf.nil), taf.make_cons(taf.unit, taf.nil)));
taf.assert(!taf.equals(taf.make_cons(taf.nil, taf.unit), taf.make_cons(taf.unit, taf.nil)));
taf.assert(taf.equals(taf.make_list(taf.unit, taf.unit), taf.make_list(taf.unit, taf.unit)));
taf.assert(!taf.equals(taf.make_list(taf.unit, taf.unit, taf.nil), taf.make_list(taf.unit, taf.unit)));

function test_empty_program(string) {
    var form = taf.parse(string);
    taf.assert(taf.equals(form, taf.make_list(taf.make_symbol("begin"))));
}
test_empty_program("");
test_empty_program("   ");
test_empty_program("\t   ");
test_empty_program("\t \n  ");
test_empty_program("  \t \n\n  ");
test_empty_program("  \t \n");
test_empty_program("  \t \r\n");

function test_foobar_program(string) {
    var form = taf.parse(string);
    taf.assert(taf.equals(form, taf.make_list(taf.make_symbol("begin"),
                                              taf.make_list(taf.make_symbol("foo"),
                                                            taf.make_list(taf.make_symbol("bar"))))));
}
test_foobar_program("( foo   ( bar))");
test_foobar_program("(foo \n (bar\t) )");
test_foobar_program("\t (\tfoo  \n \t(bar\t) )");
test_foobar_program("\t (foo\n(bar\t)\t)");
test_foobar_program(" (   foo (bar))");
test_foobar_program("  \t \n(\n\rfoo (bar ) )");
test_foobar_program("  (foo (bar))");

taf.assert(taf.equals(taf.evaluate(taf.parse("(begin)")), taf.unit));
taf.assert(taf.equals(taf.evaluate(taf.parse("(begin (begin)) (begin)")), taf.unit));
taf.assert(taf.equals(taf.evaluate(taf.parse("(begin) (begin (begin (begin)))")), taf.unit));
