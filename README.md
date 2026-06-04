# LoopQA Automation Evaluation

This repository contains the Playwright test suite for the LoopQA technical evaluation.

## Architecture
- **Data-Driven:** The test cases are stored in a data array (`taskCases`) to prevent code duplication.
- **Strict Scoping:** The tests use Playwright's `.filter()` to ensure tasks are only validated if they appear inside the correct column.
- **Setup:** A `beforeEach` hook handles the login automation before every test.

## How to run the tests
1. Install dependencies: `npm install`
2. Run the tests: `npx playwright test`
