import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchUsers } from "@/DB/firebaseFunctions";
import { addUserData } from "@/Redux-config/reducers/userSlice";
import { Input } from "@/components/ui/input";
import { Select,SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { auth } from "@/DB/firebase.config";

export default function UsersTable() {
  const dispatch = useDispatch();
  const UserRedux = useSelector(state => state.user.userData);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {

    if (UserRedux.length === 0) {
      loadUsers();
    } else {
      setUsers(UserRedux);
      setLoading(false);
    }
  }, [UserRedux]);

  const loadUsers = async () => {
    setLoading(true);
    const { users, lastDoc } = await fetchUsers();

    users.forEach((item) => dispatch(addUserData(item)));

    setUsers(users);
    setLastDoc(lastDoc);
    setLoading(false);
  };

  // Apply search and filter
  const filteredUsers = users
    .filter(user =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "All" || user.role.toLowerCase() === roleFilter.toLowerCase())
    )
    .sort((a, b) => 
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  // Get current page users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />

<Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)} className="w-1/4">
  <SelectTrigger>
    <span>{roleFilter}</span>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All">All Roles</SelectItem>
    <SelectItem value="Admin">Admin</SelectItem>
    <SelectItem value="Employee">Employee</SelectItem>
  </SelectContent>
</Select>
        <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
        </Button>
      </div>

      {/* Users Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Brands</TableHead>
                <TableHead>Settings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-sm">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.brand?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.brand.map((brand, i) => (
                          <Badge key={i} className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    ) : user.role.toLowerCase() === "admin" ? (
                      <Badge className="bg-blue-200 text-blue-800 px-2 py-1 text-xs rounded-md">
                        Admin can access all brands
                      </Badge>
                    ) : (
                      <Badge className="bg-red-200 text-red-800 px-2 py-1 text-xs rounded-md">
                        No Brand Access Yet
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Settings className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Card>
  );
}
