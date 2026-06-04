import { test, expect } from "@playwright/test";

// Data-driven structure containing exactly the 6 requested test cases
const taskCases = [
  // Test Case 1
  { board: "Web Application",    column: "To Do",       title: "Implement user authentication", tags: ["Feature", "High Priority"] },
  // Test Case 2
  { board: "Web Application",    column: "To Do",       title: "Fix navigation bug",            tags: ["Bug"] },
  // Test Case 3
  { board: "Web Application",    column: "In Progress", title: "Design system updates",         tags: ["Design"] },
  // Test Case 4
  { board: "Mobile Application", column: "To Do",       title: "Push notification system",      tags: ["Feature"] },
  // Test Case 5
  { board: "Mobile Application", column: "In Progress", title: "Offline mode",                  tags: ["Feature", "High Priority"] },
  // Test Case 6
  { board: "Mobile Application", column: "Done",        title: "App icon design",               tags: ["Design"] },
];

test.describe("LoopQA Kanban Board Tests", () => {
  
  // Setup: Login automation as per requirements
  test.beforeEach(async ({ page }) => {
    await page.goto("https://animated-gingersnap-8cf7f2.netlify.app");
    await page.locator('input#username').fill("admin");
    await page.locator('input#password').fill("password123");
    await page.locator('button[type="submit"]').click();
    
    // Ensure successful login by waiting for the dashboard/sidebar to be visible
    await expect(page.getByRole('button', { name: /Web Application/i }).first()).toBeVisible();
  });

  // Loop through the data array to dynamically generate tests without code duplication
  for (const task of taskCases) {
    test(`Verify "${task.title}" is in "${task.column}" on ${task.board}`, async ({ page }) => {
      
      // Navigate to the correct board using the sidebar button
      await page.getByRole('button', { name: new RegExp(task.board, 'i') }).first().click();

      // Locate the specific column by its heading to ensure strict scoping
      const column = page.locator("div").filter({
        has: page.locator("h2", { hasText: task.column }),
      }).first();

      // Locate the task card specifically inside that targeted column
      const card = column.locator("div").filter({ hasText: task.title }).first();
      await expect(card).toBeVisible();

      // Verify each expected tag exists on the specific task card
      for (const tag of task.tags) {
        await expect(card.locator("span").filter({ hasText: tag }).first()).toBeVisible();
      }
    });
  }
});