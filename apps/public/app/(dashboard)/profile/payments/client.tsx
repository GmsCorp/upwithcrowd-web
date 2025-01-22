"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useState } from "react";

export interface Payment {
  projectName: string;
  transactionId: string | null | undefined;
  amount: number;
  paymentStatus: string;
  paymentType: string;
}

interface PaymentsTableProps {
  payments: Payment[];
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const [selectedPayments, setSelectedPayments] = useState<Set<number>>(
    new Set(),
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Mevcut sayfadaki tüm öğelerin indekslerini hesapla
      const startIndex = (currentPage - 1) * itemsPerPage;
      const newSelected = new Set(selectedPayments);

      // Mevcut sayfadaki her öğe için
      paginatedPayments.forEach((_, index) => {
        newSelected.add(startIndex + index);
      });

      setSelectedPayments(newSelected);
    } else {
      // Mevcut sayfadaki öğelerin seçimini kaldır
      const startIndex = (currentPage - 1) * itemsPerPage;
      const newSelected = new Set(selectedPayments);

      paginatedPayments.forEach((_, index) => {
        newSelected.delete(startIndex + index);
      });

      setSelectedPayments(newSelected);
    }
  };

  const handleSelectOne = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedPayments);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedPayments(newSelected);
  };

  const isAllCurrentPageSelected = paginatedPayments.every((_, index) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    return selectedPayments.has(absoluteIndex);
  });

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg">Ödemeler</CardTitle>
        <CardDescription>Ödemelerinizi yönetin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Filtreler <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtre 1</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllCurrentPageSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Proje Adı</TableHead>
              <TableHead>İşlem Numarası</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Ödeme Türü</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.map((payment, index) => {
              const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.has(absoluteIndex)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(absoluteIndex, checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell>{payment.projectName}</TableCell>
                  <TableCell>{payment.transactionId}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        payment.paymentStatus === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : payment.paymentStatus === "PENDING"
                            ? "bg-blue-100 text-blue-700"
                            : payment.paymentStatus === "REJECTION"
                              ? "bg-red-100 text-red-700"
                              : payment.paymentStatus === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {selectedPayments.size} / {payments.length} satır seçildi.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              Önceki
            </Button>
            <span className="text-sm">
              Sayfa {currentPage} / {Math.ceil(payments.length / itemsPerPage)}
            </span>
            <Button
              variant="outline"
              disabled={currentPage * itemsPerPage >= payments.length}
              onClick={() => handlePageChange("next")}
            >
              Sonraki
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
