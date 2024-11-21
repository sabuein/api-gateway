import { test } from "node:test";
import { equal } from "node:assert";

// A simple function to test
const sum = (a, b) => a + b;

// Writing a test for the sum function
test("sum", () => {
    equal(sum(1, 1), 2); // Should return true if 1 + 1 equals 2
});