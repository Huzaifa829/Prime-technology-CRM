import { Button } from "@/components/ui/button";
import ServicesTable from "./ServicesTable.jsx";
import BrandsTable from "./BrandsTable.jsx";
import UsersTable from "./UsersTable.jsx";
import { useState } from "react";
import CreateUserModal from "./modals/createUserModal.jsx";
import CreateServiceModal from "./modals/createServiceModal.jsx";

export default function AdminPanel() {
  const [userModal,setUserModal] = useState(false)
  const [serviceModal,setServiceModal] = useState(false)
  return (
    <div className="p-6 space-y-6">
      {/* Buttons */}
      <div className="flex justify-between">
        <Button onClick={()=>setServiceModal(true)}>Add Service</Button>
        <Button  onClick={()=>setUserModal(true)} >Create User</Button>
      </div>

      {/* Services & Brands Tables - Full width in row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="w-full">
          <ServicesTable />
        </div>
        <div className="w-full">
          <BrandsTable />
        </div>
      </div>

      {/* Users Table - Full width */}
      <div className="w-full">
        <UsersTable />
      </div>
      <CreateUserModal open={userModal} onClose={()=>setUserModal(false)}/>
      <CreateServiceModal open={serviceModal} onClose={()=>setServiceModal(false)}/>
    </div>
  );
}
