
const USER_MESSAGES = {
    USER_INSERTED_SUCCESS: "User Inserted Successfully.",
    USER_ALREADY_EXISTS: "User already Exist With this Mail Id.",
    USER_NOT_FOUND: "User Not Found",
    INVALID_PASSWORD: "Invalid Password.",
    LOGIN_SUCCESS: "User Login Successfully.",
    REFRESH_TOKEN_REQUIRED: "Refresh token is required.",
    INVALID_REFRESH_TOKEN: "Invalid refresh token.",
    TOKEN_REFRESHED_SUCCESS: "Access token refreshed successfully.",
    USER_FETCHED_SUCCESS: "User Details Fetched Successfully.",
    EMAIL_REQUIRED: "Email Is Required.",
    INVALID_CREDENTIALS: "Invalid credentials.",
    USER_UPDATE_SUCCESS: "User Profile Updated Successfully"
};

const CLIENT_MESSAGES = {

    CLIENTS_COUNT: "Successfully Fetched Clients Count.",
    FAILED_CLIENTS_LIST: "Failed to Fetch List of clients.",
    CLIENT_FETCHED_SUCCESS: "Successfully Fetched List of Clients.",
    CLIENT_NOT_FOUND: "Clients Not Found",
    CLIENT_LIST_FETCH_SUCCESS: "Clients List Fetched Successfully",
    CLIENT_DELETED_SUCCESS: "Client deleted successfully.",
    CLIENT_ID_NOT_FOUND: (id: number) => `Client with ID ${id} does not exist`,
    CLIENT_FETCH_SUCCESS: "Client Fetches Successfully.",
    CLIENTS_NOT_EXIST: "No Clients",
    CLIENT_UPDATE_SUCCESS: "Client Updated Successfully",
    CLIENT_BASED_SERVICES_FETCH_SUCCESS: "Client based services fetched successfully.",
    CLIENT_BASED_INVOICES_FETCH_SUCCESS: "Client based invoices fetched successfully.",
    CLIENT_ADDED_SUCCESS: "Client added successfully",
    CLIENT_EMAIL_ALREADY_EXISTS: "Client with this email already exist",
    CLIENT_LIST_EXPORT_SUCCESS: "Clients Data Exported Successfully",
    CLIENT_ID_REQUIRED: "Client Id is Required",
    PHONE_INVALID_LENGTH: "Phone number must be 10 digits.",
    CLIENT_NAME_EXIST: "Client name already exist"



};

const INVOICES_MESSAGES = {

    FAILED_INVOICES_LIST: "Failed to Fetch List of Invoices.",
    INVOICES_FETCHED_SUCCESS: "Invoices List Fetched Successfully.",
    INVOICES_NOT_FOUND: "Invoices Not Found",
    TOTAL_AMOUNT_FETCHED_SUCCESS: "Total invoice amount fetched successfully.",
    INVOICE_NOT_FOUND: "Invoice Not Found With Id",
    INVOICE_UPDATE_SUCCESS: "Invoice Updated Successfully"



};

const SERVICES_MESSAGES = {

    SERVICES_NOT_FOUND: "Services Not Found",
    SERVICES_FETCHED_SUCCESS: "Services List Fetched Successfully",
    SERVICE_ID_NOT_FOUND: (id: number) => `Service with ID ${id} does not exist`,
    SERVICE_DELETED_SUCCESS: "Service Deleted Successfully",
    SERVICES_NOT_EXIST: "No Services",
    SERVICE_COUNT: "Successfully Fetched Services Count.",
    SERVICE_NOT_FOUND: "Service Not Found With given Id",
    SERVICE_UPDATE_SUCCESS: "Service Updated Successfully",
    SERVICE_ID_INVALID: "Invalid Service id",
    SERVICE_ADDED_SUCCESS: "Service Added Successfully",
    SERVICE_FETCHED_SUCCESS: "Service List Fetched Successfully",
    SERVICE_ALREADY_EXIST:"Service name already exist"
};


