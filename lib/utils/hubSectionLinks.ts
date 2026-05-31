/** Omit view-all link when it points at the current hub route (avoids self-link on hub pages). */
export function resolveHubViewAllLink(
  viewAllLink: string | undefined,
  currentPath: string
): string | undefined {
  if (!viewAllLink) {
    return undefined;
  }

  return viewAllLink === currentPath ? undefined : viewAllLink;
}
