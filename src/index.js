const expand = require("./expand.js");

const globals = require("./globals.js");
Object.assign(global, globals);

console.log(expand(`#include <stdio.h>

macro {
    match {
        unless $(condition)
    }
    template {
        if(!$(condition))
    }
}

#include <stdlib.h>

macro {
    match {
        $(args) -> $ret $\{body}
    }
    eval {
        env.lambda = gensym();
    }
    template {
        $(lambda)
    }
    toplevel {
        $(ret) $(lambda) $(args) $(body)
    }
}

#include <string.h>

macro {
    match {
        for_each($item, $collection) $\{body}
    }
    template {
        {
            size_t index;
            typeof($collection [0]) $(item);
            for(index = 0, item = $collection [0];
                index < sizeof($collection) / sizeof($collection [0]);
                index++) $\{body}
        }
    }
}

int main(void) {
    char ch = '\\n';
    printf("%c", ch);
    ((int x, int y) -> int { return x + y; })(2, 3);
    unless(true) {
        ((int x, int y) -> int { return x + y; })(4, 5);
    }

    char name = "hyeonseok";

    for_each(ch, name) {
        printf("%c", ch);
    }

    for(int i = 0; i < 10; i++) { ((int x, int y) -> int { return x + y; })(2, 3); }
    return 0;
}`));
