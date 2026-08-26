import { NextResponse } from "next/server";

export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Timesheet API",
      version: "1.0.0",
      description: "API for managing timesheet entries",
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
            employee: { type: "string" },
            entry_date: { type: "string", format: "date" },
            hours: { type: "number" },
            created_at: { type: "string", format: "date-time" },
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
                    employee: { type: "string" },
                    date: { type: "string", format: "date" },
                    hours: { type: "number" },
                  },
                  required: ["employee", "date", "hours"],
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
                    employee: { type: "string" },
                    date: { type: "string", format: "date" },
                    hours: { type: "number" },
                  },
                  required: ["employee", "date", "hours"],
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
    },
  };

  return NextResponse.json(spec);
}