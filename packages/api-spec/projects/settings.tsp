using TypeSpec.Http;

namespace Backlog;

// ────────────────────────────────────────────
// Status models and operations
// ────────────────────────────────────────────

/** Project issue status. */
model Status {
  id: int64;
  projectId: int64;
  name: string;
  color: string;
  displayOrder: int32;
}

@route("/projects/{projectIdOrKey}/statuses")
@tag("Statuses")
interface Statuses {
  /** Get list of statuses in the project. */
  @get op list(@path projectIdOrKey: string): Status[] | BacklogErrorResponse;

  /** Add a status to the project. */
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      color: string;
    },
  ): {
    @statusCode statusCode: 201;
    @body status: Status;
  } | BacklogErrorResponse;

  /** Update a status. */
  @patch(#{implicitOptionality: false})
  @route("/{statusId}")
  op update(
    @path projectIdOrKey: string,
    @path statusId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      color?: string;
    },
  ): Status | BacklogErrorResponse;

  /** Delete a status. */
  @delete
  @route("/{statusId}")
  op delete(
    @path projectIdOrKey: string,
    @path statusId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      /** Substitute status ID: issues with the deleted status will be moved to this status. */
      substituteStatusId: int64;
    },
  ): Status | BacklogErrorResponse;

  /** Update display order of statuses. */
  @patch(#{implicitOptionality: false})
  @route("/updateDisplayOrder")
  op updateDisplayOrder(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      @encodedName("application/x-www-form-urlencoded", "statusId[]")
      statusId: int64[];
    },
  ): Status[] | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Issue Type models and operations
// ────────────────────────────────────────────

/** Project issue type. */
model IssueType {
  id: int64;
  projectId: int64;
  name: string;
  color: string;
  displayOrder: int32;
  templateSummary: string | null;
  templateDescription: string | null;
}

@route("/projects/{projectIdOrKey}/issueTypes")
@tag("Issue Types")
interface IssueTypes {
  /** Get list of issue types in the project. */
  @get op list(@path projectIdOrKey: string): IssueType[] | BacklogErrorResponse;

  /** Add an issue type to the project. */
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      color: string;
      templateSummary?: string;
      templateDescription?: string;
    },
  ): {
    @statusCode statusCode: 201;
    @body issueType: IssueType;
  } | BacklogErrorResponse;

  /** Update an issue type. */
  @patch(#{implicitOptionality: false})
  @route("/{issueTypeId}")
  op update(
    @path projectIdOrKey: string,
    @path issueTypeId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      color?: string;
      templateSummary?: string;
      templateDescription?: string;
    },
  ): IssueType | BacklogErrorResponse;

  /** Delete an issue type. */
  @delete
  @route("/{issueTypeId}")
  op delete(
    @path projectIdOrKey: string,
    @path issueTypeId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      /** Substitute issue type ID: issues with the deleted type will be moved to this type. */
      substituteIssueTypeId: int64;
    },
  ): IssueType | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Category models and operations
// ────────────────────────────────────────────

/** Project category. */
model Category {
  id: int64;
  name: string;
  displayOrder: int32;
}

@route("/projects/{projectIdOrKey}/categories")
@tag("Categories")
interface Categories {
  /** Get list of categories in the project. */
  @get op list(@path projectIdOrKey: string): Category[] | BacklogErrorResponse;

  /** Add a category to the project. */
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
    },
  ): {
    @statusCode statusCode: 201;
    @body category: Category;
  } | BacklogErrorResponse;

  /** Update a category. */
  @patch(#{implicitOptionality: false})
  @route("/{categoryId}")
  op update(
    @path projectIdOrKey: string,
    @path categoryId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
    },
  ): Category | BacklogErrorResponse;

  /** Delete a category. */
  @delete
  @route("/{categoryId}")
  op delete(
    @path projectIdOrKey: string,
    @path categoryId: int64,
  ): Category | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Version / Milestone models and operations
// ────────────────────────────────────────────

/** Project version / milestone. */
model Version {
  id: int64;
  projectId: int64;
  name: string;
  description: string;
  startDate: plainDate | null;
  releaseDueDate: plainDate | null;
  archived: boolean;
  displayOrder: int32;
}

@route("/projects/{projectIdOrKey}/versions")
@tag("Versions / Milestones")
interface Versions {
  /** Get list of versions/milestones in the project. */
  @get op list(@path projectIdOrKey: string): Version[] | BacklogErrorResponse;

  /** Add a version/milestone to the project. */
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
      description?: string;
      startDate?: plainDate;
      releaseDueDate?: plainDate;
    },
  ): {
    @statusCode statusCode: 201;
    @body version: Version;
  } | BacklogErrorResponse;

  /** Update a version/milestone. */
  @patch(#{implicitOptionality: false})
  @route("/{versionId}")
  op update(
    @path projectIdOrKey: string,
    @path versionId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      description?: string;
      startDate?: plainDate;
      releaseDueDate?: plainDate;
      archived?: boolean;
    },
  ): Version | BacklogErrorResponse;

  /** Delete a version/milestone. */
  @delete
  @route("/{versionId}")
  op delete(
    @path projectIdOrKey: string,
    @path versionId: int64,
  ): Version | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Custom Field models and operations
