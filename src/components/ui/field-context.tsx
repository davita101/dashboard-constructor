"use client"

import * as React from "react"

// Size × Shape of the nearest Field, read by Input / InputGroup so they don't repeat the props.
// Kept in its own client file so Field itself stays usable from Server Components.
type FieldContextValue = {
  size: "60" | "48" | "40" | "32" | "24"
  shape: "rounded" | "pill"
}

const FieldContext = React.createContext<FieldContextValue | null>(null)

function FieldProvider({ size, shape, children }: FieldContextValue & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ size, shape }), [size, shape])
  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}

/** Size / shape of the enclosing Field, or null outside a Field. */
function useFieldContext() {
  return React.useContext(FieldContext)
}

export { FieldProvider, useFieldContext, type FieldContextValue }
