"use client"

import * as React from "react"

/** True while a widget renders inside the dashboard grid: its card fills the cell and the plot stretches, instead of the picker's natural size. */
const WidgetFluidContext = React.createContext(false)

const WidgetFluid = WidgetFluidContext.Provider
const useWidgetFluid = () => React.useContext(WidgetFluidContext)

export { WidgetFluid, useWidgetFluid }
