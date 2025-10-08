import HeroWrapper from "@/components/home/HeroWrapper";

describe("<HeroWrapper />", () => {
  beforeEach(() => {
    cy.mount(<HeroWrapper />);
  });

  it("renders navigation links", () => {
    cy.contains("Features").should("exist");
    cy.contains("Documentation").should("exist");
    cy.contains("Pricing").should("exist");
  });

  it("navigates to sections when clicking nav items", () => {
    cy.contains("Features").click();
    cy.url().should("include", "#features");

    cy.contains("Documentation").click();
    cy.url().should("include", "#docs");
  });

  it("shows mobile menu when hamburger is clicked", () => {
    cy.viewport("iphone-6");
    cy.get("button").contains("Get Started").should("not.exist");
    cy.get("button").first().click(); // open menu
    cy.contains("Sign In").should("exist");
    cy.contains("Get Started").should("exist");
  });

  it("renders scroll-to-top button after scrolling", () => {
    cy.scrollTo("bottom");
    cy.get("button").contains("Get Started").should("exist"); // sanity check
    cy.get("button").filter(':has(svg)').should("exist"); // ArrowUp button appears
  });

  it("clicking scroll-to-top scrolls the window", () => {
    cy.scrollTo("bottom");
    cy.get("button").filter(':has(svg)').click();
    cy.window().its("scrollY").should("equal", 0);
  });
});
