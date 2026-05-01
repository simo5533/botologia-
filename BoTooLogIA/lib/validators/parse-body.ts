/**
 * Lecture du corps JSON pour mutations (POST/PUT/PATCH).
 * En cas de corps vide ou JSON invalide → `{}` pour laisser Zod produire une erreur structurée.
 */
export async function readMutationJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
