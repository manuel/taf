function taf_init() {
    /***** Types *****/
    function is_instance(object, type) { return object.constructor === type; }
    function assert_type(object, type) { assert(is_instance(object, type)); }
    function t_cons(car, cdr) { this.car = car; this.cdr = cdr; }
    function t_symbol(jsstr) { this.jsstr = jsstr; }
    function t_nil() {}
    function symbol(jsstr) { return new t_symbol(jsstr); }
    function cons(car, cdr) { return new t_cons(car, cdr); }
    function car(cons) { assert_type(cons, t_cons); return cons.car; }
    function cdr(cons) { assert_type(cons, t_cons); return cons.cdr; }
    var nil = new t_nil();
    function equals(a, b) { return a.equals_impl(a, b); }
    t_cons.prototype.equals_impl = function(cons, other) {
        if (is_instance(other, t_cons)) return equals(cons.car, other.car) && equals(cons.cdr, other.cdr);
        else return false; };
    t_symbol.prototype.equals_impl = function(symbol, other) {
        if (is_instance(other, t_symbol)) return symbol.jsstr === other.jsstr;
        else return false; };
    t_nil.prototype.equals_impl = function(nil, other) { return nil === other; };
    /***** Built-in Symbols *****/
    var sym_begin = symbol("begin");
    /***** Parser *****/
    function parse(string) {
        var res = p_program(ps(string));
	if (res.remaining.index === string.length) return cons(sym_begin, array_to_list(res.ast));
        else fail("parse error at " + res.remaining.index); }
    var p_expression = function(input) { return p_expression(input); }; // forward decl.
    var p_symbol_char = choice(range("a", "z"), "-");
    var p_symbol = action(join_action(repeat1(p_symbol_char), ""), symbol);
    var p_compound = action(wsequence("(", repeat0(p_expression), ")"),
                            function(ast) { return array_to_list(ast[1]); });
    var p_expression = whitespace(choice(p_symbol, p_compound));
    var p_program = whitespace(repeat0(p_expression));
    /***** Utilities *****/
    function assert(b) { if (!b) fail("Assertion failed!"); }
    function fail(msg) { throw msg; }
    function array_to_list(array, end) {
	var c = end ? end : nil; for (var i = array.length; i > 0; i--) c = cons(array[i - 1], c); return c; }
    function list() { return array_to_list(Array.prototype.slice.call(arguments, 0)); }
    /***** API *****/
    return {
        "assert": assert,
        "car": car,
        "cdr": cdr,
        "cons": cons,
        "equals": equals,
        "list": list,
        "symbol": symbol,
        "nil": nil,
        "parse": parse,
    };
}
