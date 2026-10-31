import { Button, ButtonIcon } from "@/components/ui/button"
import {
  DatePicker,
  DatePickerBody,
  DatePickerCalendar,
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerDay,
  DatePickerFooter,
  DatePickerHead,
  DatePickerMonth,
  DatePickerMonths,
  DatePickerNav,
  DatePickerPreset,
  DatePickerSelect,
  DatePickerSelects,
  DatePickerSeparator,
  DatePickerSidebar,
  DatePickerSummary,
  DatePickerTitle,
  type DatePickerDayType,
} from "@/components/ui/date-picker"

// Mirrors the Figma Date Picker page (9402:27552): Date-Component, Date-Picker-Card (Year / Month / Month 2),
// Date-Picker-Range-Card (Year / Month), Double-Date-Picker-Card and Double-Date-Picker-Mobile-Card.
// Feb 2078 starts on a Friday in Figma (weekdayOffset 4), March on a Wednesday... see each calendar.

const dayTypes: { type: DatePickerDayType; label: string }[] = [
  { type: "disabled", label: "Disabled" },
  { type: "head", label: "Head" },
  { type: "active", label: "Active" },
  { type: "hover", label: "Hover" },
  { type: "default", label: "Default" },
  { type: "default-plus", label: "Default Plus" },
  { type: "active-first", label: "Active First" },
  { type: "active-last", label: "Active Last" },
]

const presets = ["Today", "Yesterday", "This Week", "This Month", "This Year", "All Time"]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function YearHead() {
  return (
    <DatePickerHead>
      <DatePickerNav direction="previous" />
      <DatePickerSelects>
        <DatePickerSelect>Feb</DatePickerSelect>
        <DatePickerSelect>2078</DatePickerSelect>
      </DatePickerSelects>
      <DatePickerNav direction="next" />
    </DatePickerHead>
  )
}

function MonthHead({ month = "February" }: { month?: string }) {
  return (
    <DatePickerHead>
      <DatePickerNav direction="previous" />
      <DatePickerTitle>{month}</DatePickerTitle>
      <DatePickerNav direction="next" />
    </DatePickerHead>
  )
}

const single = { from: 14, to: 14 }

