"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/modules/types/user";

type Props = {
  data: User[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function UserTable({ data, selectedId, onSelect }: Props) {
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "text-purple-400 bg-purple-500/10";
      case "operator":
        return "text-brand bg-blue-500/10";
      case "viewer":
        return "text-green-400 bg-green-500/10";
      default:
        return "text-muted-foreground bg-card";
    }
  };

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="w-[60px]" />
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Email</TableHead>

            <TableHead className="text-muted-foreground">Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => {
            const selected = selectedId === user.id;

            return (
              <TableRow
                key={user.id}
                onClick={() => onSelect(user.id)}
                className={`cursor-pointer border-border hover:bg-card ${
                  selected ? "bg-sky-500/10" : ""
                }`}
              >
                <TableCell>
                  <input type="checkbox" checked={selected} readOnly />
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {user.username}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-2xl font-medium ${getRoleColor(
                      user.role,
                    )}`}
                  >
                    {user.role}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
