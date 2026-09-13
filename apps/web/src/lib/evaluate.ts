export type EvalResult = { ok: true; value: number } | { ok: false; error: string };

class ParseError extends Error {}

class Parser {
  private i = 0;
  private readonly src: string;

  constructor(src: string) {
    this.src = src;
  }

  parse(): number {
    this.skip();
    const value = this.expression();
    this.skip();
    if (this.i < this.src.length) {
      throw new ParseError("Unexpected characters after the expression.");
    }
    return value;
  }

  private expression(): number {
    let value = this.term();
    for (;;) {
      this.skip();
      if (this.eat("+")) {
        value += this.term();
      } else if (this.eat("-")) {
        value -= this.term();
      } else {
        return value;
      }
    }
  }

  private term(): number {
    let value = this.unary();
    for (;;) {
      this.skip();
      if (this.eat("*")) {
        value *= this.unary();
      } else if (this.eat("/")) {
        const denom = this.unary();
        if (denom === 0) {
          throw new ParseError("Division by zero.");
        }
        value /= denom;
      } else {
        return value;
      }
    }
  }

  private unary(): number {
    this.skip();
    if (this.eat("-")) {
      return -this.unary();
    }
    if (this.eat("+")) {
      return this.unary();
    }
    return this.primary();
  }

  private primary(): number {
    this.skip();
    if (this.eat("(")) {
      const value = this.expression();
      this.skip();
      if (!this.eat(")")) {
        throw new ParseError("Missing closing parenthesis.");
      }
      return value;
    }
    return this.number();
  }

  private number(): number {
    this.skip();
    const start = this.i;
    while (this.i < this.src.length && isDigit(this.src[this.i])) {
      this.i += 1;
    }
    if (this.src[this.i] === ".") {
      this.i += 1;
      while (this.i < this.src.length && isDigit(this.src[this.i])) {
        this.i += 1;
      }
    }
    const raw = this.src.slice(start, this.i);
    if (!raw || raw === ".") {
      throw new ParseError("Invalid expression.");
    }
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      throw new ParseError("Invalid number.");
    }
    return value;
  }

  private eat(ch: string): boolean {
    this.skip();
    if (this.src[this.i] === ch) {
      this.i += 1;
      return true;
    }
    return false;
  }

  private skip(): void {
    while (this.src[this.i] === " " || this.src[this.i] === "\t" || this.src[this.i] === "\n") {
      this.i += 1;
    }
  }
}

function isDigit(ch: string | undefined): boolean {
  return ch !== undefined && ch >= "0" && ch <= "9";
}

export function evaluate(input: string): EvalResult {
  const source = input.trim();
  if (!source) {
    return { ok: false, error: "Enter an expression." };
  }
  try {
    const value = new Parser(source).parse();
    if (!Number.isFinite(value)) {
      return { ok: false, error: "Result is not a finite number." };
    }
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid expression." };
  }
}
