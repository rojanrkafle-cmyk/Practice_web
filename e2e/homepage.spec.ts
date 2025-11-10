import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('displays hero section and main navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('img', { name: /hero/i })).toBeVisible();
    
    // Check navigation
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /swords/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('sword gallery filtering works', async ({ page }) => {
    await page.goto('/');
    
    // Check initial gallery state
    await expect(page.getByTestId('sword-gallery')).toBeVisible();
    
    // Test filter buttons
    await page.getByRole('button', { name: /katana/i }).click();
    await expect(page.getByTestId('sword-card')).toHaveCount(4);
    
    await page.getByRole('button', { name: /wakizashi/i }).click();
    await expect(page.getByTestId('sword-card')).toHaveCount(4);
    
    await page.getByRole('button', { name: /tanto/i }).click();
    await expect(page.getByTestId('sword-card')).toHaveCount(4);
  });

  test('sword modal opens and closes', async ({ page }) => {
    await page.goto('/');
    
    // Click first sword card
    await page.getByTestId('sword-card').first().click();
    
    // Check modal content
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('img')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('contact form submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('+1234567890');
    await page.getByLabel(/interest/i).selectOption('katana');
    await page.getByLabel(/message/i).fill('This is a test message');
    
    // Submit form
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Check success message
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });

  test('mobile responsive behavior', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu behavior
    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();
    
    await menuButton.click();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Check responsive layout
    await expect(page.getByTestId('sword-gallery')).toHaveCSS('grid-template-columns', /1fr/);
  });
});