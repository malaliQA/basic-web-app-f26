import QueryProcessor from "../../utils/QueryProcessor";
import '@testing-library/jest-dom'

describe("QueryProcessor", () => {
    test("should return a string", () => {
        const query = "test";
        const response: string = QueryProcessor(query);
        expect(typeof response).toBe("string");
    });

    test('should return shakespeare description', () => {
        const query = "shakespeare";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
            "English poet, playwright, and actor, widely regarded as the greatest " +
            "writer in the English language and the world's pre-eminent dramatist."
          ));
    });

    test('should return andrew id', () => {
        const query = "What is your Andrew ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("malali");
    });

    test('should return the largest number', () => {
        const query = "Which of the following numbers is the largest: 59, 12, 97?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("97");
    });

    test('should add two numbers', () => {
        const query = "What is 25 plus 97?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("122");
    });

    test.each([
        ["What is 10 minus 4?", "6"],
        ["What is 5 multiplied by 12?", "60"],
        ["What is 12 divided by 4?", "3"],
        ["What is 2 to the power of 10?", "1024"],
        ["What is 3 plus 4 plus 5?", "12"],
        ["What is 3 plus 4 multiplied by 5?", "23"],
        ["Which of the following numbers is the smallest: 59, 12, 97?", "12"],
        ["Which of the following numbers is both a square and a cube: 64, 100, 729, 50?", "64,729"],
        ["Which of the following numbers are primes: 3, 4, 5, 9, 11?", "3,5,11"],
        ["Which of the following numbers are primes: 46, 73, 79, 9, 44?", "73,79"],
        ["What is 46 to the power of 23?", "175158060907268193674686903913845620736"],
        ["What is 2 to the power of 100?", "1267650600228229401496703205376"],
        ["What is 5 factorial?", "120"],
        ["What is the factorial of 6?", "720"],
        ["What is the 10th number in the Fibonacci sequence?", "55"],
        ['Which of the following is an anagram of "listen": enlist, google, banana?', "enlist"],
        ["What colour is a banana?", "yellow"],
        ["Which city is the Eiffel tower in?", "Paris"],
    ])('should answer "%s"', (query, expected) => {
        expect(QueryProcessor(query)).toBe(expected);
    });

    test('should return name', () => {
        const query = "What is your name?";
        const response: string = QueryProcessor(query);
        expect(response).toBe("m");
    })
});