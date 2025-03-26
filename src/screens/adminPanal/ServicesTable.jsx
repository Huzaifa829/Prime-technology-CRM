import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

export default function ServicesTable() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Services</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Service A</TableCell>
            <TableCell><Button variant="outline">Edit</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Pagination total={10} />
    </Card>
  );
}