export default function DatePickerPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Date-Component (28x28), Type">
        <div className="flex flex-wrap gap-6">
          {dayTypes.map(({ type, label }) => (
            <div key={type} className="flex flex-col items-center gap-2" title={`Type=${label}`}>
              <DatePickerDay type={type}>30</DatePickerDay>
              <span className="font-default text-10 leading-16 text-base-400">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Date-Picker-Card, Type = Year | Month | Month 2">
        <div className="flex flex-wrap items-start gap-10">
          <DatePicker>
            <YearHead />
            <DatePickerBody>
              <DatePickerCalendar year={2078} month={1} weekdayOffset={4} selected={single} dots={[9, 19]} />
            </DatePickerBody>
          </DatePicker>
          <DatePicker>
            <MonthHead />
            <DatePickerBody>
              <DatePickerCalendar year={2078} month={1} weekdayOffset={4} selected={single} dots={[9, 19]} />
            </DatePickerBody>
          </DatePicker>
          <DatePicker variant="plain" size="auto" className="w-55">
            <DatePickerHead className="h-10 justify-start pt-3 pb-2">
              <DatePickerTitle className="text-12">February</DatePickerTitle>
            </DatePickerHead>
            <DatePickerBody>
              <DatePickerCalendar year={2078} month={1} weekdayOffset={4} dots={[9, 19]} />
            </DatePickerBody>
          </DatePicker>
        </div>
      </Section>

      <Section title="Date-Picker-Range-Card, Type = Year | Month">
        <div className="flex flex-wrap items-start gap-10">
          <DatePicker size="compact">
            <YearHead />
            <DatePickerBody>
              <DatePickerCalendar
                year={2078}
                month={1}
                weekdayOffset={4}
                fit="fluid"
                selected={{ from: 7, to: 16 }}
                dots={[9, 19]}
              />
            </DatePickerBody>
            <DatePickerFooter className="h-11 gap-2 pt-0 pr-5.5 pb-3 pl-3">
              <DatePickerConfirm>Confirm</DatePickerConfirm>
              <DatePickerCancel variant="ghost">Cancel</DatePickerCancel>
            </DatePickerFooter>
          </DatePicker>
          <DatePicker size="compact">
            <MonthHead />
            <DatePickerBody>
              <DatePickerCalendar
                year={2078}
                month={1}
                weekdayOffset={4}
                fit="fluid"
                selected={{ from: 11, to: 16 }}
                dots={[9, 19]}
              />
            </DatePickerBody>
            <DatePickerFooter className="h-11 gap-2 pt-0 pr-11.5 pb-3 pl-3">
              <DatePickerConfirm>Confirm</DatePickerConfirm>
              <DatePickerCancel variant="ghost">Cancel</DatePickerCancel>
            </DatePickerFooter>
          </DatePicker>
        </div>
      </Section>

      <Section title="Double-Date-Picker-Card, Type = Calendar (601x320)">
        <DatePicker variant="double" size="auto" className="w-150 flex-row overflow-hidden">
          <DatePickerSidebar>
            {presets.map((label) => (
              <DatePickerPreset key={label} active={label === "This Week"}>
                {label}
              </DatePickerPreset>
            ))}
          </DatePickerSidebar>
          <DatePickerSeparator orientation="vertical" />
          <div className="flex flex-1 flex-col">
            <DatePickerMonths>
              <DatePickerMonth>
                <DatePickerHead>
                  <DatePickerNav direction="previous" />
                  <DatePickerSelects>
                    <DatePickerSelect>Feb</DatePickerSelect>
                    <DatePickerSelect>2078</DatePickerSelect>
                  </DatePickerSelects>
                  <DatePickerNav direction="next" />
                </DatePickerHead>
                <DatePickerBody className="px-3">
                  <DatePickerCalendar year={2078} month={1} weekdayOffset={4} selected={{ from: 7, to: 29 }} />
                </DatePickerBody>
              </DatePickerMonth>
              <DatePickerMonth>
                <DatePickerHead>
                  <DatePickerNav direction="previous" />
                  <DatePickerSelects>
                    <DatePickerSelect>Mar</DatePickerSelect>
                    <DatePickerSelect>2078</DatePickerSelect>
                  </DatePickerSelects>
                  <DatePickerNav direction="next" />
                </DatePickerHead>
                <DatePickerBody className="px-3">
                  <DatePickerCalendar
                    year={2078}
                    month={2}
                    weekdayOffset={4}
                    selected={{ from: 1, to: 15 }}
                    dots={[18]}
                  />
                </DatePickerBody>
              </DatePickerMonth>
            </DatePickerMonths>
            <DatePickerSeparator />
            <DatePickerFooter>
              <DatePickerConfirm>Confirm</DatePickerConfirm>
              <DatePickerCancel>Cancel</DatePickerCancel>
              <DatePickerSummary>
                Selected from <b>13 March</b> to <b>15 February 2078</b>
              </DatePickerSummary>
            </DatePickerFooter>
          </div>
        </DatePicker>
      </Section>

      <Section title="Double-Date-Picker-Mobile-Card, Type = Calendar (260x636)">
        <DatePicker size="auto" className="w-65">
          <div className="p-4">
            <Button variant="outline" size="32" shape="pill" className="w-full justify-between">
              Today
              <ButtonIcon src="/icons/material-unfold-more.svg" position="end" />
            </Button>
          </div>
          <DatePickerSeparator />
          <div className="flex flex-col gap-3 p-4">
            <DatePicker size="auto">
              <YearHead />
              <DatePickerBody>
                <DatePickerCalendar
                  year={2078}
                  month={1}
                  weekdayOffset={4}
                  fit="fluid"
                  selected={{ from: 7, to: 29 }}
                />
              </DatePickerBody>
            </DatePicker>
            <DatePicker size="auto">
              <DatePickerHead>
                <DatePickerNav direction="previous" />
                <DatePickerSelects>
                  <DatePickerSelect>Mar</DatePickerSelect>
                  <DatePickerSelect>2078</DatePickerSelect>
                </DatePickerSelects>
                <DatePickerNav direction="next" />
              </DatePickerHead>
              <DatePickerBody>
                <DatePickerCalendar
                  year={2078}
                  month={2}
                  weekdayOffset={4}
                  fit="fluid"
                  selected={{ from: 1, to: 15 }}
                />
              </DatePickerBody>
            </DatePicker>
          </div>
          <DatePickerSeparator />
          <DatePickerFooter className="h-16 justify-center px-7">
            <DatePickerSummary className="text-center text-12 leading-20">
              Selected from <b>13 March</b> to <b>15 February 2078</b>
            </DatePickerSummary>
          </DatePickerFooter>
        </DatePicker>
      </Section>
    </main>
  )
}