// ────────────────────────────────────────────

/**
 * Custom field type code.
 * - 1: Text
 * - 2: TextArea
 * - 3: Numeric
 * - 4: Date
 * - 5: SingleList
 * - 6: MultipleList
 * - 7: CheckBox
 * - 8: RadioButton
 */
enum CustomFieldType {
  Text: 1,
  TextArea: 2,
  Numeric: 3,
  Date: 4,
  SingleList: 5,
  MultipleList: 6,
  CheckBox: 7,
  RadioButton: 8,
}

/** Custom field list item. */
model CustomFieldListItem {
  id: int64;
  name: string;
  displayOrder: int32;
}

/** Custom field definition. */
model CustomField {
  id: int64;
  typeId: CustomFieldType;
  name: string;
  description: string;
  required: boolean;
  applicableIssueTypes: int64[];
  allowAddItem: boolean | null;
  items: CustomFieldListItem[] | null;
}

@route("/projects/{projectIdOrKey}/customFields")
@tag("Custom Fields")
interface CustomFields {
  /** Get list of custom fields in the project. */
  @get op list(@path projectIdOrKey: string): CustomField[] | BacklogErrorResponse;

  /** Add a custom field to the project. */
  @post op create(
    @path projectIdOrKey: string,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      typeId: CustomFieldType;
      name: string;
      description?: string;
      required?: boolean;
      @encodedName("application/x-www-form-urlencoded", "applicableIssueTypes[]")
      applicableIssueTypes?: int64[];
      /** Min value (for Numeric type). */
      min?: float64;
      /** Max value (for Numeric type). */
      max?: float64;
      /** Initial value (for Numeric/Date type). */
      initialValue?: string;
      /** Unit (for Numeric type). */
      unit?: string;
      /** Initial value type for Date (1: Today, 2: Start of project, 3: End of project). */
      initialValueType?: int32;
      /** Initial date (for Date type). */
      initialDate?: plainDate;
      /** Allow input of items (for list types). */
      allowInput?: boolean;
      /** Allow adding items (for list types). */
      allowAddItem?: boolean;
      @encodedName("application/x-www-form-urlencoded", "items[]")
      items?: string[];
    },
  ): {
    @statusCode statusCode: 201;
    @body customField: CustomField;
  } | BacklogErrorResponse;

  /** Update a custom field. */
  @patch(#{implicitOptionality: false})
  @route("/{customFieldId}")
  op update(
    @path projectIdOrKey: string,
    @path customFieldId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
      description?: string;
      required?: boolean;
      @encodedName("application/x-www-form-urlencoded", "applicableIssueTypes[]")
      applicableIssueTypes?: int64[];
      min?: float64;
      max?: float64;
      initialValue?: string;
      unit?: string;
      initialValueType?: int32;
      initialDate?: plainDate;
      allowInput?: boolean;
      allowAddItem?: boolean;
      @encodedName("application/x-www-form-urlencoded", "items[]")
      items?: string[];
    },
  ): CustomField | BacklogErrorResponse;

  /** Delete a custom field. */
  @delete
  @route("/{customFieldId}")
  op delete(
    @path projectIdOrKey: string,
    @path customFieldId: int64,
  ): CustomField | BacklogErrorResponse;

  /** Add a list item to a custom field. */
  @post
  @route("/{customFieldId}/items")
  op addListItem(
    @path projectIdOrKey: string,
    @path customFieldId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name: string;
    },
  ): CustomFieldListItem | BacklogErrorResponse;

  /** Update a list item of a custom field. */
  @patch(#{implicitOptionality: false})
  @route("/{customFieldId}/items/{itemId}")
  op updateListItem(
    @path projectIdOrKey: string,
    @path customFieldId: int64,
    @path itemId: int64,
    @header contentType: "application/x-www-form-urlencoded",
    @body body: {
      name?: string;
    },
  ): CustomFieldListItem | BacklogErrorResponse;

  /** Delete a list item from a custom field. */
  @delete
  @route("/{customFieldId}/items/{itemId}")
  op deleteListItem(
    @path projectIdOrKey: string,
    @path customFieldId: int64,
    @path itemId: int64,
  ): CustomFieldListItem | BacklogErrorResponse;
}

// ────────────────────────────────────────────
// Shared Files operations
// ────────────────────────────────────────────

@route("/projects/{projectIdOrKey}/files")
@tag("Project Shared Files")
interface ProjectSharedFiles {
  /** Get list of shared files in a directory. */
  @get
  @route("/metadata/{path}")
  op list(
    @path projectIdOrKey: string,
    @path path: string,
    ...PaginationQuery,
  ): SharedFile[] | BacklogErrorResponse;

  /** Download a shared file. */
  @get
  @route("/{sharedFileId}")
  op download(
    @path projectIdOrKey: string,
    @path sharedFileId: int64,
  ): {
    @header contentType: "application/octet-stream";
    @body file: bytes;
  } | BacklogErrorResponse;
}
