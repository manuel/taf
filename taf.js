function taf_init() {
    /***** Types *****/
    function type_of(object) { return object.constructor; }
    function is_instance(object, type) { return type_of(object) === type; }
    function assert_type(object, type) { assert(is_instance(object, type)); return object; }
    function t_cons(car, cdr) { this.car = car; this.cdr = cdr; }
    function t_symbol(jsstr) { this.jsstr = jsstr; }
    function t_nil() {}
    function t_unit() {}
    function car(cons) { assert_type(cons, t_cons); return cons.car; }
    function cdr(cons) { assert_type(cons, t_cons); return cons.cdr; }
    function make_cons(car, cdr) { return new t_cons(car, cdr); }
    function make_symbol(jsstr) { return new t_symbol(jsstr); }
    function symbol_name(symbol) { assert_type(symbol, t_symbol); return symbol.jsstr; }
    var nil = new t_nil();
    var unit = new t_unit();
    function equals(a, b) { return a.equals_impl(a, b); }
    t_cons.prototype.equals_impl = function(cons, other) {
        if (is_instance(other, t_cons)) return equals(cons.car, other.car) && equals(cons.cdr, other.cdr);
        else return false; };
    t_symbol.prototype.equals_impl = function(symbol, other) {
        if (is_instance(other, t_symbol)) return symbol_name(symbol) === symbol_name(other);
        else return false; };
    t_nil.prototype.equals_impl = function(nil, other) { return nil === other; };
    t_unit.prototype.equals_impl = function(unit, other) { return unit === other; };
    /***** Built-in Symbols *****/
    var s_begin = make_symbol("begin");
    /***** Parser *****/
    function parse(string) {
        var res = p_program(ps(string));
	if (res.remaining.index === string.length) return make_cons(s_begin, array_to_list(res.ast));
        else fail("parse error at " + res.remaining.index); }
    var p_expression = function(input) { return p_expression(input); }; // forward decl.
    var p_symbol_char = choice(range("a", "z"), "-");
    var p_symbol = action(join_action(repeat1(p_symbol_char), ""), make_symbol);
    var p_compound = action(wsequence("(", repeat0(p_expression), ")"),
                            function(ast) { return array_to_list(ast[1]); });
    var p_expression = whitespace(choice(p_symbol, p_compound));
    var p_program = whitespace(repeat0(p_expression));
    /***** Interpretation *****/
    function interpret(interpreter, expression) {
        if (is_instance(expression, t_cons)) return interpret_cons(interpreter, expression);
        else return interpreter.interpret_self_evaluating_object(interpreter, expression); }
    function interpret_cons(interpreter, expression) {
        var operator = car(expression);
        if (is_instance(operator, t_symbol)) {
            var special = lookup_special(interpreter, operator);
            if (special !== undefined) return special(interpreter, cdr(expression));
            else fail("Illegal operator: " + operator); }
        else fail("Illegal form: " + expression); }
    // Special forms
    function special_name(symbol) { return "interpret_special_" + symbol_name(symbol); }
    function lookup_special(interpreter, symbol) { return interpreter[special_name(symbol)]; }
    function define_special(interpreter_type, symbol, fun) {
        interpreter_type.prototype[special_name(symbol)] = fun; }
    /***** Evaluator *****/
    function evaluate(expression) { return interpret(new t_evaluator(), expression); }
    function t_evaluator() {}
    t_evaluator.prototype.interpret_self_evaluating_object = function(evaluator, object) { return object; };
    define_special(t_evaluator, s_begin, function self(evaluator, body) {
        if (equals(body, nil)) return unit;
        else { var res = interpret(evaluator, car(body));
               if (cdr(body) === nil) return res; else return self(evaluator, cdr(body)); } });
    /***** Utilities *****/
    function assert(b) { if (!b) fail("Assertion failed!"); }
    function fail(msg) { throw msg; }
    function array_to_list(array) {
        var c = nil; for (var i = array.length; i > 0; i--) c = make_cons(array[i - 1], c); return c; }
    function make_list() { return array_to_list(Array.prototype.slice.call(arguments, 0)); }
    /***** API *****/
    return {
        "assert": assert,
        "car": car,
        "cdr": cdr,
        "equals": equals,
        "evaluate": evaluate,
        "make_cons": make_cons,
        "make_list": make_list,
        "make_symbol": make_symbol,
        "nil": nil,
        "parse": parse,
        "unit": unit,
    };
}