const VALIDATION_MESSAGES = {

    VALIDATION_ERROR: "Validation failed. Please check the input data.",
    SERVER_ERROR: "An unexpected server error occurred. Please try again later.",
    FIRST_NAME_REQUIRED: "First Name is required.",
    FIRST_NAME_TOO_SHORT: "First Name must be at least 2 characters long.",
    FIRST_NAME_STRING: "First Name must be a string.",
    FIRST_NAME_INVALID: "Invalid First Name",
    LAST_NAME_REQUIRED: "Last Name is required.",
    LAST_NAME_TOO_SHORT: "Last Name must be at least 2 characters long.",
    LAST_NAME_STRING: "Last Name must be a string.",
    LAST_NAME_INVALID: "Invalid Last Name",
    EMAIL_REQUIRED: "Email is required.",
    INVALID_EMAIL_FORMAT: "Invalid Email Format.",
    PHONE_REQUIRED: "Phone number is required.",
    PHONE_TOO_SHORT: "Phone number must be exactly 10 digits.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
    VALIDATION_FAILED: "Validation Failed"

};

const COMMON_VALIDATIONS = {

    SOMETHING_WENT_WRONG: "Something Went Wrong",
    INVALID_CLIENT_ID: "Invalid client ID provided",
    MISSING_REQUIRED_FIELDS: "Required fields are missing",
    INVALID_SERVICE_ID: "Invalid service Id provided"

};


const CLIENT_VALIDATION_MESSAGES = {
    CLIENT_NAME_REQUIRED: "Client name is required",
    CLIENT_NAME_INVALID: "Invalid client name",
    CLIENT_POC_REQUIRED: "Point of contact (POC) is required",
    CLIENT_POC_INVALID: "POC must only contain alphabets and spaces",
    CLIENT_ROLE_INVALID: "Role must only contain alphabets and spaces",
    EMAIL_REQUIRED: "Email is required",
    INVALID_EMAIL_FORMAT: "Invalid email",
    CLIENT_EMAIL_REQUIRED: "Email is required",
    CLIENT_INVALID_EMAIL_FORMAT: "Invalid email format",
    PHONE_REQUIRED: "Phone number is required.",
    PHONE_TOO_SHORT:"Phone number must be 10 digits",
    PHONE_INVALID: "Invalid phone number",
    PHONE_LENGTH: 'Invalid phone number',
    SECONDARY_PHONE_REQUIRED: "Secondary phone number is required",
    SECONDARY_PHONE_INVALID: "Secondary phone number must be exactly 10 digits",
    INVALID_STATUS: "Status must be either ACTIVE or INACTIVE",
    REMARKS_INVALID: "Remarks must be a string",
    BUSINESS_URL_INVALID: "Business URL must be a valid string",
    ADDRESS_INVALID: "Address must be a valid string",
    STATE_INVALID: "State must be a valid string",
    CITY_INVALID: "City must be a valid string",
    GST_INVALID: "GST value must be a boolean",
    COUNTRY_INVALID: "Country must be a valid string",
    // TOTAL_INVOICE_AMOUNT_INVALID: "Total invoice amount must be a valid number with precision and scale",
    TOTAL_INVOICE_AMOUNT_INVALID: "Total invoice amount must be a number",
    COMPANY_NAME_REQUIRED: "Company name is required",
    COMPANY_NAME_VALIDATIONAS: "company name must only contain alphabets and spaces",
    MIN_REQUIRED: "Must be a 3 letters",
    PHONE_INVALID_LENGTH: "Phone number must be exactly 10 digits."



};

const INVOICE_VALIDATION_MESSAGES = {
    SERVICE_ID_REQUIRED: "Service is required.",
    SERVICE_ID_INVALID: "Service must be a positive integer.",
    CLIENT_ID_REQUIRED: "Client is required.",
    CLIENT_ID_INVALID: "Client must be a positive integer.",
    INVALID_INVOICE_STATUS: "Invalid invoice status.",
    REMARKS_INVALID: "Invalid remarks format.",
    INVOICE_DATE_REQUIRED: "Invoice date is required.",
    INVALID_INVOICE_DATE: "Invalid invoice date format.",
    INVOICE_DATE_MINIMUM: "Invoice date must be today or later.",
    PAYMENT_DATE_INVALID: "Invalid payment date format.",
    INVOICE_AMOUNT_REQUIRED: "Invoice amount is required.",
    INVALID_INVOICE_AMOUNT: "Invalid invoice amount format. Must be a valid number with up to 2 decimal places.",
    INVOICE_ALREADY_EXISTS: "An invoice with this service ID already exists.",
    INVOICE_ADDED_SUCCESS: "Invoice added successfully.",
    INVOICE_UPLOADED_SUCCESS: "Invoice uploaded successfully.",
    INVOICE_DOWNLOADED_SUCCESS: "Invoice uploaded successfully.",
    INVOICE_NAME_INVALID: "Invalid Invoice name ",
    NAME_REQUIRED: "Invoice name is required.",
    NAME_TOO_SHORT: "Invoice name cannot be empty.",


};

