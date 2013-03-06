var taf = taf_init();

function test_empty_program(string) {
    var form = taf.parse(string);
    taf.assert(taf.equals(form, taf.list(taf.symbol("begin"))));
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
    taf.assert(taf.equals(form, taf.list(taf.symbol("begin"),
                                         taf.list(taf.symbol("foo"),
                                                  taf.list(taf.symbol("bar"))))));
}
test_foobar_program("( foo   ( bar))");
test_foobar_program("(foo \n (bar\t) )");
test_foobar_program("\t (\tfoo  \n \t(bar\t) )");
test_foobar_program("\t (foo\n(bar\t)\t)");
test_foobar_program(" (   foo (bar))");
test_foobar_program("  \t \n(\n\rfoo (bar ) )");
test_foobar_program("  (foo (bar))");
