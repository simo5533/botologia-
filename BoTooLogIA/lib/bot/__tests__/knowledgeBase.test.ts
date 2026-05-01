import { describe, it, expect } from "vitest";
import { findBestMatch, getReply } from "../knowledgeBase";

describe("KnowledgeBase Bot", () => {
  it("getReply retourne une chaîne pour 'chatbot'", () => {
    const result = getReply("chatbot");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(10);
  });

  it("getReply retourne une réponse pour 'prix' ou 'devis'", () => {
    const result = getReply("quel est le prix");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("getReply retourne une réponse pour 'bonjour'", () => {
    const result = getReply("bonjour");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("getReply retourne la réponse par défaut pour requête inconnue", () => {
    const result = getReply("xyzabc123inexistant");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(20);
  });

  it("getReply avec withLink retourne { text, link? }", () => {
    const result = getReply("devis", true);
    expect(result).toHaveProperty("text");
    expect(typeof result.text).toBe("string");
  });

  it("findBestMatch retourne null pour chaîne trop courte", () => {
    const match = findBestMatch("x");
    expect(match).toBeNull();
  });

  it("findBestMatch retourne une entrée pour 'services'", () => {
    const match = findBestMatch("quels services proposez-vous");
    expect(match).not.toBeNull();
    expect(match?.reply).toBeTruthy();
    expect(match?.patterns).toBeDefined();
    expect(match?.category).toBe("services");
  });
});
