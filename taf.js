function make_taf() {
    /***** Types *****/
    function t_cons(car, cdr) { this.car = car; this.cdr = cdr; }
    function t_identifier(jsstr) { this.jsstr = jsstr; }
    function t_nil() {}
    function make_cons(car, cdr) { return new t_cons(car, cdr); }
    function make_identifier(jsstr) { return new t_identifier(jsstr); }
    var nil = new t_nil();
    /***** Built-in Identifiers *****/
    var i_begin = make_identifier("begin");
    /***** Parser *****/
    function parse(string) {
        var res = p_program(ps(string));
	if (res.remaining.index === string.length) return make_cons(i_begin, array_to_list(res.ast));
        else fail("parse error at " + res.remaining.index); }
    var p_expression = function(input) { return p_expression(input); }; // forward decl.
    var p_identifier_char = choice(range("a", "z"), "-");
    var p_identifier = action(join_action(repeat1(p_identifier_char), ""), make_identifier);
    var p_compound = action(wsequence("(", repeat0(p_expression), ")"),
                            function(ast) { return array_to_list(ast[1]); });
    var p_expression = whitespace(choice(p_identifier, p_compound));
    var p_program = whitespace(repeat0(p_expression));
    /***** Utilities *****/
    function fail(msg) { throw msg; }
    function array_to_list(array, end) {
	var c = end ? end : nil; for (var i = array.length; i > 0; i--) c = make_cons(array[i - 1], c); return c; }
    /***** API *****/
    return {
        "parse": parse,
        "nil": nil,
    };
}

var taf = make_taf();
function test_empty_program(string) {
    var form = taf.parse(string);
    assert(form.car.jsstr === "begin");
    assert(form.cdr === taf.nil);
}
test_empty_program("");
test_empty_program("   ");
test_empty_program("\t   ");
test_empty_program("\t \n  ");
test_empty_program("  \t \n\n  ");
test_empty_program("  \t \n");
test_empty_program("  \t \r\n");
function test_foo_program(string) {
    var form = taf.parse(string);
    assert(form.car.jsstr === "begin");
    assert(form.cdr.car.car.jsstr === "foo");
    assert(form.cdr.car.cdr === taf.nil);
}
test_foo_program("( foo)");
test_foo_program("(foo )");
test_foo_program("\t (\tfoo)");
test_foo_program("\t (foo\n)");
test_foo_program(" (   foo)");
test_foo_program("  \t \n(\n\rfoo)");
test_foo_program("  (foo)");

function assert(b) { if (!b) throw "Assertion failed!"; }
