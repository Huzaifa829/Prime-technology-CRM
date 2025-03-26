import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Settings } from "lucide-react";

export default function UsersTable() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Settings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>••••••••</TableCell>
            <TableCell><Settings className="w-5 h-5 cursor-pointer" /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Pagination total={20} />
    </Card>
  );
}
