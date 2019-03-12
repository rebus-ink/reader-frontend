export function arrify (val) {
  if (val === null || val === undefined) {
    return []
  }
  return Array.isArray(val) ? val : [val]
}
