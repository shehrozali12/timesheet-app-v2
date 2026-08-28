import { NextResponse } from "next/server";

export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Timesheet API",
      version: "1.0.0",
      description: "API for managing timesheet entries and employees",
    },
    servers: [
      { url: "https://timesheet-app-v2.vercel.app/api" },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
      schemas: {
        TimesheetEntry: {
          type: "object",
          properties: {
            id: { type: "integer" },
            employee_id: { type: "integer" },
            employee_name: { type: "string" },
            entry_date: { type: "string", format: "date" },
            hours: { type: "number" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Employee: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
      "/entries": {
        get: {
          summary: "Get all timesheet entries",
          operationId: "getEntries",
          responses: {
            "200": {
              description: "List of entries",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/TimesheetEntry" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new timesheet entry",
          operationId: "createEntry",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    employee_id: { type: "integer" },
                    date: { type: "string", format: "date" },
                    hours: { type: "number" },
                  },
                  required: ["employee_id", "date", "hours"],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Entry created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/TimesheetEntry" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/entries/{id}": {
        get: {
          summary: "Get a single timesheet entry",
          operationId: "getEntry",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            "200": {
              description: "The entry",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/TimesheetEntry" },
                    },
                  },
                },
              },
            },
            "404": { description: "Entry not found" },
          },
        },
        put: {
          summary: "Update a timesheet entry",
          operationId: "updateEntry",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    employee_id: { type: "integer" },
                    date: { type: "string", format: "date" },
                    hours: { type: "number" },
                  },
                  required: ["employee_id", "date", "hours"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated entry",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/TimesheetEntry" },
                    },
                  },
                },
              },
            },
            "404": { description: "Entry not found" },
          },
        },
        delete: {
          summary: "Delete a timesheet entry",
          operationId: "deleteEntry",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            "200": { description: "Entry deleted" },
            "404": { description: "Entry not found" },
          },
        },
      },
      "/employees": {
        get: {
          summary: "Get all employees",
          operationId: "getEmployees",
          responses: {
            "200": {
              description: "List of employees",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Employee" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}