import { chromium } from "@playwright/test";


const { test, expect } = require("@playwright/test");

test("navigate to the website", async () => {
  const browser = await chromium.launch({slowMo: 3000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://openweathermap.org/");

   const title = await page.title();

  // Verify the title
   expect(title).toBe('Current weather and forecast - OpenWeatherMap');
});



test("Search for weather in a specific city, Interact with elements (click, type).", async () => {
  const browser = await chromium.launch({slowMo: 3000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  const city = "New York";

  await page.goto("https://openweathermap.org/");


  await page.click('input[placeholder="Search city"]');
  await page.fill('input[placeholder="Search city"]',city);

  await page.keyboard.press("Enter");

  await page.waitForTimeout(2000); // Wait for the dropdown to appear


  const firstLiLocator = page.locator('ul.search-dropdown-menu li:first-child');
  await firstLiLocator.click();


 
  const temperature = await page.textContent('div.current-temp span');
  console.log(`The current temperature in ${city} is ${temperature}`);


  await browser.close();

});





test('Handle multiple browser contexts', async () => {

    const browser = await chromium.launch({slowMo: 3000 });
    const context = await browser.newContext();
    const context2 = await browser.newContext();

    const page = await context.newPage();
    const page2=await context2.newPage();


  await page.goto('https://openweathermap.org/');
  await page2.goto('https://openweathermap.org/')
 

  await browser.close();
});



test("Generate a PDF report ,Take a screenshot of the results ,Interact with elements (click, type).", async () => {
  const browser = await chromium.launch({slowMo: 3000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  const city = "New York";

  await page.goto("https://openweathermap.org/");
  

  await page.click('input[placeholder="Search city"]');
  await page.fill('input[placeholder="Search city"]',city);

  await page.keyboard.press("Enter");

  await page.waitForTimeout(2000);


  const firstLiLocator = page.locator('ul.search-dropdown-menu li:first-child');
  await firstLiLocator.click();
  
  await page.screenshot({ path:`${city}.png` });
  await page.pdf({ path: `${city}.pdf2`, format: 'A4' });

 
  const temperature = await page.textContent('div.current-temp span');
  console.log(`The current temperature in ${city} is ${temperature}`);


  await browser.close();

});


test("Mock API responses (for controlled testing), Extract weather information from the site.,", async () => {
  const browser = await chromium.launch({slowMo: 3000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  const city = "New York";

  await context.route('**/data/2.5/weather*', route => {
    const mockResponse = {
      "coord": { "lon": 38.75, "lat": 9.03 },
      "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }],
      "base": "stations",
      "main": { "temp": 293.15, "pressure": 1012, "humidity": 56, "temp_min": 293.15, "temp_max": 293.15 },
      "visibility": 10000,
      "wind": { "speed": 1.5, "deg": 350 },
      "clouds": { "all": 0 },
      "dt": 1560350645,
      "sys": { "type": 1, "id": 1, "message": 0.0065, "country": "ET", "sunrise": 1560292943, "sunset": 1560346481 },
      "timezone": 10800,
      "id": 344979,
      "name": "Addis Ababa",
      "cod": 200
    };
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });

  await page.goto("https://openweathermap.org/");


  await page.click('input[placeholder="Search city"]');
  await page.fill('input[placeholder="Search city"]',city);

  await page.keyboard.press("Enter");

  await page.waitForTimeout(2000);   


  const firstLiLocator = page.locator('ul.search-dropdown-menu li:first-child');
  await firstLiLocator.click();

  // Extract weather information from the site
  const temperature = await page.textContent('div.current-temp span');
  console.log(`The current temperature in ${city} is ${temperature}`);


  await browser.close();

});