const INVOICE_FILES_VALIDATION_MESSAGES = {

    FILE_NAME_INVALID: "File name must be a string",
    FILE_NAME_REQUIRED: "File name is required",
    INVALID_SIZE: "Invalid file size",
    SIZE_NOT_INTEGER: "File size must be an integer",
    CLIENT_ID_REQUIRED: "client id is required",
    INVALID_CLIENT_ID: "Invalid client id",
    INVOICE_ID_REQUIRED: "Invoice id is required",
    INVALID_INVOICE_ID: "Invalid invoice id",
    INVALID_KEY: "Invalid key",
    SERVICE_ID_REQUIRED: "Service is required",
    INVALID_SERVICE_ID: "Invalid Service id"


};

const SERVICE_VALIDATION_MESSAGES = {
    SERVICE_NAME_REQUIRED: "Service is required.",
    SERVICE_NAME_INVALID: "Invalid service name.",
    TYPE_REQUIRED: "Type is required.",
    INVALID_TYPE: "Type must be either RECURRING or ONE-TIME.",
    TITLE_REQUIRED: "Title is required.",
    TITLE_INVALID: "Title must be alphanumeric and cannot contain special characters.",
    TYPE_INVALID: "Type must be a characters.",
    CLIENT_ID_REQUIRED: "Client ID is required.",
    CLIENT_ID_INVALID: "Client ID must be a valid integer.",
    INVALID_STATUS: "Status must be either ACTIVE or INACTIVE.",
    INVOICE_AMOUNT_REQUIRED: "Invoice amount is required.",
    INVALID_INVOICE_AMOUNT: "Invoice amount invalid.",
    REMARKS_INVALID: "Remarks must be a valid text",
};

const CLIENT_SERVICES_MESSAGES = {
    FETCH_SUCCESS: "Client services fetched successfully.",
    FETCH_BY_ID_SUCCESS: (id: number) => `Client service with ID ${id} fetched successfully.`,
    DELETE_SUCCESS: (id: number) => `Client service with ID ${id} deleted successfully.`,
    ID_NOT_FOUND: (id: number) => `Client service with ID ${id} not found.`,
    INVALID_ID: "Invalid client service ID.",
    ADD_SUCCESS: "Client service added successfully.",

};


const CLIENT_SERVICES_VALIDATION_MESSAGES = {
    CLIENT_ID_REQUIRED: "Client ID is required.",
    CLIENT_ID_INVALID: "Client ID must be a valid integer.",
    SERVICE_ID_REQUIRED: "Service Id is required.",
    SERVICE_ID_INVALID: "Service ID must be a valid integer.",
    TITLE_REQUIRED: "Title is required.",
    TITLE_INVALID: "Title must be a non-empty string.",
    STATUS_INVALID: "Status must be either ACTIVE or INACTIVE.",
    INVOICE_AMOUNT_REQUIRED: "Invoice amount is required.",
    INVOICE_AMOUNT_INVALID: "Invoice amount must be a valid number.",
};




export {
    VALIDATION_MESSAGES, USER_MESSAGES, COMMON_VALIDATIONS, CLIENT_MESSAGES, INVOICES_MESSAGES, SERVICES_MESSAGES, CLIENT_VALIDATION_MESSAGES,
    INVOICE_VALIDATION_MESSAGES, SERVICE_VALIDATION_MESSAGES, CLIENT_SERVICES_MESSAGES, CLIENT_SERVICES_VALIDATION_MESSAGES, INVOICE_FILES_VALIDATION_MESSAGES
};
