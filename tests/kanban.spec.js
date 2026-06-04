import { test, expect } from "@playwright/test";

const taskCases = [
  // Web Application
  { board: "Web Application",    column: "To Do",       title: "Implement user authentication", tags: ["Feature", "High Priority"] },
  { board: "Web Application",    column: "To Do",       title: "Fix navigation bug",            tags: ["Bug"] },
  { board: "Web Application",    column: "In Progress", title: "Design system updates",         tags: ["Design"] },
  { board: "Web Application",    column: "Review",      title: "API integration",               tags: ["Feature", "High Priority"] },
  { board: "Web Application",    column: "Done",        title: "Update documentation",          tags: ["Feature"] },

  // Mobile Application
  { board: "Mobile Application", column: "To Do",       title: "Push notification system",      tags: ["Feature"] },
  { board: "Mobile Application", column: "In Progress", title: "Offline mode",                  tags: ["Feature", "High Priority"] },
  { board: "Mobile Application", column: "Done",        title: "App icon design",               tags: ["Design"] },

  // Marketing Campaign
  { board: "Marketing Campaign", column: "To Do",       title: "Social media calendar",         tags: ["Feature"] },
  { board: "Marketing Campaign", column: "In Progress", title: "Email campaign",                tags: ["Design", "High Priority"] },
  { board: "Marketing Campaign", column: "Review",      title: "Landing page copy",             tags: ["Design"] },
];

test.describe("LoopQA Kanban Board Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://animated-gingersnap-8cf7f2.netlify.app");
    await page.locator('input#username').fill("admin");
    await page.locator('input#password').fill("password123");
    await page.locator('button[type="submit"]').click();
    // ✅ FIX: use the sidebar button role instead of generic text match
    await expect(page.getByRole('button', { name: /Web Application/i }).first()).toBeVisible();
  });

  for (const task of taskCases) {
    test(`"${task.title}" is in "${task.column}" on ${task.board}`, async ({ page }) => {
      // Navigate to the correct board using the sidebar button
      await page.getByRole('button', { name: new RegExp(task.board, 'i') }).first().click();

      // Find the column by its h2 heading
      const column = page.locator("div").filter({
        has: page.locator("h2", { hasText: task.column }),
      }).first();

      // Find the task card inside that column
      const card = column.locator("div").filter({ hasText: task.title }).first();
      await expect(card).toBeVisible();

      // Verify each tag on the card
      for (const tag of task.tags) {
        await expect(card.locator("span").filter({ hasText: tag }).first()).toBeVisible();
      }
    });
  }
});