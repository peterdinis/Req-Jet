import HeroWrapper from "@/components/home/HeroWrapper";
import mockRouter from "next-router-mock";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

describe("<HeroWrapper />", () => {

  it("renders the HeroWrapper component", () => {
    // overíme, že komponent existuje
    cy.get('[data-cy="hero-wrapper"]').should("exist");
  });
});
