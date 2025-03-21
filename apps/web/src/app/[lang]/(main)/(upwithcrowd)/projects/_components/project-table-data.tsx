import {Progress} from "@/components/ui/progress";
import type {UpwithCrowd_Projects_ListProjectsResponseDto} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {$UpwithCrowd_Projects_ListProjectsResponseDto} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {CheckCircle, XCircle} from "lucide-react";
import {getBaseLink} from "@/utils";

type ProjectsTable = TanstackTableCreationProps<UpwithCrowd_Projects_ListProjectsResponseDto>;

const projectsColumns = (locale: string) => {
  return tanstackTableCreateColumnsByRowData<UpwithCrowd_Projects_ListProjectsResponseDto>({
    rows: $UpwithCrowd_Projects_ListProjectsResponseDto.properties,
    languageData: {
      projectName: "Proje Adı",
      fundableAmount: "Fonlanma Durumu",
      projectStartDate: "Başlangıç Tarihi",
      projectEndDate: "Bitiş Tarihi",
      overFunding: "Ek Fonlama",
    },
    links: {
      projectName: {
        prefix: getBaseLink("projects/detail", locale),
        targetAccessorKey: "id",
      },
    },
    faceted: {
      overFunding: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
    },
    custom: {
      fundableAmount: {
        showHeader: true,

        content(row) {
          const fundedPercentage = row.fundableAmount > 0 ? ((row.totalInvestment ?? 0) / row.fundableAmount) * 100 : 0;
          return (
            <div className="w-full min-w-80 px-4">
              <div className="my-2 flex justify-between text-xs">
                <div>
                  <div>{row.totalInvestment}₺</div>
                </div>
                <div className="text-right">
                  <div>{row.fundableAmount}₺</div>
                </div>
              </div>
              <Progress className="w-full" value={fundedPercentage} />
              <div className="my-2 flex justify-between text-xs">
                <div>
                  <div className="text-muted-foreground">Fonlanan Tutar</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">Fonlanabilir Tutar</div>
                </div>
              </div>
            </div>
          );
        },
      },
    },
    config: {
      locale,
    },
  });
};

function projectsTable() {
  const table: ProjectsTable = {
    fillerColumn: "projectName",
    columnVisibility: {
      type: "show",
      columns: ["projectName", "projectStartDate", "projectEndDate", "fundableAmount", "overFunding"],
    },
    columnOrder: ["fundableAmount", "projectName"],
  };
  return table;
}

export const tableData = {
  projects: {
    columns: projectsColumns,
    table: projectsTable,
  },
};
