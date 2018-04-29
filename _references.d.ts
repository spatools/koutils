interface Function {
    result?: any; // Memoization Pattern
}

interface MSApp {
    execUnsafeLocalFunction<T>(fn: () => T): T;
}

declare const Globalize: {
    format(value: string, format: string): string;
};

declare const Symbol: {
    (identifier?: string): string;
};