import { formatNumber } from "@/lib/utils/format";
import type { PollutantReading } from "@/types/air-quality";

/**
 * Pollutant concentrations as a table.
 *
 * Six values with different magnitudes and one shared unit: a table reads
 * exactly, where six bars on one scale would compress the small ones to
 * nothing.
 */
export function PollutantTable({
  pollutants,
}: {
  pollutants: readonly PollutantReading[];
}) {
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">
        Current pollutant concentrations by compound
      </caption>
      <thead>
        <tr className="border-b text-left">
          <th scope="col" className="py-2 font-medium">
            Pollutant
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Concentration
          </th>
        </tr>
      </thead>
      <tbody>
        {pollutants.map((pollutant) => (
          <tr key={pollutant.key} className="border-b last:border-0">
            <th scope="row" className="py-2 font-normal">
              {pollutant.label}
            </th>
            <td className="tabular py-2 text-right">
              {pollutant.value === null ? (
                <span className="text-muted-foreground">Not published</span>
              ) : (
                <>
                  {formatNumber(pollutant.value)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {pollutant.unit}
                  </span>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
