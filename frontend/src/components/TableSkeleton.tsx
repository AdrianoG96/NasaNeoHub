import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const ROWS = 5
const COLUMNS = 5

const columnWidths = ["w-32", "w-28", "w-36", "w-32", "w-20"]

export function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Min Distance (km)</TableHead>
          <TableHead>Diameter (km)</TableHead>
          <TableHead>Velocity (km/h)</TableHead>
          <TableHead>Hazardous</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from<undefined>({ length: ROWS }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from<undefined>({ length: COLUMNS }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className={`h-4 ${columnWidths[colIndex] ?? "w-24"}`} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}
