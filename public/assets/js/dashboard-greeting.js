(() => {
  // GitHub greets by the visitor's time of day, which only the browser knows. The wording add-on renders the three
  // greetings; without it they are empty and the heading keeps the account name.
  const heading = document.querySelector("[data-theme-greeting]");
  if (!heading) return;
  const hour = new Date().getHours();
  const part = hour < 5 ? "evening" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const greeting = heading.dataset[part];
  if (greeting) heading.textContent = greeting;
})();
