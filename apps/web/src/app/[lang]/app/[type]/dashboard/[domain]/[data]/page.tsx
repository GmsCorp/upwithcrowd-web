"use client";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import jsonToCSV from "@repo/ayasofyazilim-ui/lib/json-to-csv";
import { useEffect, useState } from "react";
import type {
  TableAction,
  ColumnsType,
  MenuAction,
  ColumnFilter,
} from "@repo/ayasofyazilim-ui/molecules/tables";
import { toast } from "@/components/ui/sonner";
import { createZodObject, getBaseLink } from "src/utils";
import type { FormModifier, TableData } from "../../data";
import { dataConfig } from "../../data";

async function controlledFetch(
  url: string,
  options: RequestInit,
  onSuccess: (_data?: any) => void,
  successMessage = "Successful",
  showToast = true
) {
  try {
    const getData = await fetch(url, options);
    if (!getData.ok) {
      const body = await getData.json();
      toast.error(body.message);
    } else {
      const data = await getData.json();
      onSuccess(data);
      showToast && toast.success(successMessage);
    }
  } catch (error) {
    toast.error(`Fetch error: ${String(error)}`);
  }
}

function convertEnumField(
  value: string | number,
  enumArray: {
    data: string[];
    type: "enum";
  }
): string | number {
  const data = enumArray.data;
  if (typeof value === "number") {
    return data[value];
  }
  return data.indexOf(value);
}

interface ConvertorValue {
  covertTo?: string;
  data: any;
  get: string;
  post: string;
  type: "enum" | "async";
}

function convertAsyncField(value: any, ConvertorValue: ConvertorValue) {
  if (typeof ConvertorValue.data === "function") {
    return;
  }
  const returnValue = ConvertorValue.data.find((item: any) => {
    return item[ConvertorValue.get] === value;
  });

  if (returnValue) {
    return returnValue[ConvertorValue.post];
  }
}

const detailedFilters: Record<string, ColumnFilter[]> = {
  applications: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  scopes: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  languages: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  languageTexts: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  edition: [],
  tenant: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  role: [],
  user: [{ name: "filter", displayName: "Search", type: "string", value: "" }],
  claimType: [
    { name: "filter", displayName: "Search", type: "string", value: "" },
  ],
  securityLogs: [
    { name: "startTime", displayName: "Start Time", type: "date", value: "" },
    { name: "endTime", displayName: "End Time", type: "date", value: "" },
    { name: "userName", displayName: "User Name", type: "string", value: "" },
    {
      name: "applicationName",
      displayName: "Application Name",
      type: "string",
      value: "",
    },
    { name: "clientId", displayName: "Client Id", type: "string", value: "" },
    { name: "identity", displayName: "Identity", type: "string", value: "" },
    {
      name: "correlationId",
      displayName: "Correlation Id",
      type: "string",
      value: "",
    },
  ],
  auditLogs: [
    { name: "startTime", displayName: "Start Time", type: "date", value: "" },
    { name: "endTime", displayName: "End Time", type: "date", value: "" },
    { name: "userName", displayName: "User Name", type: "string", value: "" },
    { name: "Url", displayName: "Url", type: "string", value: "" },
    {
      name: "applicationName",
      displayName: "Application Name",
      type: "string",
      value: "",
    },
    {
      name: "clientIpAddress",
      displayName: "Client Ip Address",
      type: "string",
      value: "",
    },
    {
      name: "httpMethod",
      displayName: "Http Method",
      type: "string",
      value: "",
    },
    {
      name: "minExecutionDuration",
      displayName: "Min Execution Duration",
      type: "number",
      value: "",
    },
    {
      name: "maxExecutionDuration",
      displayName: "Max Execution Duration",
      type: "number",
      value: "",
    },
    {
      name: "correlationId",
      displayName: "Correlation Id",
      type: "string",
      value: "",
    },
  ],
  organization: [],
};

export default function Page({
  params,
}: {
  params: { data: string; domain: string };
}): JSX.Element {
  const fetchLink = getBaseLink(`/api/admin/${params.data}`);
  const [roles, setRoles] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<TableData>(
    dataConfig[params.domain][params.data]
  );

  async function processConvertors() {
    const tempData = { ...formData };
    const schemas = ["createFormSchema", "editFormSchema"] as const;

    for (const schema of schemas) {
      const dataConvertors = tempData[schema]?.convertors;
      if (dataConvertors) {
        for (const [key, value] of Object.entries(dataConvertors)) {
          if (value.type === "async" && typeof value.data === "function") {
            try {
              const tempValue = await value.data();
              if (dataConvertors[key]) {
                dataConvertors[key].data = tempValue;
                dataConvertors[key].type = "async";
              }
            } catch (error) {
              toast.error(`Feild to fetch ${`${key} ${value}`} data`);
            }
          }
        }
      }
    }
    setFormData(tempData);
  }

  function getRoles(_page: number, _filter?: string) {
    let page = _page;
    const filter = _filter || "";
    if (typeof page !== "number") {
      page = 0;
    }

    const _fetchLink = `${fetchLink}?page=${page}&filter=${filter}`;
    setIsLoading(true);
    function onData(data: any) {
      let returnData = data;
      if (!data?.items) {
        returnData = {
          totalCount: data.length,
          items: data,
        };
      }
      const dataConvertors = formData.tableSchema.convertors;
      let transformedData = returnData.items;
      if (dataConvertors) {
        transformedData = returnData.items.map((item: any) => {
          const returnObject = { ...item };
          Object.entries(dataConvertors).forEach(([key, value]) => {
            if (value.type === "enum") {
              returnObject[key] = convertEnumField(returnObject[key], value);
            }
            if (value.type === "async") {
              returnObject[key] = returnObject[value.covertTo];
            }
          });
          return returnObject;
        });
      }
      setRoles({ ...returnData, items: transformedData });
      setIsLoading(false);
    }
    void controlledFetch(
      _fetchLink,
      {
        method: "GET",
      } as RequestInit,
      onData,
      "",
      false
    );
  }

  const createFormSchema = formData.createFormSchema;
  let action: TableAction[] | undefined;
  if (createFormSchema) {
    action = [
      {
        cta: `New ${params.data}`,
        description: `Create a new ${params.data}`,
        autoFormArgs: {
          formSchema: createZodObject(
            createFormSchema.schema,
            createFormSchema.formPositions || [],
            createFormSchema.convertors || {}
          ),
          dependencies: createFormSchema.dependencies,
          fieldConfig: { withoutBorder: true },
        },
        callback: (e) => {
          const transformedData = parseFormValues(createFormSchema, e);
          void controlledFetch(
            fetchLink,
            {
              method: "POST",
              body: JSON.stringify(transformedData),
            },
            getRoles,
            "Added Successfully"
          );
        },
        type: "Dialog",
      },
      {
        cta: `Export CSV`,
        callback: () => {
          jsonToCSV(roles, params.data);
        },
        type: "Action",
      },
    ];
  }

  useEffect(() => {
    void processConvertors();
  }, []);

  function parseFormValues(schema: FormModifier, data: any) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {}
    );
    if (!schema.convertors) return newSchema.parse(data);
    const transformedSchema = newSchema.transform((val) => {
      const returnObject = { ...val };
      if (!schema.convertors) return returnObject;
      Object.entries(schema.convertors).forEach(([key, value]) => {
        if (value.type === "enum") {
          returnObject[key] = convertEnumField(returnObject[key], value);
        } else if (value.type === "async") {
          returnObject[key] = convertAsyncField(returnObject[key], value);
        }
      });
      return returnObject;
    });
    const parsed = transformedSchema.parse(data);
    return parsed;
  }

  const onEdit = (data: any, row: any, editFormSchema: any) => {
    const parsedData = parseFormValues(editFormSchema, data);
    void controlledFetch(
      fetchLink,
      {
        method: "PUT",
        body: JSON.stringify({
          id: row.id,
          requestBody: JSON.stringify(parsedData),
        }),
      },
      getRoles,
      "Updated Successfully"
    );
  };

  const onDelete = (e: any, row: any) => {
    void controlledFetch(
      fetchLink,
      {
        method: "DELETE",
        body: JSON.stringify(row.id),
      },
      getRoles,
      "Deleted Successfully"
    );
  };

  function convertZod(schema: FormModifier) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {}
    );
    return newSchema;
  }
  const editFormSchema = formData.editFormSchema;
  let editFormSchemaZod, autoformEditArgs;
  if (editFormSchema) {
    editFormSchemaZod = convertZod(editFormSchema);
    autoformEditArgs = {
      formSchema: editFormSchemaZod,
      dependencies: formData.editFormSchema?.dependencies,
      convertor: formData.tableSchema.convertors,
      fieldConfig: { withoutBorder: true },
    };
  }
  let actionList: MenuAction[] = [];
  if (formData.tableSchema.actionList) {
    actionList = formData.tableSchema.actionList(controlledFetch, getRoles);
  }
  const columnsData: ColumnsType = {
    type: "Auto",
    data: {
      callback: getRoles,
      autoFormArgs: autoformEditArgs,
      tableType: formData.tableSchema.schema,
      excludeList: formData.tableSchema.excludeList || [],
      onEdit: (data, row) => {
        onEdit(data, row, editFormSchema);
      },
      onDelete,
      actionList,
    },
  };

  return (
    <Dashboard
      action={action}
      cards={[]}
      columnsData={columnsData}
      data={roles?.items}
      detailedFilter={
        detailedFilters[params.data]
      }
      fetchRequest={getRoles}
      filterBy={formData.filterBy}
      isLoading={isLoading}
      rowCount={roles?.totalCount || 0}
      withCards={false}
      withTable
    />
  );
}
